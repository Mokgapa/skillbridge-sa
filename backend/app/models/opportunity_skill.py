from sqlalchemy import ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column

from app.config.database import Base


class OpportunitySkill(Base):
    __tablename__ = "opportunity_skills"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
    )

    opportunity_id: Mapped[int] = mapped_column(
        ForeignKey("opportunities.id", ondelete="CASCADE"),
        nullable=False,
    )

    skill_id: Mapped[int] = mapped_column(
        ForeignKey("skills.id", ondelete="CASCADE"),
        nullable=False,
    )

    required_level: Mapped[int] = mapped_column(
        Integer,
        default=1,
        nullable=False,
    )

    is_required: Mapped[bool] = mapped_column(
        default=True,
        nullable=False,
    )