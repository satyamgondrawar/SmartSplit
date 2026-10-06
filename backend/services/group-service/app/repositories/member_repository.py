from sqlalchemy.orm import Session
from app.models.group import Group
from app.models.group_member import GroupMember


class MemberRepository:


    def add_member(
        self,
        db: Session,
        group_id: int,
        user_id: int,
        role: str = "member"
    ):

        member = GroupMember(
            group_id=group_id,
            user_id=user_id,
            role=role
        )

        db.add(member)
        db.commit()
        db.refresh(member)

        return member


    def get_member(
        self,
        db: Session,
        group_id: int,
        user_id: int
    ):

        return db.query(GroupMember).filter(
            GroupMember.group_id == group_id,
            GroupMember.user_id == user_id
        ).first()


    def get_group_members(
        self,
        db: Session,
        group_id: int
    ):

        return db.query(GroupMember).filter(
            GroupMember.group_id == group_id
        ).all()

    
        
    def get_user_groups(self, db: Session, user_id: int):
        return (
            db.query(Group)
            .join(
                GroupMember,
                Group.id == GroupMember.group_id
            )
            .filter(GroupMember.user_id == user_id)
            .all()
        )


    def remove_member(
        self,
        db: Session,
        member: GroupMember
    ):

        db.delete(member)
        db.commit()

        return True