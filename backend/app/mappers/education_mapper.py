from typing import Any


def education_to_dict(education: Any) -> dict:
    """Convert an education model into a dictionary."""

    if education is None:
        return {}

    fields = [
        "id",
        "candidate_id",
        "institution",
        "qualification",
        "field_of_study",
        "start_date",
        "end_date",
        "is_current",
        "description",
        "created_at",
        "updated_at",
    ]

    result = {}

    for field in fields:
        if hasattr(education, field):
            result[field] = getattr(education, field)

    return result
