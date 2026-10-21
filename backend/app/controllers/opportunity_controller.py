from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.models.user import User
from app.schemas.opportunity import (
    OpportunityCreate,
    OpportunityResponse,
    OpportunityUpdate,
)
from app.security.dependencies import get_current_user
from app.services.employer_service import EmployerService
from app.services.opportunity_service import OpportunityService


router = APIRouter(
    prefix="/opportunities",
    tags=["Opportunities"],
)

opportunity_service = OpportunityService()
employer_service = EmployerService()


@router.get("/", response_model=list[OpportunityResponse])
def get_opportunities(
    opportunity_type: str | None = Query(default=None),
    location: str | None = Query(default=None),
    search: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    if search:
        return opportunity_service.search_opportunities(
            db,
            search,
        )

    if opportunity_type:
        return opportunity_service.get_by_type(
            db,
            opportunity_type,
        )

    if location:
        return opportunity_service.get_by_location(
            db,
            location,
        )

    return opportunity_service.get_all_opportunities(db)


@router.get("/{opportunity_id}", response_model=OpportunityResponse)
def get_opportunity(
    opportunity_id: int,
    db: Session = Depends(get_db),
):
    opportunity = opportunity_service.get_opportunity_by_id(
        db,
        opportunity_id,
    )

    if opportunity is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Opportunity not found.",
        )

    return opportunity


@router.post(
    "/",
    response_model=OpportunityResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_opportunity(
    opportunity_data: OpportunityCreate,
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
            detail="Create an employer profile before posting opportunities.",
        )

    return opportunity_service.create_opportunity(
        db,
        employer.id,
        opportunity_data,
    )


@router.patch("/{opportunity_id}", response_model=OpportunityResponse)
def update_opportunity(
    opportunity_id: int,
    opportunity_data: OpportunityUpdate,
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

    return opportunity_service.update_opportunity(
        db,
        opportunity_id,
        opportunity_data,
    )
