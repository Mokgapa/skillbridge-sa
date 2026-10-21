
import { Link } from "react-router-dom";
import { formatDate } from "../utils/formatters";
import SkillTag from "./SkillTag";
import StatusBadge from "./StatusBadge";

export default function OpportunityCard({ opportunity }) {
  if (!opportunity) return null;

  const {
    id,
    opportunity_id,
    title,
    description,
    company_name,
    employer_name,
    company,
    location,
    opportunity_type,
    type,
    work_type,
    skills = [],
    required_skills = [],
    application_deadline,
    deadline,
    status,
  } = opportunity;

  const opportunityId = opportunity_id ?? id;
  const companyName =
    company_name ?? employer_name ?? company?.name ?? "Employer";
  const opportunityType = opportunity_type ?? type ?? "Opportunity";
  const displayedSkills = Array.isArray(skills)
    ? skills
    : Array.isArray(required_skills)
      ? required_skills
      : [];

  const visibleSkills = displayedSkills.slice(0, 4);
  const remainingSkills = Math.max(0, displayedSkills.length - 4);

  return (
    <article className="opportunity-card">
      <div className="opportunity-card__header">
        <div>
          <span className="opportunity-card__type">
            {String(opportunityType).replaceAll("_", " ")}
          </span>

          <h3 className="opportunity-card__title">
            <Link to={`/opportunities/${opportunityId}`}>
              {title || "Untitled opportunity"}
            </Link>
          </h3>

          <p className="opportunity-card__company">{companyName}</p>
        </div>

        {status && <StatusBadge status={status} />}
      </div>

      {description && (
        <p className="opportunity-card__description">
          {description.length > 180
            ? `${description.slice(0, 180).trim()}…`
            : description}
        </p>
      )}

      <div className="opportunity-card__details">
        {location && (
          <span>
            <strong>Location:</strong> {location}
          </span>
        )}

        {work_type && (
          <span>
            <strong>Work arrangement:</strong>{" "}
            {String(work_type).replaceAll("_", " ")}
          </span>
        )}

        {(application_deadline || deadline) && (
          <span>
            <strong>Deadline:</strong>{" "}
            {formatDate(application_deadline ?? deadline)}
          </span>
        )}
      </div>

      {visibleSkills.length > 0 && (
        <div className="opportunity-card__skills">
          {visibleSkills.map((skill, index) => {
            const skillName =
              typeof skill === "string"
                ? skill
                : skill?.name ?? skill?.skill_name ?? "Skill";

            return <SkillTag key={skill?.id ?? skillName + index} skill={skill} />;
          })}

          {remainingSkills > 0 && (
            <span className="opportunity-card__more-skills">
              +{remainingSkills} more
            </span>
          )}
        </div>
      )}

      <div className="opportunity-card__footer">
        <Link
          className="button button--primary"
          to={`/opportunities/${opportunityId}`}
        >
          View opportunity
        </Link>
      </div>
    </article>
  );
}
