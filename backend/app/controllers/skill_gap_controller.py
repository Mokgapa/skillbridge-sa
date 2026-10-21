from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.models.user import User
from app.security.dependencies import get_current_user
from app.services.candidate_service import CandidateService
from app.services.skill_gap_service import SkillGapService


router = APIRouter(
    prefix="/skill-gaps",
    tags=["Skill Gap Analysis"],
)

candidate_service = CandidateService()
skill_gap_service = SkillGapService()


class SkillGapRequest(BaseModel):
    required_skill_ids: list[int] = Field(
        ...,
        min_length=1,
        description="IDs of skills required for the target opportunity or pathway.",
    )


@router.post("/analyze")
def analyze_skill_gaps(
    request: SkillGapRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    candidate = candidate_service.get_profile_by_user_id(
        db,
        current_user.id,
    )

    if candidate is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Create your candidate profile first.",
        )

    return skill_gap_service.get_candidate_skill_gap_summary(
        db,
        candidate.id,
        request.required_skill_ids,
    )


@router.post("/missing-skills")
def get_missing_skills(
    request: SkillGapRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    candidate = candidate_service.get_profile_by_user_id(
        db,
        current_user.id,
    )

    if candidate is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Create your candidate profile first.",
        )

    return skill_gap_service.get_candidate_skill_gaps(
        db,
        candidate.id,
        request.required_skill_ids,
    )
