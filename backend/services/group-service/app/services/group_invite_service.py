import secrets
from datetime import datetime, timedelta

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.group_invite import GroupInvite
from app.repositories.group_invite_repository import GroupInviteRepository
from app.repositories.member_repository import MemberRepository


class GroupInviteService:

    @staticmethod
    def create_invite(
        db: Session,
        group_id: int,
        user_id: int,
        expires_in_days: int = 7,
        max_uses: int = 20,
    ):
        # Check that creator is a member of the group
        member_repo = MemberRepository()

        member = member_repo.get_member(
            db,
            group_id,
            user_id
        )

        if not member:
            raise HTTPException(
                status_code=403,
                detail="You are not a member of this group"
            )

        # Generate secure random token
        token = secrets.token_urlsafe(32)

        # Expiration
        expires_at = datetime.now() + timedelta(
            days=expires_in_days
        )

        invite = GroupInvite(
            group_id=group_id,
            token=token,
            created_by=user_id,
            expires_at=expires_at,
            max_uses=max_uses,
            used_count=0,
            is_active=True,
        )

        return GroupInviteRepository.create(
            db,
            invite
        )

    @staticmethod
    def get_invite(
        db: Session,
        token: str,
    ):
        invite = GroupInviteRepository.get_by_token(
            db,
            token
        )

        if not invite:
            raise HTTPException(
                status_code=404,
                detail="Invalid invitation"
            )

        # Check active
        if not invite.is_active:
            raise HTTPException(
                status_code=400,
                detail="This invitation is no longer active"
            )

        # Check expiration
        now = datetime.now()

        if invite.expires_at.replace(tzinfo=None) <= now:
            invite.is_active = False
            db.commit()

            raise HTTPException(
                status_code=400,
                detail="This invitation has expired"
            )

        # Check usage
        if invite.used_count >= invite.max_uses:
            invite.is_active = False
            db.commit()

            raise HTTPException(
                status_code=400,
                detail="This invitation has reached its maximum uses"
            )

        return invite

    @staticmethod
    def join_group(
        db: Session,
        token: str,
        user_id: int,
    ):
        # Validate invitation
        invite = GroupInviteService.get_invite(
            db,
            token
        )

        member_repo = MemberRepository()

        # Check if user is already a member
        existing_member = member_repo.get_member(
            db,
            invite.group_id,
            user_id
        )

        if existing_member:
            raise HTTPException(
                status_code=400,
                detail="You are already a member of this group"
            )

        # Add user to group
        member = member_repo.add_member(
            db=db,
            group_id=invite.group_id,
            user_id=user_id,
            role="member"
        )

        # Increase invitation usage
        GroupInviteRepository.increment_usage(
            db,
            invite
        )

        return {
            "message": "Successfully joined the group",
            "group_id": invite.group_id,
            "member_id": member.id
        }

    @staticmethod
    def deactivate_invite(
        db: Session,
        invite: GroupInvite,
    ):
        return GroupInviteRepository.deactivate(
            db,
            invite
        )


    @staticmethod
    def preview_invite(
        db: Session,
        token: str,
    ):
        invite = GroupInviteService.get_invite(
            db,
            token
        )

        # Import here to avoid circular imports
        from app.models.group import Group

        group = (
            db.query(Group)
            .filter(Group.id == invite.group_id)
            .first()
        )

        if not group:
            raise HTTPException(
                status_code=404,
                detail="Group not found"
            )

        return {
            "group_id": group.id,
            "group_name": group.name,
            "expires_at": invite.expires_at,
            "max_uses": invite.max_uses,
            "used_count": invite.used_count,
        }