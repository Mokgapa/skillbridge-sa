from typing import Any


def candidate_to_dict(candidate: Any) -> dict:
    """Convert a candidate profile model into a dictionary."""

    if candidate is None:
        return {}

    fields = [
        "id",
        "user_id",
        "headline",
        "bio",
        "location",
        "province",
        "city",
        "phone",
        "profile_picture",
        "github_url",
        "linkedin_url",
        "portfolio_url",
        "years_of_experience",
        "employment_status",
        "created_at",
        "updated_at",
    ]

    result = {}

    for field in fields:
        if hasattr(candidate, field):
            result[field] = getattr(candidate, field)

    user = getattr(candidate, "user", None)

    if user is not None:
        result["user"] = {
            "id": getattr(user, "id", None),
            "email": getattr(user, "email", None),
            "first_name": getattr(user, "first_name", None),
            "last_name": getattr(user, "last_name", None),
        }

    return result
