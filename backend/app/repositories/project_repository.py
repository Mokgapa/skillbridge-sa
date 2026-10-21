from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.project import Project
from app.repositories.base_repository import BaseRepository


class ProjectRepository(BaseRepository[Project]):
    def __init__(self):
        super().__init__(Project)

    def get_by_candidate_id(
        self,
        db: Session,
        candidate_id: int,
    ) -> list[Project]:
        statement = select(Project).where(
            Project.candidate_id == candidate_id
        )

        return list(
            db.execute(statement).scalars().all()
        )

    def get_by_github_url(
        self,
        db: Session,
        github_url: str,
    ) -> Project | None:
        statement = select(Project).where(
            Project.github_url == github_url
        )

        return db.execute(statement).scalar_one_or_none()