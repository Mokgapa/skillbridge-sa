from typing import Any


def micro_internship_to_dict(micro_internship: Any) -> dict:
    """Convert a micro-internship model into a dictionary."""

    if micro_internship is None:
        return {}

    fields = [
        "id",
        "employer_id",
        "title",
        "description",
        "status",
        "location",
        "is_remote",
        "start_date",
        "end_date",
        "application_deadline",
        "created_at",
        "updated_at",
    ]

    result = {}

    for field in fields:
        if hasattr(micro_internship, field):
            result[field] = getattr(micro_internship, field)

    employer = getattr(micro_internship, "employer", None)

    if employer is not None:
        result["employer"] = {
            "id": getattr(employer, "id", None),
            "company_name": getattr(employer, "company_name", None),
            "logo_url": getattr(employer, "logo_url", None),
        }

    skills = getattr(micro_internship, "skills", None)

    if skills is not None:
        result["skills"] = [
            {
                "id": getattr(skill, "id", None),
                "name": getattr(skill, "name", None),
            }
            for skill in skills
        ]

    return result
