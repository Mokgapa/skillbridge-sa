from sqlalchemy.orm import Session

from app.models.candidate_profile import CandidateProfile
from app.repositories.candidate_repository import CandidateRepository
from app.schemas.candidate_profile import (
    CandidateProfileCreate,
    CandidateProfileUpdate,
)


class CandidateService:
    """
    Business logic for candidate profiles.
    """

    def __init__(self):
        self.candidate_repository = CandidateRepository()

    def get_candidate(
        self,
        db: Session,
        candidate_id: int,
    ) -> CandidateProfile | None:
        return self.candidate_repository.get_by_id(
            db,
            candidate_id,
        )

    def get_candidate_by_user_id(
        self,
        db: Session,
        user_id: int,
    ) -> CandidateProfile | None:
        return self.candidate_repository.get_by_user_id(
            db,
            user_id,
        )

    def create_candidate(
        self,
        db: Session,
        candidate_data: CandidateProfileCreate,
    ) -> CandidateProfile:
        existing_profile = (
            self.candidate_repository.get_by_user_id(
                db,
                candidate_data.user_id,
            )
        )

        if existing_profile:
            raise ValueError(
                "A candidate profile already exists for this user."
            )

        return self.candidate_repository.create(
            db,
            candidate_data.model_dump(),
        )

    def update_candidate(
        self,
        db: Session,
        candidate_id: int,
        candidate_data: CandidateProfileUpdate,
    ) -> CandidateProfile:
        candidate = self.candidate_repository.get_by_id(
            db,
            candidate_id,
        )

        if candidate is None:
            raise ValueError(
                "Candidate profile not found."
            )

        update_values = candidate_data.model_dump(
            exclude_unset=True
        )

        return self.candidate_repository.update(
            db,
            candidate,
            update_values,
        )

    def delete_candidate(
        self,
        db: Session,
        candidate_id: int,
    ) -> None:
        candidate = self.candidate_repository.get_by_id(
            db,
            candidate_id,
        )

        if candidate is None:
            raise ValueError(
                "Candidate profile not found."
            )

        self.candidate_repository.delete(
            db,
            candidate,
        )