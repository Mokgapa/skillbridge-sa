from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class MatchResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    candidate_id: int
    opportunity_id: int
    match_score: Decimal = Field(ge=0, le=100)
    explanation: str | None
    status: str
    created_at: datetime


class MatchRequest(BaseModel):
    candidate_id: int
    opportunity_id: int