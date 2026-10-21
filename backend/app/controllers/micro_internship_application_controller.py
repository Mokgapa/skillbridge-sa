from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.models.user import User
from app.security.dependencies import get_current_user
from app.services.candidate_service import CandidateService
from app.services.micro_internship_application_service import (
    MicroInternshipApplicationService,
)


router = APIRouter(
    prefix="/micro-internship-applications",
    tags=["Micro-Internship Applications"],
)

candidate_service = CandidateService()
application_service = MicroInternshipApplicationService()


class MicroInternshipApplicationCreate(BaseModel):
    micro_internship_id: int = Field(gt=0)


@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
)
def apply_for_micro_internship(
    application_data: MicroInternshipApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    candidate = candidate_service.get_profile_by_user_id(
        db,
        current_user.id,
    )

    if candidate is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Create a candidate profile before applying.",
        )

    try:
        return application_service.create_application(
            db,
            candidate.id,
            application_data.micro_internship_id,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


@router.get("/my")
def get_my_micro_internship_applications(
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
            detail="Candidate profile not found.",
        )

    return application_service.get_candidate_applications(
        db,
        candidate.id,
    )


@router.patch("/{application_id}/withdraw")
def withdraw_micro_internship_application(
    application_id: int,
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
            detail="Candidate profile not found.",
        )

    try:
        application = application_service.withdraw_application(
            db,
            application_id,
            candidate.id,
        )
    except PermissionError as exc:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(exc),
        ) from exc
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

    if application is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found.",
        )

    return application
