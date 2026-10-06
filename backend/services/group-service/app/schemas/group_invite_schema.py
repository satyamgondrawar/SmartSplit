from datetime import datetime

from pydantic import BaseModel, ConfigDict


class CreateInviteRequest(BaseModel):
    expires_in_days: int = 7
    max_uses: int = 20


class InviteResponse(BaseModel):
    id: int
    group_id: int
    token: str
    expires_at: datetime
    max_uses: int
    used_count: int
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class JoinInviteResponse(BaseModel):
    message: str
    group_id: int
    member_id: int

class InvitePreviewResponse(BaseModel):
    group_id: int
    group_name: str
    expires_at: datetime
    max_uses: int
    used_count: int