from typing import Any, Iterable


class SkillMatcher:
    """Compare a candidate's skills with an opportunity's required skills."""

    @staticmethod
    def _normalise_skill(skill: Any) -> str:
        """Convert a skill object or string into a comparable value."""

        if isinstance(skill, str):
            return skill.strip().casefold()

        if isinstance(skill, dict):
            name = skill.get("name", "")
            return str(name).strip().casefold()

        name = getattr(skill, "name", "")
        return str(name).strip().casefold()

    @classmethod
    def _skill_names(cls, skills: Iterable[Any]) -> set[str]:
        """Return a set of normalised, non-empty skill names."""

        return {
            name
            for skill in skills
            if (name := cls._normalise_skill(skill))
        }

    @classmethod
    def compare_skills(
        cls,
        candidate_skills: Iterable[Any],
        required_skills: Iterable[Any],
    ) -> dict:
        """Compare candidate skills with required skills."""

        candidate_names = cls._skill_names(candidate_skills)
        required_names = cls._skill_names(required_skills)

        matched = sorted(candidate_names & required_names)
        missing = sorted(required_names - candidate_names)
        additional = sorted(candidate_names - required_names)

        if not required_names:
            score = 100.0
        else:
            score = round(
                len(matched) / len(required_names) * 100,
                2,
            )

        return {
            "skills_score": score,
            "matched_skills": matched,
            "missing_skills": missing,
            "additional_skills": additional,
            "required_skills_count": len(required_names),
            "matched_skills_count": len(matched),
        }

    @classmethod
    def get_missing_skills(
        cls,
        candidate_skills: Iterable[Any],
        required_skills: Iterable[Any],
    ) -> list[str]:
        """Return required skills the candidate does not currently have."""

        comparison = cls.compare_skills(
            candidate_skills,
            required_skills,
        )
        return comparison["missing_skills"]
