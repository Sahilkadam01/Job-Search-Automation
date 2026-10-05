from sqlalchemy import Column, Integer, String, Text


from app.database import Base


class Application(Base):

    __tablename__ = "applications"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    job_title = Column(
        String,
        nullable=False
    )

    company = Column(
        String,
        nullable=False
    )

    location = Column(
        String,
        default=""
    )

    job_url = Column(
        String,
        default=""
    )

    match_score = Column(
        Integer,
        default=0
    )

    status = Column(
        String,
        default="Saved"
    )

    applied_date = Column(
        String,
        default=""
    )

    notes = Column(
        Text,
        default=""
    )