from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


# =====================================
# CREATE GROUP
# =====================================

class GroupCreate(BaseModel):

    name: str
    description: Optional[str] = None


# =====================================
# UPDATE GROUP
# =====================================

class GroupUpdate(BaseModel):

    name: Optional[str] = None
    description: Optional[str] = None


# =====================================
# GROUP RESPONSE
# =====================================

class GroupResponse(BaseModel):

    id: int
    name: str
    description: Optional[str]
    created_by: int
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


# =====================================
# ADD MEMBER
# =====================================

class MemberCreate(BaseModel):

    user_id: int


# =====================================
# MEMBER RESPONSE
# =====================================

class MemberResponse(BaseModel):

    id: int
    group_id: int
    user_id: int
    full_name: Optional[str] = None
    email: Optional[str] = None
    profile_picture: Optional[str] = None
    role: str
    joined_at: datetime | None = None

    model_config = ConfigDict(
        from_attributes=True
    )
