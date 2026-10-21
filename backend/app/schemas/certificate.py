from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field, HttpUrl


class CertificateBase(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    issuing_organization: str = Field(min_length=1, max_length=255)
    issue_date: date | None = None
    expiry_date: date | None = None
    credential_id: str | None = Field(default=None, max_length=255)
    credential_url: HttpUrl | None = None


class CertificateCreate(CertificateBase):
    candidate_id: int


class CertificateUpdate(BaseModel):
    name: str | None = Field(default=None, max_length=255)
    issuing_organization: str | None = Field(default=None, max_length=255)
    issue_date: date | None = None
    expiry_date: date | None = None
    credential_id: str | None = Field(default=None, max_length=255)
    credential_url: HttpUrl | None = None


class CertificateResponse(CertificateBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    candidate_id: int
    created_at: datetime