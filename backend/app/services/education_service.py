from sqlalchemy.orm import Session

from app.models.education import Education
from app.repositories.education_repository import EducationRepository
from app.schemas.education import (
    EducationCreate,
    EducationUpdate,
)


class EducationService:
    """
    Business logic for candidate education records.
    """

    def __init__(self):
        self.education_repository = EducationRepository()

    def get_education(
        self,
        db: Session,
        education_id: int,
    ) -> Education | None:
        return self.education_repository.get_by_id(
            db,
            education_id,
        )

    def get_candidate_education(
        self,
        db: Session,
        candidate_id: int,
    ) -> list[Education]:
        return self.education_repository.get_by_candidate_id(
            db,
            candidate_id,
        )

    def create_education(
        self,
        db: Session,
        education_data: EducationCreate,
    ) -> Education:
        return self.education_repository.create(
            db,
            education_data.model_dump(),
        )

    def update_education(
        self,
        db: Session,
        education_id: int,
        education_data: EducationUpdate,
    ) -> Education:
        education = self.education_repository.get_by_id(
            db,
            education_id,
        )

        if education is None:
            raise ValueError(
                "Education record not found."
            )

        update_values = education_data.model_dump(
            exclude_unset=True
        )

        return self.education_repository.update(
            db,
            education,
            update_values,
        )

    def delete_education(
        self,
        db: Session,
        education_id: int,
    ) -> None:
        education = self.education_repository.get_by_id(
            db,
            education_id,
        )

        if education is None:
            raise ValueError(
                "Education record not found."
            )

        self.education_repository.delete(
            db,
            education,
        )