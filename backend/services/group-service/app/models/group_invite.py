from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
    ForeignKey,
)
from sqlalchemy.sql import func

from app.database import Base


class GroupInvite(Base):
    __tablename__ = "group_invites"

    id = Column(Integer, primary_key=True, index=True)

    group_id = Column(
        Integer,
        ForeignKey("groups.id", ondelete="CASCADE"),
        nullable=False,
    )

    token = Column(
        String(128),
        unique=True,
        nullable=False,
        index=True,
    )

    created_by = Column(
        Integer,
        nullable=False,
    )

    expires_at = Column(
        DateTime,
        nullable=False,
    )

    max_uses = Column(
        Integer,
        default=20,
        nullable=False,
    )

    used_count = Column(
        Integer,
        default=0,
        nullable=False,
    )

    is_active = Column(
        Boolean,
        default=True,
        nullable=False,
    )

    created_at = Column(
        DateTime,
        server_default=func.now(),
        nullable=False,
    )