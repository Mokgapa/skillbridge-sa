from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, HttpUrl


class ProjectBase(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = None
    project_url: HttpUrl | None = None
    github_url: HttpUrl | None = None
    technologies: str | None = None


class ProjectCreate(ProjectBase):
    candidate_id: int


class ProjectUpdate(BaseModel):
    title: str | None = Field(default=None, max_length=255)
    description: str | None = None
    project_url: HttpUrl | None = None
    github_url: HttpUrl | None = None
    technologies: str | None = None


class ProjectResponse(ProjectBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    candidate_id: int
    created_at: datetime
    updated_at: datetime