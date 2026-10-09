from fastapi import Depends

from app.dependencies.auth import get_current_user


def get_current_user_id(current_user=Depends(get_current_user)) -> int:
    """Compatibility dependency backed by the canonical JWT verifier."""
    return current_user["user_id"]
