from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field


class EducationBase(BaseModel):
    institution: str = Field(min_length=1, max_length=255)
    qualification: str = Field(min_length=1, max_length=255)
    field_of_study: str | None = Field(default=None, max_length=255)
    start_date: date | None = None
    end_date: date | None = None
    description: str | None = None


class EducationCreate(EducationBase):
    candidate_id: int


class EducationUpdate(BaseModel):
    institution: str | None = Field(default=None, max_length=255)
    qualification: str | None = Field(default=None, max_length=255)
    field_of_study: str | None = Field(default=None, max_length=255)
    start_date: date | None = None
    end_date: date | None = None
    description: str | None = None


class EducationResponse(EducationBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    candidate_id: int
    created_at: datetime