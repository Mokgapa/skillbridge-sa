from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.certificate import Certificate
from app.repositories.base_repository import BaseRepository


class CertificateRepository(BaseRepository[Certificate]):
    def __init__(self):
        super().__init__(Certificate)

    def get_by_candidate_id(
        self,
        db: Session,
        candidate_id: int,
    ) -> list[Certificate]:
        statement = select(Certificate).where(
            Certificate.candidate_id == candidate_id
        )

        return list(
            db.execute(statement).scalars().all()
        )

    def get_by_credential_id(
        self,
        db: Session,
        credential_id: str,
    ) -> Certificate | None:
        statement = select(Certificate).where(
            Certificate.credential_id == credential_id
        )

        return db.execute(statement).scalar_one_or_none()