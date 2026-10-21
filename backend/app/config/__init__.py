"""Configuration and database setup for SkillBridge SA."""

from app.config.config import settings
from app.config.database import Base, engine, get_db

__all__ = [
    "settings",
    "Base",
    "engine",
    "get_db",
]
