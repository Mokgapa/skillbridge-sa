from sqlalchemy.orm import Session

from app.models.work_experience import WorkExperience
from app.repositories.work_experience_repository import (
    WorkExperienceRepository,
)
from app.schemas.work_experience import (
    WorkExperienceCreate,
    WorkExperienceUpdate,
)


class WorkExperienceService:
    """
    Business logic for candidate work experience.
    """

    def __init__(self):
        self.work_experience_repository = WorkExperienceRepository()

    def get_work_experience(
        self,
        db: Session,
        work_experience_id: int,
    ) -> WorkExperience | None:
        return self.work_experience_repository.get_by_id(
            db,
            work_experience_id,
        )

    def get_candidate_work_experience(
        self,
        db: Session,
        candidate_id: int,
    ) -> list[WorkExperience]:
        return self.work_experience_repository.get_by_candidate_id(
            db,
            candidate_id,
        )

    def get_current_work_experience(
        self,
        db: Session,
        candidate_id: int,
    ) -> list[WorkExperience]:
        return self.work_experience_repository.get_current_experience(
            db,
            candidate_id,
        )

    def create_work_experience(
        self,
        db: Session,
        work_experience_data: WorkExperienceCreate,
    ) -> WorkExperience:
        return self.work_experience_repository.create(
            db,
            work_experience_data.model_dump(),
        )

    def update_work_experience(
        self,
        db: Session,
        work_experience_id: int,
        work_experience_data: WorkExperienceUpdate,
    ) -> WorkExperience:
        work_experience = (
            self.work_experience_repository.get_by_id(
                db,
                work_experience_id,
            )
        )

        if work_experience is None:
            raise ValueError(
                "Work experience record not found."
            )

        update_values = work_experience_data.model_dump(
            exclude_unset=True
        )

        return self.work_experience_repository.update(
            db,
            work_experience,
            update_values,
        )

    def delete_work_experience(
        self,
        db: Session,
        work_experience_id: int,
    ) -> None:
        work_experience = (
            self.work_experience_repository.get_by_id(
                db,
                work_experience_id,
            )
        )

        if work_experience is None:
            raise ValueError(
                "Work experience record not found."
            )

        self.work_experience_repository.delete(
            db,
            work_experience,
        )