from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.models.user import User
from app.schemas.skill import SkillResponse
from app.security.dependencies import get_current_user
from app.services.skill_service import SkillService


router = APIRouter(
    prefix="/skills",
    tags=["Skills"],
)

skill_service = SkillService()


@router.get("/", response_model=list[SkillResponse])
def get_skills(
    category: str | None = Query(default=None),
    search: str | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if search:
        return skill_service.search_skills(db, search)

    if category:
        return skill_service.get_skills_by_category(db, category)

    return skill_service.get_all_skills(db)


@router.get("/{skill_id}", response_model=SkillResponse)
def get_skill(
    skill_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    skill = skill_service.get_skill_by_id(db, skill_id)

    if skill is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found.",
        )

    return skill
