from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.models.user import User
from app.security.dependencies import get_current_user
from app.services.career_pathway_service import CareerPathwayService


router = APIRouter(
    prefix="/career-pathways",
    tags=["Career Pathways"],
)

career_pathway_service = CareerPathwayService()


@router.get("/")
def get_career_pathways(
    search: str | None = Query(default=None, min_length=1),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if search:
        return career_pathway_service.search_pathways(
            db,
            search,
        )

    return career_pathway_service.get_all_pathways(db)


@router.get("/{pathway_id}")
def get_career_pathway(
    pathway_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    pathway = career_pathway_service.get_pathway_by_id(
        db,
        pathway_id,
    )

    if pathway is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Career pathway not found.",
        )

    return pathway


@router.get("/{pathway_id}/skills")
def get_career_pathway_skills(
    pathway_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    skills = career_pathway_service.get_pathway_skills(
        db,
        pathway_id,
    )

    if skills is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Career pathway not found.",
        )

    return skills
