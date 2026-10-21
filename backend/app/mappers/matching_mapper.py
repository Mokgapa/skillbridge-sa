from typing import Any


def matching_to_dict(match: Any) -> dict:
    """Convert a candidate-opportunity match into a dictionary."""

    if match is None:
        return {}

    fields = [
        "id",
        "candidate_id",
        "opportunity_id",
        "overall_score",
        "skills_score",
        "education_score",
        "experience_score",
        "projects_score",
        "location_score",
        "created_at",
        "updated_at",
    ]

    result = {}

    for field in fields:
        if hasattr(match, field):
            result[field] = getattr(match, field)

    candidate = getattr(match, "candidate", None)

    if candidate is not None:
        result["candidate"] = {
            "id": getattr(candidate, "id", None),
            "user_id": getattr(candidate, "user_id", None),
        }

    opportunity = getattr(match, "opportunity", None)

    if opportunity is not None:
        result["opportunity"] = {
            "id": getattr(opportunity, "id", None),
            "title": getattr(opportunity, "title", None),
            "location": getattr(opportunity, "location", None),
        }

    return result
