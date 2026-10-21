from typing import Any


def opportunity_to_dict(opportunity: Any) -> dict:
    """Convert an opportunity model into a dictionary."""

    if opportunity is None:
        return {}

    fields = [
        "id",
        "employer_id",
        "title",
        "description",
        "opportunity_type",
        "employment_type",
        "location",
        "province",
        "city",
        "is_remote",
        "salary_min",
        "salary_max",
        "application_deadline",
        "start_date",
        "end_date",
        "status",
        "created_at",
        "updated_at",
    ]

    result = {}

    for field in fields:
        if hasattr(opportunity, field):
            result[field] = getattr(opportunity, field)

    employer = getattr(opportunity, "employer", None)

    if employer is not None:
        result["employer"] = {
            "id": getattr(employer, "id", None),
            "company_name": getattr(employer, "company_name", None),
            "logo_url": getattr(employer, "logo_url", None),
            "is_verified": getattr(employer, "is_verified", None),
        }

    skills = getattr(opportunity, "skills", None)

    if skills is not None:
        result["skills"] = [
            {
                "id": getattr(skill, "id", None),
                "name": getattr(skill, "name", None),
            }
            for skill in skills
        ]

    return result
