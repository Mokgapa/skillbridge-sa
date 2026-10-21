from typing import Any


def work_experience_to_dict(experience: Any) -> dict:
    """Convert a work experience model into a dictionary."""

    if experience is None:
        return {}

    fields = [
        "id",
        "candidate_id",
        "job_title",
        "company_name",
        "location",
        "employment_type",
        "start_date",
        "end_date",
        "is_current",
        "description",
        "responsibilities",
        "created_at",
        "updated_at",
    ]

    result = {}

    for field in fields:
        if hasattr(experience, field):
            result[field] = getattr(experience, field)

    return result
