from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.opportunity import Opportunity
from app.repositories.base_repository import BaseRepository


class OpportunityRepository(BaseRepository[Opportunity]):
    def __init__(self):
        super().__init__(Opportunity)

    def get_by_employer_id(
        self,
        db: Session,
        employer_id: int,
    ) -> list[Opportunity]:
        statement = select(Opportunity).where(
            Opportunity.employer_id == employer_id
        )

        return list(
            db.execute(statement).scalars().all()
        )

    def get_open_opportunities(
        self,
        db: Session,
    ) -> list[Opportunity]:
        statement = select(Opportunity).where(
            Opportunity.status == "OPEN"
        )

        return list(
            db.execute(statement).scalars().all()
        )

    def get_by_type(
        self,
        db: Session,
        opportunity_type: str,
    ) -> list[Opportunity]:
        statement = select(Opportunity).where(
            Opportunity.opportunity_type == opportunity_type
        )

        return list(
            db.execute(statement).scalars().all()
        )

    def get_by_location(
        self,
        db: Session,
        location: str,
    ) -> list[Opportunity]:
        statement = select(Opportunity).where(
            Opportunity.location == location
        )

        return list(
            db.execute(statement).scalars().all()
        )