from typing import List

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status
)

from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user_id

from app.schemas.group_schema import (
    GroupCreate,
    GroupUpdate,
    GroupResponse,
    MemberCreate,
    MemberResponse
)

from app.services.group_service import GroupService


# ==================================================
# ROUTER
# ==================================================

router = APIRouter(
    prefix="/groups",
    tags=["Groups"]
)


group_service = GroupService()


# ==================================================
# CREATE GROUP
# ==================================================

@router.post(
    "/",
    response_model=GroupResponse,
    status_code=status.HTTP_201_CREATED
)
def create_group(
    group_data: GroupCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):

    try:

        return group_service.create_group(
            db=db,
            name=group_data.name,
            description=group_data.description,
            user_id=current_user_id
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# ==================================================
# GET MY GROUPS
# IMPORTANT: Keep this BEFORE /{group_id}
# ==================================================

@router.get(
    "/my",
    response_model=List[GroupResponse]
)
def get_my_groups(
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):

    return group_service.get_my_groups(
        db=db,
        user_id=current_user_id
    )


# ==================================================
# GET ALL GROUPS
# ==================================================

@router.get(
    "/",
    response_model=List[GroupResponse]
)
def get_all_groups(
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):

    return group_service.get_all_groups(db)


# ==================================================
# GET SINGLE GROUP
# ==================================================

@router.get(
    "/{group_id}",
    response_model=GroupResponse
)
def get_group(
    group_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):

    try:

        return group_service.get_group(
            db=db,
            group_id=group_id
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )


# ==================================================
# UPDATE GROUP
# ==================================================

@router.put(
    "/{group_id}",
    response_model=GroupResponse
)
def update_group(
    group_id: int,
    group_data: GroupUpdate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):

    try:

        return group_service.update_group(
            db=db,
            group_id=group_id,
            name=group_data.name,
            description=group_data.description,
            current_user_id=current_user_id
        )

    except ValueError as e:

        raise HTTPException(
            status_code=403,
            detail=str(e)
        )


# ==================================================
# DELETE GROUP
# ==================================================

@router.delete(
    "/{group_id}"
)
def delete_group(
    group_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):

    try:

        group_service.delete_group(
            db=db,
            group_id=group_id,
            current_user_id=current_user_id
        )

        return {
            "message": "Group deleted successfully"
        }

    except ValueError as e:

        raise HTTPException(
            status_code=403,
            detail=str(e)
        )


# ==================================================
# ADD MEMBER
# ==================================================

@router.post(
    "/{group_id}/members",
    response_model=MemberResponse,
    status_code=status.HTTP_201_CREATED
)
def add_member(
    group_id: int,
    member_data: MemberCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):

    try:

        return group_service.add_member(
            db=db,
            group_id=group_id,
            user_id=member_data.user_id,
            current_user_id=current_user_id
        )

    except ValueError as e:

        raise HTTPException(
            status_code=403,
            detail=str(e)
        )


# ==================================================
# GET GROUP MEMBERS
# ==================================================

@router.get(
    "/{group_id}/members",
    response_model=List[MemberResponse]
)
def get_members(
    group_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):

    try:

        return group_service.get_members(
            db=db,
            group_id=group_id,
            current_user_id=current_user_id
        )

    except ValueError as e:

        raise HTTPException(
            status_code=403,
            detail=str(e)
        )

# ==================================================
# REMOVE MEMBER
# ==================================================

@router.delete(
    "/{group_id}/members/{user_id}"
)
def remove_member(
    group_id: int,
    user_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):

    try:

        group_service.remove_member(
            db=db,
            group_id=group_id,
            user_id=user_id,
            current_user_id=current_user_id
        )

        return {
            "message": "Member removed successfully"
        }

    except ValueError as e:

        raise HTTPException(
            status_code=403,
            detail=str(e)
        )