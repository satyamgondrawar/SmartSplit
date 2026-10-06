from fastapi import APIRouter
from app.schemas.password_reset import ForgotPasswordRequest

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/forgot-password")
def forgot_password(request: ForgotPasswordRequest):
    # Temporary development response
    return {
        "message": "If an account exists with this email, a password reset link has been sent."
    }
