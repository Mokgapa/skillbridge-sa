from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.models.user import User
from app.security.dependencies import get_current_user
from app.services.candidate_service import CandidateService
from app.services.matching_service import MatchingService


router = APIRouter(
    prefix="/matching",
    tags=["Opportunity Matching"],
)

candidate_service = CandidateService()
matching_service = MatchingService()


@router.get("/my-matches")
def get_my_matches(
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

    return matching_service.get_candidate_matches(
        db,
        candidate.id,
    )


@router.get("/opportunity/{opportunity_id}")
def get_opportunity_matches(
    opportunity_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    from app.services.employer_service import EmployerService
    from app.services.opportunity_service import OpportunityService

    employer_service = EmployerService()
    opportunity_service = OpportunityService()

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

    return matching_service.get_opportunity_matches(
        db,
        opportunity_id,
    )
