from typing import Any


def career_pathway_to_dict(pathway: Any) -> dict:
    """Convert a career pathway model into a dictionary."""

    if pathway is None:
        return {}

    fields = [
        "id",
        "name",
        "title",
        "description",
        "industry",
        "difficulty_level",
        "estimated_duration",
        "created_at",
        "updated_at",
    ]

    result = {}

    for field in fields:
        if hasattr(pathway, field):
            result[field] = getattr(pathway, field)

    skills = getattr(pathway, "skills", None)

    if skills is not None:
        result["skills"] = [
            {
                "id": getattr(skill, "id", None),
                "name": getattr(skill, "name", None),
            }
            for skill in skills
        ]

    return result
