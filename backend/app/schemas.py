
from pydantic import BaseModel, EmailStr, Field

class UserRegister(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

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