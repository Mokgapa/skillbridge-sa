from pydantic import BaseModel, ConfigDict, Field


class CandidateSkillBase(BaseModel):
    skill_id: int
    proficiency_level: int = Field(ge=1, le=5)
    years_experience: int = Field(default=0, ge=0)


class CandidateSkillCreate(CandidateSkillBase):
    candidate_id: int


class CandidateSkillUpdate(BaseModel):
    proficiency_level: int | None = Field(default=None, ge=1, le=5)
    years_experience: int | None = Field(default=None, ge=0)


class CandidateSkillResponse(CandidateSkillBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    candidate_id: int