from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field, HttpUrl


class CandidateProfileBase(BaseModel):
    headline: str | None = Field(default=None, max_length=255)
    bio: str | None = None
    location: str | None = Field(default=None, max_length=255)
    date_of_birth: date | None = None
    phone: str | None = Field(default=None, max_length=30)
    linkedin_url: HttpUrl | None = None
    github_url: HttpUrl | None = None
    portfolio_url: HttpUrl | None = None


class CandidateProfileCreate(CandidateProfileBase):
    user_id: int


class CandidateProfileUpdate(BaseModel):
    headline: str | None = Field(default=None, max_length=255)
    bio: str | None = None
    location: str | None = Field(default=None, max_length=255)
    date_of_birth: date | None = None
    phone: str | None = Field(default=None, max_length=30)
    linkedin_url: HttpUrl | None = None
    github_url: HttpUrl | None = None
    portfolio_url: HttpUrl | None = None


class CandidateProfileResponse(CandidateProfileBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime