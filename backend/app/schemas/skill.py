from pydantic import BaseModel, ConfigDict, Field


class SkillBase(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    category: str | None = Field(default=None, max_length=100)
    description: str | None = Field(default=None, max_length=500)


class SkillCreate(SkillBase):
    pass


class SkillUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    category: str | None = Field(default=None, max_length=100)
    description: str | None = Field(default=None, max_length=500)


class SkillResponse(SkillBase):
    model_config = ConfigDict(from_attributes=True)

    id: int