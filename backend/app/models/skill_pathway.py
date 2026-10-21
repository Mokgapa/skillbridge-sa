from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.config.database import Base


class SkillPathway(Base):
    __tablename__ = "skill_pathways"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
    )

    name: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    industry: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    required_skills: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    recommended_qualifications: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )