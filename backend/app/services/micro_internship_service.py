from sqlalchemy.orm import Session

from app.models.micro_internship import MicroInternship


class MicroInternshipService:
    """Handles micro-internship opportunities."""

    def get_all_micro_internships(
        self,
        db: Session,
        active_only: bool = True,
    ):
        query = db.query(MicroInternship)

        if active_only:
            query = query.filter(
                MicroInternship.status == "active"
            )

        return query.order_by(
            MicroInternship.created_at.desc()
        ).all()

    def get_micro_internship_by_id(
        self,
        db: Session,
        micro_internship_id: int,
    ):
        return (
            db.query(MicroInternship)
            .filter(
                MicroInternship.id == micro_internship_id
            )
            .first()
        )

    def get_micro_internships_by_employer(
        self,
        db: Session,
        employer_id: int,
    ):
        return (
            db.query(MicroInternship)
            .filter(
                MicroInternship.employer_id == employer_id
            )
            .order_by(
                MicroInternship.created_at.desc()
            )
            .all()
        )

    def search_micro_internships(
        self,
        db: Session,
        search_term: str,
        active_only: bool = True,
    ):
        term = f"%{search_term.strip()}%"

        query = db.query(MicroInternship).filter(
            MicroInternship.title.ilike(term)
        )

        if active_only:
            query = query.filter(
                MicroInternship.status == "active"
            )

        return query.order_by(
            MicroInternship.created_at.desc()
        ).all()