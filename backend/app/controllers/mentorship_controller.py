from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.models.user import User
from app.security.dependencies import get_current_user
from app.services.mentorship_service import MentorshipService


router = APIRouter(
    prefix="/mentorships",
    tags=["Mentorship"],
)

mentorship_service = MentorshipService()


@router.get("/")
def get_my_mentorships(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return mentorship_service.get_user_mentorships(
        db,
        current_user.id,
    )


@router.get("/{mentorship_id}")
def get_mentorship(
    mentorship_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    mentorship = mentorship_service.get_mentorship(
        db,
        mentorship_id,
    )

    if mentorship is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mentorship record not found.",
        )

    if current_user.id not in {
        mentorship.mentor_user_id,
        mentorship.mentee_user_id,
    }:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot view this mentorship record.",
        )

    return mentorship
