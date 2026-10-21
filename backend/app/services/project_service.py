from sqlalchemy.orm import Session

from app.models.project import Project
from app.repositories.project_repository import ProjectRepository
from app.schemas.project import (
    ProjectCreate,
    ProjectUpdate,
)


class ProjectService:
    """
    Business logic for candidate projects.
    """

    def __init__(self):
        self.project_repository = ProjectRepository()

    def get_project(
        self,
        db: Session,
        project_id: int,
    ) -> Project | None:
        return self.project_repository.get_by_id(
            db,
            project_id,
        )

    def get_candidate_projects(
        self,
        db: Session,
        candidate_id: int,
    ) -> list[Project]:
        return self.project_repository.get_by_candidate_id(
            db,
            candidate_id,
        )

    def get_by_github_url(
        self,
        db: Session,
        github_url: str,
    ) -> Project | None:
        return self.project_repository.get_by_github_url(
            db,
            github_url,
        )

    def create_project(
        self,
        db: Session,
        project_data: ProjectCreate,
    ) -> Project:
        github_url = getattr(
            project_data,
            "github_url",
            None,
        )

        if github_url:
            existing_project = (
                self.project_repository.get_by_github_url(
                    db,
                    github_url,
                )
            )

            if existing_project:
                raise ValueError(
                    "A project with this GitHub URL already exists."
                )

        return self.project_repository.create(
            db,
            project_data.model_dump(),
        )

    def update_project(
        self,
        db: Session,
        project_id: int,
        project_data: ProjectUpdate,
    ) -> Project:
        project = self.project_repository.get_by_id(
            db,
            project_id,
        )

        if project is None:
            raise ValueError(
                "Project not found."
            )

        update_values = project_data.model_dump(
            exclude_unset=True
        )

        return self.project_repository.update(
            db,
            project,
            update_values,
        )

    def delete_project(
        self,
        db: Session,
        project_id: int,
    ) -> None:
        project = self.project_repository.get_by_id(
            db,
            project_id,
        )

        if project is None:
            raise ValueError(
                "Project not found."
            )

        self.project_repository.delete(
            db,
            project,
        )