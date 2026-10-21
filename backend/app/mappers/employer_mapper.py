from typing import Any


def employer_to_dict(employer: Any) -> dict:
    """Convert an employer profile model into a dictionary."""

    if employer is None:
        return {}

    fields = [
        "id",
        "user_id",
        "company_name",
        "company_description",
        "industry",
        "company_size",
        "website",
        "location",
        "city",
        "province",
        "logo_url",
        "is_verified",
        "created_at",
        "updated_at",
    ]

    result = {}

    for field in fields:
        if hasattr(employer, field):
            result[field] = getattr(employer, field)

    user = getattr(employer, "user", None)

    if user is not None:
        result["user"] = {
            "id": getattr(user, "id", None),
            "email": getattr(user, "email", None),
            "first_name": getattr(user, "first_name", None),
            "last_name": getattr(user, "last_name", None),
        }

    return result
