
from sqlalchemy import Column, Integer

from app.models.base import Base


class Employer(Base):
    __tablename__ = "employers"

    id = Column(Integer, primary_key=True, index=True)
