from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.base_repository import BaseRepository


class UserRepository(BaseRepository[User]):
    def __init__(self):
        super().__init__(User)

    def get_by_email(
        self,
        db: Session,
        email: str,
    ) -> User | None:
        statement = select(User).where(
            User.email == email
        )

        return db.execute(statement).scalar_one_or_none()

    def get_active_users(
        self,
        db: Session,
    ) -> list[User]:
        statement = select(User).where(
            User.is_active.is_(True)
        )

        return list(
            db.execute(statement).scalars().all()
        )