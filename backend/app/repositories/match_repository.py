from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.match import Match
from app.repositories.base_repository import BaseRepository


class MatchRepository(BaseRepository[Match]):
    def __init__(self):
        super().__init__(Match)

    def get_by_candidate_id(
        self,
        db: Session,
        candidate_id: int,
    ) -> list[Match]:
        statement = (
            select(Match)
            .where(Match.candidate_id == candidate_id)
            .order_by(Match.match_score.desc())
        )

        return list(
            db.execute(statement).scalars().all()
        )

    def get_by_opportunity_id(
        self,
        db: Session,
        opportunity_id: int,
    ) -> list[Match]:
        statement = (
            select(Match)
            .where(Match.opportunity_id == opportunity_id)
            .order_by(Match.match_score.desc())
        )

        return list(
            db.execute(statement).scalars().all()
        )

    def get_existing_match(
        self,
        db: Session,
        candidate_id: int,
        opportunity_id: int,
    ) -> Match | None:
        statement = select(Match).where(
            Match.candidate_id == candidate_id,
            Match.opportunity_id == opportunity_id,
        )

        return db.execute(statement).scalar_one_or_none()