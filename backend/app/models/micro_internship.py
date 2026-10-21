
from sqlalchemy import (
    Column,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.orm import relationship

from app.models.base import Base


class MicroInternship(Base):
    __tablename__ = "micro_internships"

    id = Column(Integer, primary_key=True, index=True)
    employer_id = Column(
        Integer,
        ForeignKey("employers.id", ondelete="CASCADE"),
        nullable=False,
    )
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    duration_days = Column(Integer, nullable=False)
    location = Column(String(255), nullable=True)
    work_mode = Column(String(20), nullable=False, default="REMOTE")
    status = Column(String(20), nullable=False, default="DRAFT")
    deadline = Column(Date, nullable=True)
    created_at = Column(
        DateTime,
        nullable=False,
        server_default=func.current_timestamp(),
    )

    employer = relationship("Employer")
