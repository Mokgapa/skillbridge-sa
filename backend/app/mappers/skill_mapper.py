from typing import Any


def skill_to_dict(skill: Any) -> dict:
    """Convert a skill model into a dictionary."""

    if skill is None:
        return {}

    fields = [
        "id",
        "name",
        "category",
        "description",
        "is_active",
        "created_at",
        "updated_at",
    ]

    result = {}

    for field in fields:
        if hasattr(skill, field):
            result[field] = getattr(skill, field)

    return result


def candidate_skill_to_dict(candidate_skill: Any) -> dict:
    """Convert a candidate-skill association into a dictionary."""

    if candidate_skill is None:
        return {}

    fields = [
        "id",
        "candidate_id",
        "skill_id",
        "proficiency_level",
        "years_of_experience",
        "created_at",
        "updated_at",
    ]

    result = {}

    for field in fields:
        if hasattr(candidate_skill, field):
            result[field] = getattr(candidate_skill, field)

    skill = getattr(candidate_skill, "skill", None)

    if skill is not None:
        result["skill"] = skill_to_dict(skill)

    return result
