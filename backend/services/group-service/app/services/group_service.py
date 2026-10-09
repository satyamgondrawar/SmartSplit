from sqlalchemy.orm import Session
import httpx
import os

from app.repositories.group_repository import GroupRepository
from app.repositories.member_repository import MemberRepository


class GroupService:

    def __init__(self):
        self.group_repository = GroupRepository()
        self.member_repository = MemberRepository()

        # User Service
        self.USER_SERVICE_URL = os.getenv(
            "USER_SERVICE_URL",
            "http://127.0.0.1:8002",
        ).rstrip("/")
        self.AUTH_SERVICE_URL = os.getenv(
            "AUTH_SERVICE_URL",
            "http://127.0.0.1:8001",
        ).rstrip("/")

    # =====================================
    # CREATE GROUP
    # =====================================

    def create_group(
        self,
        db: Session,
        name: str,
        description: str,
        user_id: int
    ):

        group = self.group_repository.create_group(
            db=db,
            name=name,
            description=description,
            created_by=user_id
        )

        # Creator automatically becomes admin
        self.member_repository.add_member(
            db=db,
            group_id=group.id,
            user_id=user_id,
            role="admin"
        )

        return group

    # =====================================
    # GET GROUP
    # =====================================

    def get_group(
        self,
        db: Session,
        group_id: int
    ):

        group = self.group_repository.get_group_by_id(
            db,
            group_id
        )

        if not group:
            raise ValueError("Group not found")

        return group

    # =====================================
    # GET ALL GROUPS
    # =====================================

    def get_all_groups(
        self,
        db: Session
    ):

        return self.group_repository.get_all_groups(db)

    # =====================================
    # GET MY GROUPS
    # =====================================

    def get_my_groups(
        self,
        db: Session,
        user_id: int
    ):

        return self.member_repository.get_user_groups(
            db=db,
            user_id=user_id
        )

    # =====================================
    # CHECK ADMIN
    # =====================================

    def is_group_admin(
        self,
        db: Session,
        group_id: int,
        user_id: int
    ):

        member = self.member_repository.get_member(
            db,
            group_id,
            user_id
        )

        if not member:
            return False

        return member.role == "admin"

    # =====================================
    # UPDATE GROUP
    # =====================================

    def update_group(
        self,
        db: Session,
        group_id: int,
        name: str,
        description: str,
        current_user_id: int
    ):

        group = self.get_group(
            db,
            group_id
        )

        if not self.is_group_admin(
            db,
            group_id,
            current_user_id
        ):

            raise ValueError(
                "Only group admins can update the group"
            )

        return self.group_repository.update_group(
            db=db,
            group=group,
            name=name,
            description=description
        )

    # =====================================
    # DELETE GROUP
    # =====================================

    def delete_group(
        self,
        db: Session,
        group_id: int,
        current_user_id: int
    ):

        group = self.get_group(
            db,
            group_id
        )

        # Only creator can delete group
        if group.created_by != current_user_id:

            raise ValueError(
                "Only group creator can delete this group"
            )

        self.group_repository.delete_group(
            db,
            group
        )

        return True

    # =====================================
    # ADD MEMBER
    # =====================================

    def add_member(
        self,
        db: Session,
        group_id: int,
        user_id: int,
        current_user_id: int
    ):

        self.get_group(
            db,
            group_id
        )

        # Only admins can add members
        if not self.is_group_admin(
            db,
            group_id,
            current_user_id
        ):

            raise ValueError(
                "Only group admins can add members"
            )

        # Check duplicate member
        existing_member = self.member_repository.get_member(
            db,
            group_id,
            user_id
        )

        if existing_member:

            raise ValueError(
                "User already belongs to this group"
            )

        return self.member_repository.add_member(
            db=db,
            group_id=group_id,
            user_id=user_id
        )

    # =====================================
    # GET MEMBERS
    # =====================================

    def get_members(
        self,
        db: Session,
        group_id: int,
        current_user_id: int,
        authorization: str | None = None,
    ):

        # Check group exists
        self.get_group(
            db,
            group_id
        )

        # Check current user belongs to group
        current_member = self.member_repository.get_member(
            db,
            group_id,
            current_user_id
        )

        if not current_member:

            raise ValueError(
                "You are not a member of this group"
            )

        # Get all members
        members = self.member_repository.get_group_members(
            db,
            group_id
        )

        result = []

        for member in members:

            full_name = None
            email = None
            profile_picture = None

            try:

                url = (
                    f"{self.USER_SERVICE_URL}"
                    f"/users/{member.user_id}"
                )

                print("====================================")
                print("Calling User Service:")
                print(url)

                response = httpx.get(
                    url,
                    headers={"Authorization": authorization} if authorization else None,
                    timeout=5.0
                )

                print(
                    "User Service Status:",
                    response.status_code
                )

                print(
                    "User Service Response:",
                    response.text
                )

                if response.status_code == 200:

                    user_data = response.json()
                    print("USER DATA:", user_data)

                    # Support either a flat response or nested profile
                    profile_data = user_data.get("profile") or user_data

                    full_name = profile_data.get("full_name")
                    email = profile_data.get("email")
                    profile_picture = profile_data.get("profile_picture")

                if not full_name or not email:
                    identity_response = httpx.get(
                        f"{self.AUTH_SERVICE_URL}/auth/users/{member.user_id}",
                        headers={"Authorization": authorization} if authorization else None,
                        timeout=5.0,
                    )
                    if identity_response.status_code == 200:
                        identity = identity_response.json()
                        full_name = full_name or identity.get("full_name")
                        email = email or identity.get("email")

                    print(
                        f"Resolved user {member.user_id}: "
                        f"full_name={full_name!r}"
                    )

            except httpx.RequestError as e:

                print(
                    f"User service connection error "
                    f"for user {member.user_id}: {e}"
                )

            except Exception as e:

                print(
                    f"Unexpected error for user "
                    f"{member.user_id}: {e}"
                )

            result.append({

                "id": member.id,

                "group_id": member.group_id,

                "user_id": member.user_id,

                # User information
                "full_name": full_name,

                "email": email,

                "profile_picture": profile_picture,

                # Group information
                "role": member.role,

                "joined_at": member.joined_at
            })

        return result

    # =====================================
    # REMOVE MEMBER
    # =====================================

    def remove_member(
        self,
        db: Session,
        group_id: int,
        user_id: int,
        current_user_id: int
    ):

        self.get_group(
            db,
            group_id
        )

        # Only admins can remove members
        if not self.is_group_admin(
            db,
            group_id,
            current_user_id
        ):

            raise ValueError(
                "Only group admins can remove members"
            )

        # Prevent admin from removing themselves
        if user_id == current_user_id:

            raise ValueError(
                "Admin cannot remove themselves"
            )

        member = self.member_repository.get_member(
            db,
            group_id,
            user_id
        )

        if not member:

            raise ValueError(
                "Member not found"
            )

        self.member_repository.remove_member(
            db,
            member
        )

        return True
