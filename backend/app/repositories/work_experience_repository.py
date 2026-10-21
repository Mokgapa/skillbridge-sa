from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.work_experience import WorkExperience
from app.repositories.base_repository import BaseRepository


class WorkExperienceRepository(BaseRepository[WorkExperience]):
    def __init__(self):
        super().__init__(WorkExperience)

    def get_by_candidate_id(
        self,
        db: Session,
        candidate_id: int,
    ) -> list[WorkExperience]:
        statement = select(WorkExperience).where(
            WorkExperience.candidate_id == candidate_id
        )

        return list(
            db.execute(statement).scalars().all()
        )

    def get_current_experience(
        self,
        db: Session,
        candidate_id: int,
    ) -> list[WorkExperience]:
        statement = select(WorkExperience).where(
            WorkExperience.candidate_id == candidate_id,
            WorkExperience.is_current.is_(True),
        )

        return list(
            db.execute(statement).scalars().all()
        )