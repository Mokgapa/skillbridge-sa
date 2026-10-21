from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.models.user import User
from app.schemas.candidate_profile import (
    CandidateProfileCreate,
    CandidateProfileResponse,
    CandidateProfileUpdate,
)
from app.security.dependencies import get_current_user
from app.services.candidate_service import CandidateService


router = APIRouter(
    prefix="/candidates",
    tags=["Candidates"],
)

candidate_service = CandidateService()


@router.post(
    "/profile",
    response_model=CandidateProfileResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_candidate_profile(
    profile_data: CandidateProfileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return candidate_service.create_profile(
            db,
            current_user.id,
            profile_data,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


@router.get(
    "/profile",
    response_model=CandidateProfileResponse,
)
def get_candidate_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = candidate_service.get_profile_by_user_id(
        db,
        current_user.id,
    )

    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate profile not found.",
        )

    return profile


@router.patch(
    "/profile",
    response_model=CandidateProfileResponse,
)
def update_candidate_profile(
    profile_data: CandidateProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = candidate_service.update_profile(
        db,
        current_user.id,
        profile_data,
    )

    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate profile not found.",
        )

    return profile
