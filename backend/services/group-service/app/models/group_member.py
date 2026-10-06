from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
    UniqueConstraint
)

from sqlalchemy.sql import func

from app.database import Base


class GroupMember(Base):

    __tablename__ = "group_members"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    group_id = Column(
        Integer,
        ForeignKey("groups.id", ondelete="CASCADE"),
        nullable=False
    )

    user_id = Column(
        Integer,
        nullable=False
    )

    role = Column(
        String(20),
        default="member",
        nullable=False
    )

    joined_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )
    __table_args__ = (
        UniqueConstraint(
            "group_id",
            "user_id",
            name="unique_group_user"
        ),
    )