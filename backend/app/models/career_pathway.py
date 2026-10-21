
from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship

from app.models.base import Base


class CareerPathway(Base):
    __tablename__ = "career_pathways"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    target_role = Column(String(150), nullable=True)
    difficulty_level = Column(String(50), nullable=True)
    estimated_duration = Column(String(100), nullable=True)

    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)

    creator = relationship("User", foreign_keys=[created_by])
