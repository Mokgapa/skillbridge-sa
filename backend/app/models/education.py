from datetime import date, datetime

from sqlalchemy import Date, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.config.database import Base


class Education(Base):
    __tablename__ = "education"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
    )

    candidate_id: Mapped[int] = mapped_column(
        ForeignKey("candidate_profiles.id", ondelete="CASCADE"),
        nullable=False,
    )

    institution: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    qualification: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    field_of_study: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    start_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    end_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )