from sqlalchemy.orm import Session

from app.models.group import Group
from app.models.group_member import GroupMember


class GroupRepository:

    def create_group(
        self,
        db: Session,
        name: str,
        description: str,
        created_by: int
    ):

        group = Group(
            name=name,
            description=description,
            created_by=created_by
        )

        db.add(group)
        db.commit()
        db.refresh(group)

        return group


    def get_group_by_id(
        self,
        db: Session,
        group_id: int
    ):

        return db.query(Group).filter(
            Group.id == group_id
        ).first()


    def get_all_groups(
        self,
        db: Session
    ):

        return db.query(Group).all()


    def update_group(
        self,
        db: Session,
        group: Group,
        name: str = None,
        description: str = None
    ):

        if name is not None:
            group.name = name

        if description is not None:
            group.description = description

        db.commit()
        db.refresh(group)

        return group


    def delete_group(
        self,
        db: Session,
        group: Group
    ):

        db.delete(group)
        db.commit()

        return True


    # =====================================
    # GET USER GROUPS
    # =====================================

    def get_user_groups(
        self,
        db: Session,
        user_id: int
    ):

        return (
            db.query(Group)
            .join(
                GroupMember,
                Group.id == GroupMember.group_id
            )
            .filter(
                GroupMember.user_id == user_id
            )
            .all()
        )