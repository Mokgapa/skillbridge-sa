from sqlalchemy.orm import Session

from app.models.mentorship import Mentorship
from app.repositories.mentorship_repository import MentorshipRepository
from app.schemas.mentorship import MentorshipCreate, MentorshipUpdate


class MentorshipService:
    """Handles mentorship requests and mentorship records."""

    def __init__(self):
        self.mentorship_repository = MentorshipRepository()

    def create_mentorship(
        self,
        db: Session,
        mentorship_data: MentorshipCreate,
    ) -> Mentorship:
        data = mentorship_data.model_dump()

        mentor_user_id = data.get("mentor_user_id")
        mentee_user_id = data.get("mentee_user_id")

        if mentor_user_id == mentee_user_id:
            raise ValueError("A user cannot mentor themselves.")

        mentorship = Mentorship(**data)

        db.add(mentorship)
        db.commit()
        db.refresh(mentorship)

        return mentorship

    def get_mentorship(
        self,
        db: Session,
        mentorship_id: int,
    ):
        return (
            db.query(Mentorship)
            .filter(Mentorship.id == mentorship_id)
            .first()
        )

    def get_user_mentorships(
        self,
        db: Session,
        user_id: int,
    ):
        return (
            db.query(Mentorship)
            .filter(
                (Mentorship.mentor_user_id == user_id)
                | (Mentorship.mentee_user_id == user_id)
            )
            .all()
        )

    def update_mentorship(
        self,
        db: Session,
        mentorship_id: int,
        mentorship_data: MentorshipUpdate,
    ):
        mentorship = self.get_mentorship(db, mentorship_id)

        if mentorship is None:
            return None

        update_data = mentorship_data.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            setattr(mentorship, field, value)

        db.commit()
        db.refresh(mentorship)

        return mentorship

    def delete_mentorship(
        self,
        db: Session,
        mentorship_id: int,
    ) -> bool:
        mentorship = self.get_mentorship(db, mentorship_id)

        if mentorship is None:
            return False

        db.delete(mentorship)
        db.commit()

        return True