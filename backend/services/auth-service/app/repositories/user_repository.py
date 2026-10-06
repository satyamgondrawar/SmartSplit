from sqlalchemy.orm import Session

from app.models.user import User


class UserRepository:

    @staticmethod
    def get_by_email(db: Session, email: str):

        return db.query(User).filter(
            User.email == email
        ).first()


    @staticmethod
    def get_by_id(db: Session, user_id: int):

        return db.query(User).filter(
            User.id == user_id
        ).first()


    @staticmethod
    def create_user(
        db: Session,
        name: str,
        email: str,
        password_hash: str
    ):

        user = User(
            name=name,
            email=email,
            password_hash=password_hash
        )

        db.add(user)

        db.commit()

        db.refresh(user)

        return user