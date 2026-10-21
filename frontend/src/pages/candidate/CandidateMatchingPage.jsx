
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { matchingService } from "../../services";
import {
  ErrorMessage,
  LoadingSpinner,
  EmptyState,
  SectionHeader,
  ProgressBar,
} from "../../components";

export default function CandidateMatchingPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadMatches();
  }, []);

  async function loadMatches() {
    setLoading(true);
    setError("");

    try {
      const response = await matchingService.getRecommendations();

      const items = Array.isArray(response)
        ? response
        : response?.items ||
          response?.matches ||
          response?.recommendations ||
          response?.data ||
          [];

      setMatches(items);
    } catch (err) {
      setError(
        err?.message ||
          "Unable to load your skill matches. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function getMatchScore(match) {
    const value =
      match.match_score ??
      match.score ??
      match.match_percentage ??
      match.compatibility_score ??
      0;

    const score = Number(value);

    if (!Number.isFinite(score)) return 0;

    // Accommodate either a percentage (0–100) or a fraction (0–1).
    return Math.max(0, Math.min(100, score <= 1 ? score * 100 : score));
  }

  function getTitle(match) {
    return (
      match.opportunity?.title ||
      match.opportunity_title ||
      match.title ||
      match.career_pathway?.title ||
      match.career_title ||
      "Recommended opportunity"
    );
  }

  function getDescription(match) {
    return (
      match.opportunity?.description ||
      match.description ||
      match.career_pathway?.description ||
      "Explore this recommendation to learn more about the opportunity and its requirements."
    );
  }

  function getMissingSkills(match) {
    const skills =
      match.missing_skills ||
      match.skill_gaps ||
      match.skills_to_develop ||
      [];

    if (Array.isArray(skills)) {
      return skills.map((skill) =>
        typeof skill === "string"
          ? skill
          : skill.name || skill.skill_name || skill.skill?.name
      ).filter(Boolean);
    }

    return [];
  }

  if (loading) {
    return <LoadingSpinner message="Finding your best matches..." />;
  }

  return (
    <div className="page-container candidate-matching-page">
      <SectionHeader
        title="Your Skill Matches"
        subtitle="Discover opportunities that align with your skills and identify areas you can improve."
      />

      {error && (
        <ErrorMessage message={error} onRetry={loadMatches} />
      )}

      {!error && matches.length === 0 ? (
        <EmptyState
          title="No matches available yet"
          description="Add skills and complete your candidate profile to help us find relevant opportunities."
        />
      ) : (
        <div className="matching-list">
          {matches.map((match, index) => {
            const score = getMatchScore(match);
            const missingSkills = getMissingSkills(match);
            const opportunityId =
              match.opportunity_id ??
              match.opportunity?.id ??
              match.id;

            return (
              <article
                className="card match-card"
                key={match.id ?? opportunityId ?? index}
              >
                <div className="match-card-header">
                  <div>
                    <h3>{getTitle(match)}</h3>
                    <p className="text-muted">
                      {match.opportunity?.company_name ||
                        match.company_name ||
                        match.employer?.company_name ||
                        "Recommended for you"}
                    </p>
                  </div>

                  <div className="match-score">
                    <strong>{Math.round(score)}%</strong>
                    <span>match</span>
                  </div>
                </div>

                <ProgressBar value={score} />

                <p className="card-description">{getDescription(match)}</p>

                {missingSkills.length > 0 && (
                  <div className="skill-gap-section">
                    <h4>Skills to develop</h4>
                    <div className="tag-list">
                      {missingSkills.map((skill) => (
                        <span className="skill-tag" key={skill}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="card-actions">
                  {opportunityId && (
                    <Link
                      className="btn btn-primary"
                      to={`/opportunities/${opportunityId}`}
                    >
                      View opportunity
                    </Link>
                  )}

                  <Link
                    className="btn btn-outline"
                    to="/candidate/skills"
                  >
                    Update my skills
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
