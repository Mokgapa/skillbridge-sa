from sqlalchemy.orm import Session

from app.models.skill import Skill
from app.repositories.skill_repository import SkillRepository
from app.schemas.skill import (
    SkillCreate,
    SkillUpdate,
)


class SkillService:
    """
    Business logic for skills.
    """

    def __init__(self):
        self.skill_repository = SkillRepository()

    def get_skill(
        self,
        db: Session,
        skill_id: int,
    ) -> Skill | None:
        return self.skill_repository.get_by_id(
            db,
            skill_id,
        )

    def get_skill_by_name(
        self,
        db: Session,
        name: str,
    ) -> Skill | None:
        return self.skill_repository.get_by_name(
            db,
            name,
        )

    def get_skills_by_category(
        self,
        db: Session,
        category: str,
    ) -> list[Skill]:
        return self.skill_repository.get_by_category(
            db,
            category,
        )

    def get_all_skills(
        self,
        db: Session,
    ) -> list[Skill]:
        return self.skill_repository.get_all(db)

    def create_skill(
        self,
        db: Session,
        skill_data: SkillCreate,
    ) -> Skill:
        existing_skill = self.skill_repository.get_by_name(
            db,
            skill_data.name,
        )

        if existing_skill:
            raise ValueError(
                "A skill with this name already exists."
            )

        return self.skill_repository.create(
            db,
            skill_data.model_dump(),
        )

    def update_skill(
        self,
        db: Session,
        skill_id: int,
        skill_data: SkillUpdate,
    ) -> Skill:
        skill = self.skill_repository.get_by_id(
            db,
            skill_id,
        )

        if skill is None:
            raise ValueError(
                "Skill not found."
            )

        update_values = skill_data.model_dump(
            exclude_unset=True
        )

        return self.skill_repository.update(
            db,
            skill,
            update_values,
        )

    def delete_skill(
        self,
        db: Session,
        skill_id: int,
    ) -> None:
        skill = self.skill_repository.get_by_id(
            db,
            skill_id,
        )

        if skill is None:
            raise ValueError(
                "Skill not found."
            )

        self.skill_repository.delete(
            db,
            skill,
        )