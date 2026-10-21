from sqlalchemy.orm import Session

from app.models.certificate import Certificate
from app.repositories.certificate_repository import CertificateRepository
from app.schemas.certificate import (
    CertificateCreate,
    CertificateUpdate,
)


class CertificateService:
    """
    Business logic for candidate certificates.
    """

    def __init__(self):
        self.certificate_repository = CertificateRepository()

    def get_certificate(
        self,
        db: Session,
        certificate_id: int,
    ) -> Certificate | None:
        return self.certificate_repository.get_by_id(
            db,
            certificate_id,
        )

    def get_candidate_certificates(
        self,
        db: Session,
        candidate_id: int,
    ) -> list[Certificate]:
        return self.certificate_repository.get_by_candidate_id(
            db,
            candidate_id,
        )

    def get_by_credential_id(
        self,
        db: Session,
        credential_id: str,
    ) -> Certificate | None:
        return self.certificate_repository.get_by_credential_id(
            db,
            credential_id,
        )

    def create_certificate(
        self,
        db: Session,
        certificate_data: CertificateCreate,
    ) -> Certificate:
        credential_id = getattr(
            certificate_data,
            "credential_id",
            None,
        )

        if credential_id:
            existing_certificate = (
                self.certificate_repository.get_by_credential_id(
                    db,
                    credential_id,
                )
            )

            if existing_certificate:
                raise ValueError(
                    "A certificate with this credential ID already exists."
                )

        return self.certificate_repository.create(
            db,
            certificate_data.model_dump(),
        )

    def update_certificate(
        self,
        db: Session,
        certificate_id: int,
        certificate_data: CertificateUpdate,
    ) -> Certificate:
        certificate = self.certificate_repository.get_by_id(
            db,
            certificate_id,
        )

        if certificate is None:
            raise ValueError(
                "Certificate not found."
            )

        update_values = certificate_data.model_dump(
            exclude_unset=True
        )

        return self.certificate_repository.update(
            db,
            certificate,
            update_values,
        )

    def delete_certificate(
        self,
        db: Session,
        certificate_id: int,
    ) -> None:
        certificate = self.certificate_repository.get_by_id(
            db,
            certificate_id,
        )

        if certificate is None:
            raise ValueError(
                "Certificate not found."
            )

        self.certificate_repository.delete(
            db,
            certificate,
        )