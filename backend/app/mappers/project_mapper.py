from typing import Any


def project_to_dict(project: Any) -> dict:
    """Convert a project model into a dictionary."""

    if project is None:
        return {}

    fields = [
        "id",
        "candidate_id",
        "title",
        "description",
        "project_url",
        "repository_url",
        "image_url",
        "start_date",
        "end_date",
        "is_featured",
        "created_at",
        "updated_at",
    ]

    result = {}

    for field in fields:
        if hasattr(project, field):
            result[field] = getattr(project, field)

    technologies = getattr(project, "technologies", None)

    if technologies is not None:
        result["technologies"] = [
            getattr(technology, "name", str(technology))
            for technology in technologies
        ]

    return result
