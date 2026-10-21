from pydantic import BaseModel, ConfigDict, Field


class OpportunitySkillBase(BaseModel):
    skill_id: int
    required_level: int = Field(default=1, ge=1, le=5)
    is_required: bool = True


class OpportunitySkillCreate(OpportunitySkillBase):
    opportunity_id: int


class OpportunitySkillUpdate(BaseModel):
    required_level: int | None = Field(default=None, ge=1, le=5)
    is_required: bool | None = None


class OpportunitySkillResponse(OpportunitySkillBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    opportunity_id: int