from sqlalchemy.orm import Session

from app.models.career_pathway import CareerPathway


class CareerPathwayService:
    """Handles career pathway information."""

    def get_all_pathways(
        self,
        db: Session,
    ):
        return (
            db.query(CareerPathway)
            .order_by(CareerPathway.name.asc())
            .all()
        )

    def get_pathway_by_id(
        self,
        db: Session,
        pathway_id: int,
    ):
        return (
            db.query(CareerPathway)
            .filter(CareerPathway.id == pathway_id)
            .first()
        )

    def search_pathways(
        self,
        db: Session,
        search_term: str,
    ):
        term = f"%{search_term.strip()}%"

        return (
            db.query(CareerPathway)
            .filter(CareerPathway.name.ilike(term))
            .order_by(CareerPathway.name.asc())
            .all()
        )

    def get_pathway_skills(
        self,
        db: Session,
        pathway_id: int,
    ):
        pathway = self.get_pathway_by_id(db, pathway_id)

        if pathway is None:
            return None

        return getattr(pathway, "skills", [])
