from pydantic import BaseModel


class ApplicationCreate(BaseModel):

    job_title: str
    company: str
    location: str = ""
    job_url: str = ""
    match_score: int = 0
    status: str = "Saved"
    applied_date: str = ""
    notes: str = ""


class ApplicationUpdate(BaseModel):

    status: str | None = None
    applied_date: str | None = None
    notes: str | None = None