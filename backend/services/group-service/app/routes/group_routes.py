from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db

from app.schemas.group_schema import (
    GroupCreate,
    GroupResponse
)

from app.dependencies import get_current_user_id
from app.controllers.group_controller import GroupController

from app.models.group import Group
from app.models.group_member import GroupMember


router = APIRouter(
    prefix="/groups",
    tags=["Groups"]
)


# =========================================================
# CREATE GROUP
# =========================================================

@router.post("/", response_model=GroupResponse)
def create_group(
    group_data: GroupCreate,
    current_user=Depends(get_current_user_id),
    db: Session = Depends(get_db)
):

    user_id = current_user["user_id"]

    return GroupController.create_group(
        db,
        group_data,
        user_id
    )


# =========================================================
# GET MY GROUPS
# =========================================================

@router.get("/my", response_model=list[GroupResponse])
def get_my_groups(
    current_user=Depends(get_current_user_id),
    db: Session = Depends(get_db)
):

    user_id = current_user["user_id"]

    groups = (
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

    return groups

# =========================================================
# GET GROUP MEMBERS
# =========================================================
from fastapi import HTTPException

@router.get("/{group_id}/members")
def get_group_members(
    group_id: int,
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):

    # Check whether current user belongs to this group
    current_member = (
        db.query(GroupMember)
        .filter(
            GroupMember.group_id == group_id,
            GroupMember.user_id == current_user_id
        )
        .first()
    )

    if not current_member:
        raise HTTPException(
            status_code=403,
            detail="You are not a member of this group"
        )

    # Get all members
    members = (
        db.query(GroupMember)
        .filter(
            GroupMember.group_id == group_id
        )
        .all()
    )

    return members