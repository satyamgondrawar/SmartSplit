from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserProfileCreate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None


class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None


class UserProfileResponse(BaseModel):
    id: int
    user_id: int
    full_name: Optional[str]
    phone: Optional[str]
    bio: Optional[str]
    profile_picture: Optional[str]
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
