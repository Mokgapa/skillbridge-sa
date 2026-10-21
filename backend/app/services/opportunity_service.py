from sqlalchemy.orm import Session

from app.models.opportunity import Opportunity
from app.repositories.opportunity_repository import OpportunityRepository
from app.schemas.opportunity import (
    OpportunityCreate,
    OpportunityUpdate,
)


class OpportunityService:
    """
    Business logic for employment, internship,
    learnership, mentorship and other opportunities.
    """

    def __init__(self):
        self.opportunity_repository = OpportunityRepository()

    def get_opportunity(
        self,
        db: Session,
        opportunity_id: int,
    ) -> Opportunity | None:
        return self.opportunity_repository.get_by_id(
            db,
            opportunity_id,
        )

    def get_employer_opportunities(
        self,
        db: Session,
        employer_id: int,
    ) -> list[Opportunity]:
        return self.opportunity_repository.get_by_employer_id(
            db,
            employer_id,
        )

    def get_open_opportunities(
        self,
        db: Session,
    ) -> list[Opportunity]:
        return self.opportunity_repository.get_open_opportunities(
            db,
        )

    def get_opportunities_by_type(
        self,
        db: Session,
        opportunity_type: str,
    ) -> list[Opportunity]:
        return self.opportunity_repository.get_by_type(
            db,
            opportunity_type,
        )

    def get_opportunities_by_location(
        self,
        db: Session,
        location: str,
    ) -> list[Opportunity]:
        return self.opportunity_repository.get_by_location(
            db,
            location,
        )

    def create_opportunity(
        self,
        db: Session,
        opportunity_data: OpportunityCreate,
    ) -> Opportunity:
        return self.opportunity_repository.create(
            db,
            opportunity_data.model_dump(),
        )

    def update_opportunity(
        self,
        db: Session,
        opportunity_id: int,
        opportunity_data: OpportunityUpdate,
    ) -> Opportunity:
        opportunity = self.opportunity_repository.get_by_id(
            db,
            opportunity_id,
        )

        if opportunity is None:
            raise ValueError(
                "Opportunity not found."
            )

        update_values = opportunity_data.model_dump(
            exclude_unset=True
        )

        return self.opportunity_repository.update(
            db,
            opportunity,
            update_values,
        )

    def delete_opportunity(
        self,
        db: Session,
        opportunity_id: int,
    ) -> None:
        opportunity = self.opportunity_repository.get_by_id(
            db,
            opportunity_id,
        )

        if opportunity is None:
            raise ValueError(
                "Opportunity not found."
            )

        self.opportunity_repository.delete(
            db,
            opportunity,
        )