from typing import Any


def user_to_dict(user: Any) -> dict:
    """Convert a user database model into a dictionary."""

    if user is None:
        return {}

    fields = [
        "id",
        "email",
        "first_name",
        "last_name",
        "full_name",
        "is_active",
        "is_verified",
        "created_at",
        "updated_at",
    ]

    result = {}

    for field in fields:
        if hasattr(user, field):
            result[field] = getattr(user, field)

    return result
