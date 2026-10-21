from typing import Any


def certificate_to_dict(certificate: Any) -> dict:
    """Convert a certificate model into a dictionary."""

    if certificate is None:
        return {}

    fields = [
        "id",
        "candidate_id",
        "name",
        "issuing_organization",
        "issue_date",
        "expiry_date",
        "credential_id",
        "credential_url",
        "description",
        "created_at",
        "updated_at",
    ]

    result = {}

    for field in fields:
        if hasattr(certificate, field):
            result[field] = getattr(certificate, field)

    return result
