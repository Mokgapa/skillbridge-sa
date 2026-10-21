from sqlalchemy.orm import Session

from app.models.candidate_profile import CandidateProfile
from app.models.skill import Skill


class SkillGapService:
    """Identifies skills candidates may need to develop."""

    def get_candidate_skill_gaps(
        self,
        db: Session,
        candidate_id: int,
        required_skill_ids: list[int],
    ) -> list[Skill]:
        candidate = (
            db.query(CandidateProfile)
            .filter(CandidateProfile.id == candidate_id)
            .first()
        )

        if candidate is None:
            return []

        candidate_skill_ids = {
            item.skill_id
            for item in getattr(candidate, "skills", [])
        }

        missing_skill_ids = set(required_skill_ids) - candidate_skill_ids

        if not missing_skill_ids:
            return []

        return (
            db.query(Skill)
            .filter(Skill.id.in_(missing_skill_ids))
            .order_by(Skill.name.asc())
            .all()
        )

    def get_candidate_skill_gap_summary(
        self,
        db: Session,
        candidate_id: int,
        required_skill_ids: list[int],
    ) -> dict:
        candidate = (
            db.query(CandidateProfile)
            .filter(CandidateProfile.id == candidate_id)
            .first()
        )

        if candidate is None:
            return {
                "candidate_id": candidate_id,
                "required_skills": len(set(required_skill_ids)),
                "matched_skills": 0,
                "missing_skills": [],
                "message": "Candidate profile not found.",
            }

        required_ids = set(required_skill_ids)
        candidate_ids = {
            item.skill_id
            for item in getattr(candidate, "skills", [])
        }

        matched_ids = required_ids & candidate_ids
        missing_ids = required_ids - candidate_ids

        missing_skills = (
            db.query(Skill)
            .filter(Skill.id.in_(missing_ids))
            .order_by(Skill.name.asc())
            .all()
            if missing_ids
            else []
        )

        return {
            "candidate_id": candidate_id,
            "required_skills": len(required_ids),
            "matched_skills": len(matched_ids),
            "missing_skills": [
                {
                    "id": skill.id,
                    "name": skill.name,
                    "category": skill.category,
                }
                for skill in missing_skills
            ],
            "message": "Skill gap summary generated successfully.",
        }
