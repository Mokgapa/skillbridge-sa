from typing import Generic, TypeVar

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.base import Base


ModelType = TypeVar("ModelType", bound=Base)


class BaseRepository(Generic[ModelType]):
    """
    Generic repository containing common database operations.
    """

    def __init__(self, model: type[ModelType]):
        self.model = model

    def get_by_id(
        self,
        db: Session,
        record_id: int,
    ) -> ModelType | None:
        statement = select(self.model).where(
            self.model.id == record_id
        )

        return db.execute(statement).scalar_one_or_none()

    def get_all(
        self,
        db: Session,
    ) -> list[ModelType]:
        statement = select(self.model)

        return list(
            db.execute(statement).scalars().all()
        )

    def create(
        self,
        db: Session,
        data: dict,
    ) -> ModelType:
        record = self.model(**data)

        db.add(record)
        db.flush()
        db.refresh(record)

        return record

    def update(
        self,
        db: Session,
        record: ModelType,
        data: dict,
    ) -> ModelType:
        for field, value in data.items():
            if value is not None:
                setattr(record, field, value)

        db.flush()
        db.refresh(record)

        return record

    def delete(
        self,
        db: Session,
        record: ModelType,
    ) -> None:
        db.delete(record)
        db.flush()