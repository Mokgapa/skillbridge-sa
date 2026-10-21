from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.application import Application
from app.repositories.base_repository import BaseRepository


class ApplicationRepository(BaseRepository[Application]):
    def __init__(self):
        super().__init__(Application)

    def get_by_candidate_id(
        self,
        db: Session,
        candidate_id: int,
    ) -> list[Application]:
        statement = select(Application).where(
            Application.candidate_id == candidate_id
        )

        return list(
            db.execute(statement).scalars().all()
        )

    def get_by_opportunity_id(
        self,
        db: Session,
        opportunity_id: int,
    ) -> list[Application]:
        statement = select(Application).where(
            Application.opportunity_id == opportunity_id
        )

        return list(
            db.execute(statement).scalars().all()
        )

    def get_existing_application(
        self,
        db: Session,
        candidate_id: int,
        opportunity_id: int,
    ) -> Application | None:
        statement = select(Application).where(
            Application.candidate_id == candidate_id,
            Application.opportunity_id == opportunity_id,
        )

        return db.execute(statement).scalar_one_or_none()