from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.education import Education
from app.repositories.base_repository import BaseRepository


class EducationRepository(BaseRepository[Education]):
    def __init__(self):
        super().__init__(Education)

    def get_by_candidate_id(
        self,
        db: Session,
        candidate_id: int,
    ) -> list[Education]:
        statement = select(Education).where(
            Education.candidate_id == candidate_id
        )

        return list(
            db.execute(statement).scalars().all()
        )