from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.models.user import User
from app.schemas.work_experience import (
    WorkExperienceCreate,
    WorkExperienceResponse,
    WorkExperienceUpdate,
)
from app.security.dependencies import get_current_user
from app.services.candidate_service import CandidateService
from app.services.work_experience_service import WorkExperienceService


router = APIRouter(
    prefix="/work-experience",
    tags=["Work Experience"],
)

candidate_service = CandidateService()
work_experience_service = WorkExperienceService()


def get_candidate_profile_id(db: Session, user_id: int) -> int:
    profile = candidate_service.get_profile_by_user_id(db, user_id)

    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Create your candidate profile first.",
        )

    return profile.id


@router.post(
    "/",
    response_model=WorkExperienceResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_work_experience(
    experience_data: WorkExperienceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    candidate_id = get_candidate_profile_id(db, current_user.id)

    return work_experience_service.create_work_experience(
        db,
        candidate_id,
        experience_data,
    )


@router.get("/", response_model=list[WorkExperienceResponse])
def get_my_work_experience(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    candidate_id = get_candidate_profile_id(db, current_user.id)

    return work_experience_service.get_candidate_work_experience(
        db,
        candidate_id,
    )


@router.patch(
    "/{experience_id}",
    response_model=WorkExperienceResponse,
)
def update_work_experience(
    experience_id: int,
    experience_data: WorkExperienceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    candidate_id = get_candidate_profile_id(db, current_user.id)

    experience = work_experience_service.get_work_experience_by_id(
        db,
        experience_id,
    )

    if experience is None or experience.candidate_id != candidate_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Work experience record not found.",
        )

    return work_experience_service.update_work_experience(
        db,
        experience_id,
        experience_data,
    )


@router.delete(
    "/{experience_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_work_experience(
    experience_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    candidate_id = get_candidate_profile_id(db, current_user.id)

    experience = work_experience_service.get_work_experience_by_id(
        db,
        experience_id,
    )

    if experience is None or experience.candidate_id != candidate_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Work experience record not found.",
        )

    work_experience_service.delete_work_experience(
        db,
        experience_id,
    )
