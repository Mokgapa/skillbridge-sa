from typing import Any


def application_to_dict(application: Any) -> dict:
    """Convert a job application model into a dictionary."""

    if application is None:
        return {}

    fields = [
        "id",
        "candidate_id",
        "opportunity_id",
        "status",
        "cover_letter",
        "resume_url",
        "applied_at",
        "reviewed_at",
        "created_at",
        "updated_at",
    ]

    result = {}

    for field in fields:
        if hasattr(application, field):
            result[field] = getattr(application, field)

    candidate = getattr(application, "candidate", None)

    if candidate is not None:
        result["candidate"] = {
            "id": getattr(candidate, "id", None),
            "user_id": getattr(candidate, "user_id", None),
        }

    opportunity = getattr(application, "opportunity", None)

    if opportunity is not None:
        result["opportunity"] = {
            "id": getattr(opportunity, "id", None),
            "title": getattr(opportunity, "title", None),
            "employer_id": getattr(opportunity, "employer_id", None),
        }

    return result
