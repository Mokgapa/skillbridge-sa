from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.employer_profile import EmployerProfile
from app.repositories.base_repository import BaseRepository


class EmployerRepository(BaseRepository[EmployerProfile]):
    def __init__(self):
        super().__init__(EmployerProfile)

    def get_by_user_id(
        self,
        db: Session,
        user_id: int,
    ) -> EmployerProfile | None:
        statement = select(EmployerProfile).where(
            EmployerProfile.user_id == user_id
        )

        return db.execute(statement).scalar_one_or_none()

    def get_by_industry(
        self,
        db: Session,
        industry: str,
    ) -> list[EmployerProfile]:
        statement = select(EmployerProfile).where(
            EmployerProfile.industry == industry
        )

        return list(
            db.execute(statement).scalars().all()
        )