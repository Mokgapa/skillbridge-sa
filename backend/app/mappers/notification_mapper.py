from typing import Any


def notification_to_dict(notification: Any) -> dict:
    """Convert a notification model into a dictionary."""

    if notification is None:
        return {}

    fields = [
        "id",
        "user_id",
        "title",
        "message",
        "notification_type",
        "is_read",
        "read_at",
        "created_at",
        "updated_at",
    ]

    result = {}

    for field in fields:
        if hasattr(notification, field):
            result[field] = getattr(notification, field)

    return result
