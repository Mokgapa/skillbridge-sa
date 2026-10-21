from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.models.user import User
from app.security.dependencies import get_current_user
from app.services.micro_internship_service import MicroInternshipService


router = APIRouter(
    prefix="/micro-internships",
    tags=["Micro-Internships"],
)

micro_internship_service = MicroInternshipService()


@router.get("/")
def get_micro_internships(
    search: str | None = Query(default=None, min_length=1),
    active_only: bool = True,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if search:
        return micro_internship_service.search_micro_internships(
            db,
            search,
            active_only=active_only,
        )

    return micro_internship_service.get_all_micro_internships(
        db,
        active_only=active_only,
    )


@router.get("/{micro_internship_id}")
def get_micro_internship(
    micro_internship_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    micro_internship = (
        micro_internship_service.get_micro_internship_by_id(
            db,
            micro_internship_id,
        )
    )

    if micro_internship is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Micro-internship not found.",
        )

    return micro_internship
