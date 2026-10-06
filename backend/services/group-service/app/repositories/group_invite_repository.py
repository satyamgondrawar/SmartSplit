from sqlalchemy.orm import Session

from app.models.group_invite import GroupInvite


class GroupInviteRepository:

    @staticmethod
    def create(db: Session, invite: GroupInvite):
        db.add(invite)
        db.commit()
        db.refresh(invite)
        return invite

    @staticmethod
    def get_by_token(db: Session, token: str):
        return (
            db.query(GroupInvite)
            .filter(GroupInvite.token == token)
            .first()
        )

    @staticmethod
    def get_active_by_group(
        db: Session,
        group_id: int
    ):
        return (
            db.query(GroupInvite)
            .filter(
                GroupInvite.group_id == group_id,
                GroupInvite.is_active == True
            )
            .all()
        )


    @staticmethod
    def increment_usage(
        db: Session,
        invite: GroupInvite
    ):
        invite.used_count += 1

        if invite.used_count >= invite.max_uses:
            invite.is_active = False

        db.commit()
        db.refresh(invite)

        return invite

    @staticmethod
    def deactivate(
        db: Session,
        invite: GroupInvite
    ):
        invite.is_active = False

        db.commit()
        db.refresh(invite)

        return invite