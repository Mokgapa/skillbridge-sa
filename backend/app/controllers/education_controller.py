from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.models.user import User
from app.schemas.education import EducationCreate, EducationResponse, EducationUpdate
from app.security.dependencies import get_current_user
from app.services.candidate_service import CandidateService
from app.services.education_service import EducationService


router = APIRouter(
    prefix="/education",
    tags=["Education"],
)

candidate_service = CandidateService()
education_service = EducationService()


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
    response_model=EducationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_education(
    education_data: EducationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    candidate_id = get_candidate_profile_id(db, current_user.id)

    return education_service.create_education(
        db,
        candidate_id,
        education_data,
    )


@router.get("/", response_model=list[EducationResponse])
def get_my_education(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    candidate_id = get_candidate_profile_id(db, current_user.id)

    return education_service.get_candidate_education(
        db,
        candidate_id,
    )


@router.patch("/{education_id}", response_model=EducationResponse)
def update_education(
    education_id: int,
    education_data: EducationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    candidate_id = get_candidate_profile_id(db, current_user.id)

    education = education_service.get_education_by_id(
        db,
        education_id,
    )

    if education is None or education.candidate_id != candidate_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Education record not found.",
        )

    return education_service.update_education(
        db,
        education_id,
        education_data,
    )


@router.delete("/{education_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_education(
    education_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    candidate_id = get_candidate_profile_id(db, current_user.id)

    education = education_service.get_education_by_id(
        db,
        education_id,
    )

    if education is None or education.candidate_id != candidate_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Education record not found.",
        )

    education_service.delete_education(db, education_id)
