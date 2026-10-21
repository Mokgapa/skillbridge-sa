from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.models.user import User
from app.schemas.application import (
    ApplicationCreate,
    ApplicationResponse,
    ApplicationUpdate,
)
from app.security.dependencies import get_current_user
from app.services.application_service import ApplicationService
from app.services.candidate_service import CandidateService
from app.services.employer_service import EmployerService
from app.services.opportunity_service import OpportunityService


router = APIRouter(
    prefix="/applications",
    tags=["Applications"],
)

application_service = ApplicationService()
candidate_service = CandidateService()
employer_service = EmployerService()
opportunity_service = OpportunityService()


@router.post(
    "/",
    response_model=ApplicationResponse,
    status_code=status.HTTP_201_CREATED,
)
def apply_for_opportunity(
    application_data: ApplicationCreate,
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

    return application_service.create_application(
        db,
        candidate.id,
        application_data,
    )


@router.get("/my", response_model=list[ApplicationResponse])
def get_my_applications(
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


@router.get(
    "/opportunity/{opportunity_id}",
    response_model=list[ApplicationResponse],
)
def get_opportunity_applications(
    opportunity_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    employer = employer_service.get_profile_by_user_id(
        db,
        current_user.id,
    )

    if employer is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Employer profile required.",
        )

    opportunity = opportunity_service.get_opportunity_by_id(
        db,
        opportunity_id,
    )

    if opportunity is None or opportunity.employer_id != employer.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Opportunity not found.",
        )

    return application_service.get_opportunity_applications(
        db,
        opportunity_id,
    )


@router.patch(
    "/{application_id}",
    response_model=ApplicationResponse,
)
def update_application_status(
    application_id: int,
    application_data: ApplicationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    employer = employer_service.get_profile_by_user_id(
        db,
        current_user.id,
    )

    if employer is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Employer profile required.",
        )

    application = application_service.get_application_by_id(
        db,
        application_id,
    )

    if application is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found.",
        )

    opportunity = opportunity_service.get_opportunity_by_id(
        db,
        application.opportunity_id,
    )

    if opportunity is None or opportunity.employer_id != employer.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot update applications for another employer.",
        )

    return application_service.update_application(
        db,
        application_id,
        application_data,
    )
