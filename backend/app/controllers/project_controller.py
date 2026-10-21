from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.models.user import User
from app.schemas.project import (
    ProjectCreate,
    ProjectResponse,
    ProjectUpdate,
)
from app.security.dependencies import get_current_user
from app.services.candidate_service import CandidateService
from app.services.project_service import ProjectService


router = APIRouter(
    prefix="/projects",
    tags=["Projects"],
)

candidate_service = CandidateService()
project_service = ProjectService()


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
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_project(
    project_data: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    candidate_id = get_candidate_profile_id(db, current_user.id)

    return project_service.create_project(
        db,
        candidate_id,
        project_data,
    )


@router.get("/", response_model=list[ProjectResponse])
def get_my_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    candidate_id = get_candidate_profile_id(db, current_user.id)

    return project_service.get_candidate_projects(
        db,
        candidate_id,
    )


@router.patch("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: int,
    project_data: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    candidate_id = get_candidate_profile_id(db, current_user.id)

    project = project_service.get_project_by_id(db, project_id)

    if project is None or project.candidate_id != candidate_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found.",
        )

    return project_service.update_project(
        db,
        project_id,
        project_data,
    )


@router.delete(
    "/{project_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    candidate_id = get_candidate_profile_id(db, current_user.id)

    project = project_service.get_project_by_id(db, project_id)

    if project is None or project.candidate_id != candidate_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found.",
        )

    project_service.delete_project(db, project_id)
