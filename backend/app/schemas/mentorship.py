from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class MentorshipCreate(BaseModel):
    mentor_user_id: int
    mentee_user_id: int
    focus_area: str | None = Field(default=None, max_length=255)
    goals: str | None = None


class MentorshipUpdate(BaseModel):
    focus_area: str | None = Field(default=None, max_length=255)
    status: str | None = Field(default=None, max_length=50)
    goals: str | None = None
    started_at: datetime | None = None
    completed_at: datetime | None = None


class MentorshipResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    mentor_user_id: int
    mentee_user_id: int
    focus_area: str | None
    status: str
    goals: str | None
    started_at: datetime | None
    completed_at: datetime | None
    created_at: datetime