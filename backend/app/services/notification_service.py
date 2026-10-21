from sqlalchemy.orm import Session

from app.models.notification import Notification
from app.repositories.notification_repository import NotificationRepository
from app.schemas.notification import NotificationCreate, NotificationUpdate


class NotificationService:
    """Handles user notifications."""

    def __init__(self):
        self.notification_repository = NotificationRepository()

    def create_notification(
        self,
        db: Session,
        notification_data: NotificationCreate,
    ) -> Notification:
        notification = Notification(
            **notification_data.model_dump()
        )

        db.add(notification)
        db.commit()
        db.refresh(notification)

        return notification

    def get_notification(
        self,
        db: Session,
        notification_id: int,
    ):
        return (
            db.query(Notification)
            .filter(Notification.id == notification_id)
            .first()
        )

    def get_user_notifications(
        self,
        db: Session,
        user_id: int,
        unread_only: bool = False,
    ):
        query = db.query(Notification).filter(
            Notification.user_id == user_id
        )

        if unread_only:
            query = query.filter(Notification.is_read.is_(False))

        return query.order_by(
            Notification.created_at.desc()
        ).all()

    def mark_as_read(
        self,
        db: Session,
        notification_id: int,
    ):
        notification = self.get_notification(db, notification_id)

        if notification is None:
            return None

        notification.is_read = True

        db.commit()
        db.refresh(notification)

        return notification

    def update_notification(
        self,
        db: Session,
        notification_id: int,
        notification_data: NotificationUpdate,
    ):
        notification = self.get_notification(db, notification_id)

        if notification is None:
            return None

        update_data = notification_data.model_dump(
            exclude_unset=True
        )

        for field, value in update_data.items():
            setattr(notification, field, value)

        db.commit()
        db.refresh(notification)

        return notification

    def delete_notification(
        self,
        db: Session,
        notification_id: int,
    ) -> bool:
        notification = self.get_notification(db, notification_id)

        if notification is None:
            return False

        db.delete(notification)
        db.commit()

        return True
