from sqlalchemy import Column, Integer, String, DateTime, Text
from datetime import datetime

from app.database import Base


class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, unique=True, nullable=False, index=True)

    full_name = Column(String(100), nullable=True)

    phone = Column(String(20), nullable=True)

    bio = Column(Text, nullable=True)

    profile_picture = Column(String(255), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )