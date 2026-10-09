from fastapi import FastAPI, Depends
from app.models.user import User
from app.database.connection import engine, Base
from fastapi.middleware.cors import CORSMiddleware

from app.controllers.auth_controller import router as auth_router

from app.core.dependencies import get_current_user
from app.repositories.user_repository import UserRepository
from app.database.connection import get_db
from fastapi import HTTPException, status
from sqlalchemy.orm import Session


# Create database tables
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="SmartSplit Authentication Service",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)


@app.get("/")
def root():

    return {
        "message": "SmartSplit Auth Service is running"
    }


@app.get("/health")
def health():

    return {
        "status": "healthy"
    }


@app.get("/auth/me")
def get_profile(
    current_user=Depends(get_current_user)
):

    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email
    }


@app.get("/auth/users/{user_id}")
def get_user_summary(
    user_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return a registered identity for an authenticated group lookup."""
    user = UserRepository.get_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return {
        "user_id": user.id,
        "full_name": user.name,
        "email": user.email,
    }
