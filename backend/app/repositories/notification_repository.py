from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.notification import Notification
from app.repositories.base_repository import BaseRepository


class NotificationRepository(BaseRepository[Notification]):
    def __init__(self):
        super().__init__(Notification)

    def get_by_user_id(
        self,
        db: Session,
        user_id: int,
    ) -> list[Notification]:
        statement = (
            select(Notification)
            .where(Notification.user_id == user_id)
            .order_by(Notification.created_at.desc())
        )

        return list(
            db.execute(statement).scalars().all()
        )

    def get_unread_by_user_id(
        self,
        db: Session,
        user_id: int,
    ) -> list[Notification]:
        statement = (
            select(Notification)
            .where(
                Notification.user_id == user_id,
                Notification.is_read.is_(False),
            )
            .order_by(Notification.created_at.desc())
        )

        return list(
            db.execute(statement).scalars().all()
        )