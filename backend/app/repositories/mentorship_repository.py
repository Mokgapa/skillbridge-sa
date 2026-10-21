from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.models.mentorship import Mentorship
from app.repositories.base_repository import BaseRepository


class MentorshipRepository(BaseRepository[Mentorship]):
    def __init__(self):
        super().__init__(Mentorship)

    def get_by_mentor_id(
        self,
        db: Session,
        mentor_user_id: int,
    ) -> list[Mentorship]:
        statement = select(Mentorship).where(
            Mentorship.mentor_user_id == mentor_user_id
        )

        return list(
            db.execute(statement).scalars().all()
        )

    def get_by_mentee_id(
        self,
        db: Session,
        mentee_user_id: int,
    ) -> list[Mentorship]:
        statement = select(Mentorship).where(
            Mentorship.mentee_user_id == mentee_user_id
        )

        return list(
            db.execute(statement).scalars().all()
        )

    def get_user_mentorships(
        self,
        db: Session,
        user_id: int,
    ) -> list[Mentorship]:
        statement = select(Mentorship).where(
            or_(
                Mentorship.mentor_user_id == user_id,
                Mentorship.mentee_user_id == user_id,
            )
        )

        return list(
            db.execute(statement).scalars().all()
        )