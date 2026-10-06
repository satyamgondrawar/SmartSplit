from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.profile import Profile
from app.schemas.user_schema import (
    UserProfileCreate,
    UserProfileUpdate,
    UserProfileResponse
)

# Change this import according to your auth-service integration
from app.dependencies.auth import get_current_user


router = APIRouter(prefix="/users", tags=["Users"])


# =========================
# GET MY PROFILE
# =========================

@router.get("/me", response_model=UserProfileResponse)
def get_my_profile(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(Profile).filter(
        Profile.user_id == current_user["user_id"]
    ).first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )

    return profile


# =========================
# CREATE PROFILE
# =========================

@router.post(
    "/profile",
    response_model=UserProfileResponse,
    status_code=status.HTTP_201_CREATED
)
def create_profile(
    profile_data: UserProfileCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    existing_profile = db.query(Profile).filter(
        Profile.user_id == current_user["user_id"]
    ).first()

    if existing_profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Profile already exists"
        )

    new_profile = Profile(
        user_id=current_user["user_id"],
        full_name=profile_data.full_name,
        phone=profile_data.phone,
        bio=profile_data.bio
    )

    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)

    return new_profile


# =========================
# UPDATE PROFILE
# =========================

@router.put("/me", response_model=UserProfileResponse)
def update_profile(
    profile_data: UserProfileUpdate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(Profile).filter(
        Profile.user_id == current_user["user_id"]
    ).first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )

    if profile_data.full_name is not None:
        profile.full_name = profile_data.full_name

    if profile_data.phone is not None:
        profile.phone = profile_data.phone

    if profile_data.bio is not None:
        profile.bio = profile_data.bio

    db.commit()
    db.refresh(profile)

    return profile


# =========================
# DELETE PROFILE
# =========================

@router.delete("/me")
def delete_profile(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(Profile).filter(
        Profile.user_id == current_user["user_id"]
    ).first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )

    db.delete(profile)
    db.commit()

    return {
        "message": "Profile deleted successfully"
    }

# =========================
# GET USER BY ID
# =========================

@router.get("/{user_id}", response_model=UserProfileResponse)
def get_user_by_id(
    user_id: int,
    db: Session = Depends(get_db)
):
    profile = db.query(Profile).filter(
        Profile.user_id == user_id
    ).first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User profile not found"
        )

    return profile