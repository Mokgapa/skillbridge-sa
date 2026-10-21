from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.candidate_profile import CandidateProfile
from app.repositories.base_repository import BaseRepository


class CandidateRepository(BaseRepository[CandidateProfile]):
    def __init__(self):
        super().__init__(CandidateProfile)

    def get_by_user_id(
        self,
        db: Session,
        user_id: int,
    ) -> CandidateProfile | None:
        statement = select(CandidateProfile).where(
            CandidateProfile.user_id == user_id
        )

        return db.execute(statement).scalar_one_or_none()

    def get_by_location(
        self,
        db: Session,
        location: str,
    ) -> list[CandidateProfile]:
        statement = select(CandidateProfile).where(
            CandidateProfile.location == location
        )

        return list(
            db.execute(statement).scalars().all()
        )