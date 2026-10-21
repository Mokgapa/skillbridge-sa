from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.opportunity_skill import OpportunitySkill
from app.repositories.base_repository import BaseRepository


class OpportunitySkillRepository(BaseRepository[OpportunitySkill]):
    def __init__(self):
        super().__init__(OpportunitySkill)

    def get_by_opportunity_id(
        self,
        db: Session,
        opportunity_id: int,
    ) -> list[OpportunitySkill]:
        statement = select(OpportunitySkill).where(
            OpportunitySkill.opportunity_id == opportunity_id
        )

        return list(
            db.execute(statement).scalars().all()
        )

    def get_by_skill_id(
        self,
        db: Session,
        skill_id: int,
    ) -> list[OpportunitySkill]:
        statement = select(OpportunitySkill).where(
            OpportunitySkill.skill_id == skill_id
        )

        return list(
            db.execute(statement).scalars().all()
        )