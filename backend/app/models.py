
from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    ForeignKey
)
from sqlalchemy.orm import relationship

from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)

    email = Column(
        String(255),
        unique=True,
        index=True,
        nullable=False
    )

    hashed_password = Column(String(255), nullable=False)

    applications = relationship(
        "Application",
        back_populates="owner",
        cascade="all, delete-orphan"
    )

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True,
        index=True
    )

    job_title = Column(String, nullable=False)
    company = Column(String, nullable=False)
    location = Column(String, default="")
    job_url = Column(String, default="")
    match_score = Column(Integer, default=0)
    status = Column(String, default="Saved")
    applied_date = Column(String, default="")
    notes = Column(Text, default="")

    owner = relationship(
        "User",
        back_populates="applications"
    )