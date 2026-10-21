from typing import Any


class MatchingEngine:
    """Calculate how well a candidate matches an opportunity."""

    WEIGHTS = {
        "skills": 0.50,
        "education": 0.20,
        "experience": 0.15,
        "projects": 0.10,
        "location": 0.05,
    }

    @staticmethod
    def calculate_percentage_score(
        matched_items: set[Any],
        required_items: set[Any],
    ) -> float:
        """Calculate the percentage of requirements a candidate meets."""

        if not required_items:
            return 100.0

        matched_count = len(matched_items.intersection(required_items))
        return round((matched_count / len(required_items)) * 100, 2)

    @classmethod
    def calculate_overall_score(
        cls,
        skills_score: float = 0,
        education_score: float = 0,
        experience_score: float = 0,
        projects_score: float = 0,
        location_score: float = 0,
    ) -> float:
        """Calculate a weighted candidate-opportunity match score."""

        scores = {
            "skills": skills_score,
            "education": education_score,
            "experience": experience_score,
            "projects": projects_score,
            "location": location_score,
        }

        for category, score in scores.items():
            if not 0 <= score <= 100:
                raise ValueError(
                    f"{category} score must be between 0 and 100."
                )

        overall_score = sum(
            scores[category] * weight
            for category, weight in cls.WEIGHTS.items()
        )

        return round(overall_score, 2)

    @staticmethod
    def get_match_level(score: float) -> str:
        """Describe the strength of a candidate-opportunity match."""

        if not 0 <= score <= 100:
            raise ValueError("Match score must be between 0 and 100.")

        if score >= 80:
            return "Excellent Match"
        if score >= 60:
            return "Good Match"
        if score >= 40:
            return "Partial Match"
        return "Low Match"

    @classmethod
    def generate_match_result(
        cls,
        skills_score: float,
        education_score: float,
        experience_score: float,
        projects_score: float,
        location_score: float,
    ) -> dict:
        """Return a complete match score breakdown."""

        overall_score = cls.calculate_overall_score(
            skills_score=skills_score,
            education_score=education_score,
            experience_score=experience_score,
            projects_score=projects_score,
            location_score=location_score,
        )

        return {
            "overall_score": overall_score,
            "skills_score": round(skills_score, 2),
            "education_score": round(education_score, 2),
            "experience_score": round(experience_score, 2),
            "projects_score": round(projects_score, 2),
            "location_score": round(location_score, 2),
            "match_level": cls.get_match_level(overall_score),
        }
