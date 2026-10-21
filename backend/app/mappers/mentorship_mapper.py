from typing import Any


def mentorship_to_dict(mentorship: Any) -> dict:
    """Convert a mentorship record into a dictionary."""

    if mentorship is None:
        return {}

    fields = [
        "id",
        "mentor_id",
        "mentee_id",
        "status",
        "message",
        "goals",
        "start_date",
        "end_date",
        "created_at",
        "updated_at",
    ]

    result = {}

    for field in fields:
        if hasattr(mentorship, field):
            result[field] = getattr(mentorship, field)

    return result
