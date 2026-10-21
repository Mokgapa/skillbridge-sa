from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, HttpUrl


class EmployerProfileBase(BaseModel):
    company_name: str = Field(min_length=1, max_length=255)
    industry: str | None = Field(default=None, max_length=255)
    description: str | None = None
    website: HttpUrl | None = None
    location: str | None = Field(default=None, max_length=255)
    company_size: str | None = Field(default=None, max_length=100)


class EmployerProfileCreate(EmployerProfileBase):
    user_id: int


class EmployerProfileUpdate(BaseModel):
    company_name: str | None = Field(default=None, max_length=255)
    industry: str | None = Field(default=None, max_length=255)
    description: str | None = None
    website: HttpUrl | None = None
    location: str | None = Field(default=None, max_length=255)
    company_size: str | None = Field(default=None, max_length=100)


class EmployerProfileResponse(EmployerProfileBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime