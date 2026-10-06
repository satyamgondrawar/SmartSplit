from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.database.connection import get_db

from app.schemas.auth_schema import (
    RegisterRequest,
    LoginRequest,
    UserResponse,
    TokenResponse
)

from app.services.auth_service import AuthService


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post(
    "/register",
    response_model=UserResponse
)
def register(
    request: RegisterRequest,
    db: Session = Depends(get_db)
):

    user = AuthService.register_user(
        db,
        request.name,
        request.email,
        request.password
    )

    return user


@router.post(
    "/login",
    response_model=TokenResponse
)
def login(
    request: LoginRequest,
    db: Session = Depends(get_db)
):

    return AuthService.login_user(
        db,
        request.email,
        request.password
    )