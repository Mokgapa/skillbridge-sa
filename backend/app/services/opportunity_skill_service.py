from sqlalchemy.orm import Session

from app.models.opportunity_skill import OpportunitySkill
from app.repositories.opportunity_skill_repository import (
    OpportunitySkillRepository,
)
from app.repositories.opportunity_repository import OpportunityRepository
from app.repositories.skill_repository import SkillRepository
from app.schemas.opportunity_skill import (
    OpportunitySkillCreate,
    OpportunitySkillUpdate,
)


class OpportunitySkillService:
    """
    Business logic for skills required by opportunities.
    """

    def __init__(self):
        self.opportunity_skill_repository = OpportunitySkillRepository()
        self.opportunity_repository = OpportunityRepository()
        self.skill_repository = SkillRepository()

    def get_opportunity_skill(
        self,
        db: Session,
        opportunity_skill_id: int,
    ) -> OpportunitySkill | None:
        return self.opportunity_skill_repository.get_by_id(
            db,
            opportunity_skill_id,
        )

    def get_opportunity_skills(
        self,
        db: Session,
        opportunity_id: int,
    ) -> list[OpportunitySkill]:
        return self.opportunity_skill_repository.get_by_opportunity_id(
            db,
            opportunity_id,
        )

    def get_skill_opportunities(
        self,
        db: Session,
        skill_id: int,
    ) -> list[OpportunitySkill]:
        return self.opportunity_skill_repository.get_by_skill_id(
            db,
            skill_id,
        )

    def create_opportunity_skill(
        self,
        db: Session,
        opportunity_skill_data: OpportunitySkillCreate,
    ) -> OpportunitySkill:
        opportunity = self.opportunity_repository.get_by_id(
            db,
            opportunity_skill_data.opportunity_id,
        )

        if opportunity is None:
            raise ValueError(
                "Opportunity not found."
            )

        skill = self.skill_repository.get_by_id(
            db,
            opportunity_skill_data.skill_id,
        )

        if skill is None:
            raise ValueError(
                "Skill not found."
            )

        return self.opportunity_skill_repository.create(
            db,
            opportunity_skill_data.model_dump(),
        )

    def update_opportunity_skill(
        self,
        db: Session,
        opportunity_skill_id: int,
        opportunity_skill_data: OpportunitySkillUpdate,
    ) -> OpportunitySkill:
        opportunity_skill = (
            self.opportunity_skill_repository.get_by_id(
                db,
                opportunity_skill_id,
            )
        )

        if opportunity_skill is None:
            raise ValueError(
                "Opportunity skill not found."
            )

        update_values = opportunity_skill_data.model_dump(
            exclude_unset=True
        )

        return self.opportunity_skill_repository.update(
            db,
            opportunity_skill,
            update_values,
        )

    def delete_opportunity_skill(
        self,
        db: Session,
        opportunity_skill_id: int,
    ) -> None:
        opportunity_skill = (
            self.opportunity_skill_repository.get_by_id(
                db,
                opportunity_skill_id,
            )
        )

        if opportunity_skill is None:
            raise ValueError(
                "Opportunity skill not found."
            )

        self.opportunity_skill_repository.delete(
            db,
            opportunity_skill,
        )