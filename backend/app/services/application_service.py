from sqlalchemy.orm import Session

from app.models.application import Application
from app.repositories.application_repository import ApplicationRepository
from app.repositories.candidate_repository import CandidateRepository
from app.repositories.opportunity_repository import OpportunityRepository
from app.schemas.application import (
    ApplicationCreate,
    ApplicationUpdate,
)


class ApplicationService:
    """
    Business logic for candidate applications.
    """

    def __init__(self):
        self.application_repository = ApplicationRepository()
        self.candidate_repository = CandidateRepository()
        self.opportunity_repository = OpportunityRepository()

    def get_application(
        self,
        db: Session,
        application_id: int,
    ) -> Application | None:
        return self.application_repository.get_by_id(
            db,
            application_id,
        )

    def get_candidate_applications(
        self,
        db: Session,
        candidate_id: int,
    ) -> list[Application]:
        return self.application_repository.get_by_candidate_id(
            db,
            candidate_id,
        )

    def get_opportunity_applications(
        self,
        db: Session,
        opportunity_id: int,
    ) -> list[Application]:
        return self.application_repository.get_by_opportunity_id(
            db,
            opportunity_id,
        )

    def create_application(
        self,
        db: Session,
        application_data: ApplicationCreate,
    ) -> Application:
        candidate = self.candidate_repository.get_by_id(
            db,
            application_data.candidate_id,
        )

        if candidate is None:
            raise ValueError(
                "Candidate profile not found."
            )

        opportunity = self.opportunity_repository.get_by_id(
            db,
            application_data.opportunity_id,
        )

        if opportunity is None:
            raise ValueError(
                "Opportunity not found."
            )

        existing_application = (
            self.application_repository.get_existing_application(
                db,
                application_data.candidate_id,
                application_data.opportunity_id,
            )
        )

        if existing_application:
            raise ValueError(
                "You have already applied for this opportunity."
            )

        if getattr(opportunity, "status", None) != "OPEN":
            raise ValueError(
                "This opportunity is not currently open."
            )

        return self.application_repository.create(
            db,
            application_data.model_dump(),
        )

    def update_application(
        self,
        db: Session,
        application_id: int,
        application_data: ApplicationUpdate,
    ) -> Application:
        application = self.application_repository.get_by_id(
            db,
            application_id,
        )

        if application is None:
            raise ValueError(
                "Application not found."
            )

        update_values = application_data.model_dump(
            exclude_unset=True
        )

        return self.application_repository.update(
            db,
            application,
            update_values,
        )

    def delete_application(
        self,
        db: Session,
        application_id: int,
    ) -> None:
        application = self.application_repository.get_by_id(
            db,
            application_id,
        )

        if application is None:
            raise ValueError(
                "Application not found."
            )

        self.application_repository.delete(
            db,
            application,
        )