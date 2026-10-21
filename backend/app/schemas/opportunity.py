from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, HttpUrl


class OpportunityBase(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    description: str = Field(min_length=1)
    opportunity_type: str = Field(min_length=1, max_length=100)
    location: str | None = Field(default=None, max_length=255)
    work_mode: str | None = Field(default=None, max_length=100)
    minimum_experience: int = Field(default=0, ge=0)
    salary_min: int | None = Field(default=None, ge=0)
    salary_max: int | None = Field(default=None, ge=0)
    application_url: HttpUrl | None = None
    status: str = Field(default="OPEN", max_length=50)
    closing_date: datetime | None = None


class OpportunityCreate(OpportunityBase):
    employer_id: int


class OpportunityUpdate(BaseModel):
    title: str | None = Field(default=None, max_length=255)
    description: str | None = None
    opportunity_type: str | None = Field(default=None, max_length=100)
    location: str | None = Field(default=None, max_length=255)
    work_mode: str | None = Field(default=None, max_length=100)
    minimum_experience: int | None = Field(default=None, ge=0)
    salary_min: int | None = Field(default=None, ge=0)
    salary_max: int | None = Field(default=None, ge=0)
    application_url: HttpUrl | None = None
    status: str | None = Field(default=None, max_length=50)
    closing_date: datetime | None = None


class OpportunityResponse(OpportunityBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    employer_id: int
    created_at: datetime
    updated_at: datetime