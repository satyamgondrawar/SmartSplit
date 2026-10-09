from sqlalchemy.orm import Session
from app.models.profile import Profile


class UserRepository:

    def get_profile_by_user_id(
        self,
        db: Session,
        user_id: int
    ):
        return db.query(Profile).filter(
            Profile.user_id == user_id
        ).first()

    def create_profile(
        self,
        db: Session,
        user_id: int,
        profile_data: dict
    ):
        profile = Profile(
            user_id=user_id,
            full_name=profile_data.get("full_name"),
            phone=profile_data.get("phone"),
            bio=profile_data.get("bio"),
        )

        db.add(profile)
        db.commit()
        db.refresh(profile)

        return profile

    def update_profile(
        self,
        db: Session,
        profile: Profile,
        profile_data: dict
    ):
        for key, value in profile_data.items():
            if value is not None:
                setattr(profile, key, value)

        db.commit()
        db.refresh(profile)

        return profile

    def delete_profile(
        self,
        db: Session,
        profile: Profile
    ):
        db.delete(profile)
        db.commit()

        return True