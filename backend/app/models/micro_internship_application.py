
from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    CheckConstraint,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import relationship

from app.models.base import Base


class MicroInternshipApplication(Base):
    __tablename__ = "micro_internship_applications"

    id = Column(Integer, primary_key=True, index=True)
    micro_internship_id = Column(
        Integer,
        ForeignKey("micro_internships.id", ondelete="CASCADE"),
        nullable=False,
    )
    candidate_id = Column(
        Integer,
        ForeignKey("candidate_profiles.id", ondelete="CASCADE"),
        nullable=False,
    )
    match_percentage = Column(
        Numeric(5, 2),
        nullable=False,
        default=0.00,
        server_default="0.00",
    )
    status = Column(String(20), nullable=False, default="APPLIED")
    feedback = Column(Text, nullable=True)
    submitted_at = Column(
        DateTime,
        nullable=False,
        server_default=func.current_timestamp(),
    )
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)

    __table_args__ = (
        UniqueConstraint(
            "micro_internship_id",
            "candidate_id",
            name="uq_micro_internship_candidate",
        ),
        CheckConstraint(
            "match_percentage BETWEEN 0 AND 100",
            name="chk_micro_application_match",
        ),
        CheckConstraint(
            "completed_at IS NULL OR started_at IS NULL "
            "OR completed_at >= started_at",
            name="chk_micro_application_dates",
        ),
    )

    micro_internship = relationship("MicroInternship")
    candidate = relationship("CandidateProfile")
