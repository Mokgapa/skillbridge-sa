from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ApplicationCreate(BaseModel):
    candidate_id: int
    opportunity_id: int
    cover_letter: str | None = None


class ApplicationUpdate(BaseModel):
    status: str | None = Field(default=None, max_length=50)
    employer_notes: str | None = None


class ApplicationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    candidate_id: int
    opportunity_id: int
    status: str
    cover_letter: str | None
    employer_notes: str | None
    applied_at: datetime
    updated_at: datetime