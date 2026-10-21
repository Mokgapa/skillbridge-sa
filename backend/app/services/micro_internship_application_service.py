from sqlalchemy.orm import Session

from app.models.micro_internship_application import (
    MicroInternshipApplication,
)


class MicroInternshipApplicationService:
    """Handles micro-internship applications."""

    def create_application(
        self,
        db: Session,
        candidate_id: int,
        micro_internship_id: int,
    ):
        existing_application = (
            db.query(MicroInternshipApplication)
            .filter(
                MicroInternshipApplication.candidate_id
                == candidate_id,
                MicroInternshipApplication.micro_internship_id
                == micro_internship_id,
            )
            .first()
        )

        if existing_application:
            raise ValueError(
                "You have already applied for this micro-internship."
            )

        application = MicroInternshipApplication(
            candidate_id=candidate_id,
            micro_internship_id=micro_internship_id,
            status="pending",
        )

        db.add(application)
        db.commit()
        db.refresh(application)

        return application

    def get_application(
        self,
        db: Session,
        application_id: int,
    ):
        return (
            db.query(MicroInternshipApplication)
            .filter(
                MicroInternshipApplication.id == application_id
            )
            .first()
        )

    def get_candidate_applications(
        self,
        db: Session,
        candidate_id: int,
    ):
        return (
            db.query(MicroInternshipApplication)
            .filter(
                MicroInternshipApplication.candidate_id
                == candidate_id
            )
            .order_by(
                MicroInternshipApplication.created_at.desc()
            )
            .all()
        )

    def update_application_status(
        self,
        db: Session,
        application_id: int,
        new_status: str,
    ):
        allowed_statuses = {
            "pending",
            "reviewing",
            "accepted",
            "rejected",
            "withdrawn",
        }

        if new_status not in allowed_statuses:
            raise ValueError("Invalid application status.")

        application = self.get_application(db, application_id)

        if application is None:
            return None

        application.status = new_status

        db.commit()
        db.refresh(application)

        return application

    def withdraw_application(
        self,
        db: Session,
        application_id: int,
        candidate_id: int,
    ):
        application = self.get_application(db, application_id)

        if application is None:
            return None

        if application.candidate_id != candidate_id:
            raise PermissionError(
                "You can only withdraw your own application."
            )

        if application.status in {"accepted", "rejected"}:
            raise ValueError(
                "This application can no longer be withdrawn."
            )

        application.status = "withdrawn"

        db.commit()
        db.refresh(application)

        return application
