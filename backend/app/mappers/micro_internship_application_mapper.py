from typing import Any


def micro_internship_application_to_dict(application: Any) -> dict:
    """Convert a micro-internship application into a dictionary."""

    if application is None:
        return {}

    fields = [
        "id",
        "candidate_id",
        "micro_internship_id",
        "status",
        "cover_letter",
        "applied_at",
        "reviewed_at",
        "created_at",
        "updated_at",
    ]

    result = {}

    for field in fields:
        if hasattr(application, field):
            result[field] = getattr(application, field)

    micro_internship = getattr(application, "micro_internship", None)

    if micro_internship is not None:
        result["micro_internship"] = {
            "id": getattr(micro_internship, "id", None),
            "title": getattr(micro_internship, "title", None),
            "employer_id": getattr(micro_internship, "employer_id", None),
        }

    return result
