
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

export default function CandidateSkillGapPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSkillGaps();
  }, []);

  async function loadSkillGaps() {
    setLoading(true);
    setError("");

    try {
      const response = await matchingService.getSkillGaps();
      setReport(response?.data ?? response);
    } catch (err) {
      setError(
        err?.message ||
          "Unable to load your skill-gap report. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function normalizeSkills(value) {
    if (!Array.isArray(value)) return [];

    return value
      .map((skill) => {
        if (typeof skill === "string") {
          return { name: skill, priority: "Recommended" };
        }

        return {
          name: skill.name || skill.skill_name || skill.skill?.name || "Skill",
          priority: skill.priority || skill.importance || "Recommended",
          description: skill.description || "",
          proficiency: skill.proficiency_level || skill.current_level || "",
        };
      })
      .filter((skill) => skill.name);
  }

  if (loading) {
    return <LoadingSpinner message="Preparing your skill-gap report..." />;
  }

  const currentSkills = normalizeSkills(
    report?.current_skills || report?.existing_skills
  );
  const missingSkills = normalizeSkills(
    report?.missing_skills ||
      report?.skill_gaps ||
      report?.skills_to_develop
  );

  const rawScore =
    report?.readiness_score ??
    report?.match_score ??
    report?.completion_percentage ??
    0;

  const numericScore = Number(rawScore);
  const readinessScore = Number.isFinite(numericScore)
    ? Math.max(
        0,
        Math.min(100, numericScore <= 1 ? numericScore * 100 : numericScore)
      )
    : 0;

  return (
    <div className="page-container candidate-skill-gap-page">
      <SectionHeader
        title="Skill Gap Analysis"
        subtitle="Understand your current skills and the areas you can develop to prepare for your target opportunities."
      />

      {error && (
        <ErrorMessage message={error} onRetry={loadSkillGaps} />
      )}

      {!error && (
        <>
          <section className="card skill-readiness-card">
            <div className="section-heading-row">
              <div>
                <h3>Your readiness overview</h3>
                <p className="text-muted">
                  Use this as a guide to plan your next learning steps.
                </p>
              </div>
              <strong className="readiness-score">
                {Math.round(readinessScore)}%
              </strong>
            </div>

            <ProgressBar value={readinessScore} />

            <p className="text-muted">
              This score reflects the report returned by the system. If no
              score is available, it defaults to 0%.
            </p>
          </section>

          <div className="two-column-grid">
            <section className="card">
              <h3>Skills you have</h3>

              {currentSkills.length === 0 ? (
                <EmptyState
                  title="No current skills listed"
                  description="Add your skills to build a more useful analysis."
                />
              ) : (
                <div className="tag-list">
                  {currentSkills.map((skill) => (
                    <span className="skill-tag" key={skill.name}>
                      {skill.name}
                    </span>
                  ))}
                </div>
              )}
            </section>

            <section className="card">
              <h3>Skills to develop</h3>

              {missingSkills.length === 0 ? (
                <EmptyState
                  title="No skill gaps listed"
                  description="Your report has not identified any additional skills to develop."
                />
              ) : (
                <div className="skill-gap-list">
                  {missingSkills.map((skill) => (
                    <article className="skill-gap-item" key={skill.name}>
                      <div>
                        <h4>{skill.name}</h4>
                        {skill.description && (
                          <p>{skill.description}</p>
                        )}
                      </div>

                      <span className="priority-label">
                        {skill.priority}
                      </span>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>

          <section className="card skill-gap-actions">
            <h3>Take your next step</h3>
            <p>
              Keep your profile updated and explore opportunities that match
              your interests. You can then use your skill gaps to guide your
              learning plan.
            </p>

            <div className="card-actions">
              <Link
                to="/candidate/skills"
                className="btn btn-primary"
              >
                Manage my skills
              </Link>

              <Link
                to="/candidate/matching"
                className="btn btn-outline"
              >
                View skill matches
              </Link>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
