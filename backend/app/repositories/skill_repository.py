from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.skill import Skill
from app.repositories.base_repository import BaseRepository


class SkillRepository(BaseRepository[Skill]):
    def __init__(self):
        super().__init__(Skill)

    def get_by_name(
        self,
        db: Session,
        name: str,
    ) -> Skill | None:
        statement = select(Skill).where(
            Skill.name == name
        )

        return db.execute(statement).scalar_one_or_none()

    def get_by_category(
        self,
        db: Session,
        category: str,
    ) -> list[Skill]:
        statement = select(Skill).where(
            Skill.category == category
        )

        return list(
            db.execute(statement).scalars().all()
        )