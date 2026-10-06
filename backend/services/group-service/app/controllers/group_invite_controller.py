from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.schemas.group_invite_schema import (
    CreateInviteRequest,
    InviteResponse,
)
from app.services.group_invite_service import GroupInviteService


class GroupInviteController:

    @staticmethod
    def create_invite(
        db: Session,
        group_id: int,
        user_id: int,
        request: CreateInviteRequest,
    ) -> InviteResponse:

        # Basic validation
        if request.expires_in_days <= 0:
            raise HTTPException(
                status_code=400,
                detail="Expiration must be greater than 0 days",
            )

        if request.max_uses <= 0:
            raise HTTPException(
                status_code=400,
                detail="Maximum uses must be greater than 0",
            )

        invite = GroupInviteService.create_invite(
            db=db,
            group_id=group_id,
            user_id=user_id,
            expires_in_days=request.expires_in_days,
            max_uses=request.max_uses,
        )

        return invite