from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.repositories.user_repository import UserRepository


class UserService:

    def __init__(self):
        self.repository = UserRepository()

    def get_profile(
        self,
        db: Session,
        user_id: int
    ):
        profile = self.repository.get_profile_by_user_id(
            db,
            user_id
        )

        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profile not found"
            )

        return profile

    def create_profile(
        self,
        db: Session,
        user_id: int,
        profile_data: dict
    ):
        existing_profile = self.repository.get_profile_by_user_id(
            db,
            user_id
        )

        if existing_profile:
            raise HTTPException(
                status_code=400,
                detail="Profile already exists"
            )

        return self.repository.create_profile(
            db,
            user_id,
            profile_data
        )

    def update_profile(
        self,
        db: Session,
        user_id: int,
        profile_data: dict
    ):
        profile = self.repository.get_profile_by_user_id(
            db,
            user_id
        )

        if not profile:
            raise HTTPException(
                status_code=404,
                detail="Profile not found"
            )

        return self.repository.update_profile(
            db,
            profile,
            profile_data
        )

    def delete_profile(
        self,
        db: Session,
        user_id: int
    ):
        profile = self.repository.get_profile_by_user_id(
            db,
            user_id
        )

        if not profile:
            raise HTTPException(
                status_code=404,
                detail="Profile not found"
            )

        self.repository.delete_profile(db, profile)

        return {"message": "Profile deleted successfully"}