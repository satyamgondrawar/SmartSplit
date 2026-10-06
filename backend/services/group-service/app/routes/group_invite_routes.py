from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user_id

from app.controllers.group_invite_controller import (
    GroupInviteController,
)
from app.services.group_invite_service import GroupInviteService

from app.schemas.group_invite_schema import (
    CreateInviteRequest,
    InviteResponse,
    JoinInviteResponse,
    InvitePreviewResponse,
)


router = APIRouter(
    prefix="/groups",
    tags=["Group Invites"],
)


@router.post(
    "/{group_id}/invites",
    response_model=InviteResponse,
)
def create_group_invite(
    group_id: int,
    request: CreateInviteRequest,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    return GroupInviteController.create_invite(
        db=db,
        group_id=group_id,
        user_id=user_id,
        request=request,
    )

@router.post(
    "/invites/{token}/join",
    response_model=JoinInviteResponse,
)
def join_group_with_invite(
    token: str,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    return GroupInviteService.join_group(
        db=db,
        token=token,
        user_id=user_id,
    )

@router.get(
    "/invites/{token}",
    response_model=InvitePreviewResponse,
)
def preview_group_invite(
    token: str,
    db: Session = Depends(get_db),
):
    return GroupInviteService.preview_invite(
        db=db,
        token=token,
    )