from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.models.user import User
from app.schemas.certificate import (
    CertificateCreate,
    CertificateResponse,
    CertificateUpdate,
)
from app.security.dependencies import get_current_user
from app.services.candidate_service import CandidateService
from app.services.certificate_service import CertificateService


router = APIRouter(
    prefix="/certificates",
    tags=["Certificates"],
)

candidate_service = CandidateService()
certificate_service = CertificateService()


def get_candidate_profile_id(db: Session, user_id: int) -> int:
    profile = candidate_service.get_profile_by_user_id(db, user_id)

    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Create your candidate profile first.",
        )

    return profile.id


@router.post(
    "/",
    response_model=CertificateResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_certificate(
    certificate_data: CertificateCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    candidate_id = get_candidate_profile_id(db, current_user.id)

    return certificate_service.create_certificate(
        db,
        candidate_id,
        certificate_data,
    )


@router.get("/", response_model=list[CertificateResponse])
def get_my_certificates(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    candidate_id = get_candidate_profile_id(db, current_user.id)

    return certificate_service.get_candidate_certificates(
        db,
        candidate_id,
    )


@router.patch(
    "/{certificate_id}",
    response_model=CertificateResponse,
)
def update_certificate(
    certificate_id: int,
    certificate_data: CertificateUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    candidate_id = get_candidate_profile_id(db, current_user.id)

    certificate = certificate_service.get_certificate_by_id(
        db,
        certificate_id,
    )

    if certificate is None or certificate.candidate_id != candidate_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Certificate not found.",
        )

    return certificate_service.update_certificate(
        db,
        certificate_id,
        certificate_data,
    )


@router.delete(
    "/{certificate_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_certificate(
    certificate_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    candidate_id = get_candidate_profile_id(db, current_user.id)

    certificate = certificate_service.get_certificate_by_id(
        db,
        certificate_id,
    )

    if certificate is None or certificate.candidate_id != candidate_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Certificate not found.",
        )

    certificate_service.delete_certificate(db, certificate_id)
