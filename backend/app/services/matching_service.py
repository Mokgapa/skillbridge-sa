
from sqlalchemy.orm import Session

from app.matching.matching_engine import MatchingEngine
from app.repositories.match_repository import MatchRepository


class MatchingService:
    """Manage candidate-to-opportunity matching operations."""

    def __init__(self):
        self.repository = MatchRepository()
        self.engine = MatchingEngine()

    def get_candidate_matches(
        self,
        db: Session,
        candidate_id: int,
    ):
        """Return a candidate's matches, ranked by score."""

        return self.repository.get_by_candidate_id(
            db=db,
            candidate_id=candidate_id,
        )

    def get_opportunity_matches(
        self,
        db: Session,
        opportunity_id: int,
    ):
        """Return candidates matched to an opportunity."""

        return self.repository.get_by_opportunity_id(
            db=db,
            opportunity_id=opportunity_id,
        )

    def get_existing_match(
        self,
        db: Session,
        candidate_id: int,
        opportunity_id: int,
    ):
        """Find an existing candidate-opportunity match."""

        return self.repository.get_existing_match(
            db=db,
            candidate_id=candidate_id,
            opportunity_id=opportunity_id,
        )

    def calculate_match_result(
        self,
        skills_score: float,
        education_score: float,
        experience_score: float,
        projects_score: float,
        location_score: float,
    ) -> dict:
        """Calculate the weighted match score and breakdown."""

        return self.engine.generate_match_result(
            skills_score=skills_score,
            education_score=education_score,
            experience_score=experience_score,
            projects_score=projects_score,
            location_score=location_score,
        )
