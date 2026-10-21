from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.models.user import User
from app.schemas.employer_profile import (
    EmployerProfileCreate,
    EmployerProfileResponse,
    EmployerProfileUpdate,
)
from app.security.dependencies import get_current_user
from app.services.employer_service import EmployerService


router = APIRouter(
    prefix="/employers",
    tags=["Employers"],
)

employer_service = EmployerService()


@router.post(
    "/profile",
    response_model=EmployerProfileResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_employer_profile(
    profile_data: EmployerProfileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return employer_service.create_profile(
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
    response_model=EmployerProfileResponse,
)
def get_employer_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = employer_service.get_profile_by_user_id(
        db,
        current_user.id,
    )

    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employer profile not found.",
        )

    return profile


@router.patch(
    "/profile",
    response_model=EmployerProfileResponse,
)
def update_employer_profile(
    profile_data: EmployerProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = employer_service.update_profile(
        db,
        current_user.id,
        profile_data,
    )

    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employer profile not found.",
        )

    return profile
