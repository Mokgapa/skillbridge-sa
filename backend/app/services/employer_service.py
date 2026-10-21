from sqlalchemy.orm import Session

from app.models.employer_profile import EmployerProfile
from app.repositories.employer_repository import EmployerRepository
from app.schemas.employer_profile import (
    EmployerProfileCreate,
    EmployerProfileUpdate,
)


class EmployerService:
    """
    Business logic for employer profiles.
    """

    def __init__(self):
        self.employer_repository = EmployerRepository()

    def get_employer(
        self,
        db: Session,
        employer_id: int,
    ) -> EmployerProfile | None:
        return self.employer_repository.get_by_id(
            db,
            employer_id,
        )

    def get_employer_by_user_id(
        self,
        db: Session,
        user_id: int,
    ) -> EmployerProfile | None:
        return self.employer_repository.get_by_user_id(
            db,
            user_id,
        )

    def get_employers_by_industry(
        self,
        db: Session,
        industry: str,
    ) -> list[EmployerProfile]:
        return self.employer_repository.get_by_industry(
            db,
            industry,
        )

    def create_employer(
        self,
        db: Session,
        employer_data: EmployerProfileCreate,
    ) -> EmployerProfile:
        existing_profile = (
            self.employer_repository.get_by_user_id(
                db,
                employer_data.user_id,
            )
        )

        if existing_profile:
            raise ValueError(
                "An employer profile already exists for this user."
            )

        return self.employer_repository.create(
            db,
            employer_data.model_dump(),
        )

    def update_employer(
        self,
        db: Session,
        employer_id: int,
        employer_data: EmployerProfileUpdate,
    ) -> EmployerProfile:
        employer = self.employer_repository.get_by_id(
            db,
            employer_id,
        )

        if employer is None:
            raise ValueError(
                "Employer profile not found."
            )

        update_values = employer_data.model_dump(
            exclude_unset=True
        )

        return self.employer_repository.update(
            db,
            employer,
            update_values,
        )

    def delete_employer(
        self,
        db: Session,
        employer_id: int,
    ) -> None:
        employer = self.employer_repository.get_by_id(
            db,
            employer_id,
        )

        if employer is None:
            raise ValueError(
                "Employer profile not found."
            )

        self.employer_repository.delete(
            db,
            employer,
        )