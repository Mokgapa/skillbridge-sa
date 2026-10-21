from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field


class WorkExperienceBase(BaseModel):
    company_name: str = Field(min_length=1, max_length=255)
    job_title: str = Field(min_length=1, max_length=255)
    employment_type: str | None = Field(default=None, max_length=100)
    location: str | None = Field(default=None, max_length=255)
    start_date: date | None = None
    end_date: date | None = None
    is_current: bool = False
    description: str | None = None


class WorkExperienceCreate(WorkExperienceBase):
    candidate_id: int


class WorkExperienceUpdate(BaseModel):
    company_name: str | None = Field(default=None, max_length=255)
    job_title: str | None = Field(default=None, max_length=255)
    employment_type: str | None = Field(default=None, max_length=100)
    location: str | None = Field(default=None, max_length=255)
    start_date: date | None = None
    end_date: date | None = None
    is_current: bool | None = None
    description: str | None = None


class WorkExperienceResponse(WorkExperienceBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    candidate_id: int
    created_at: datetime