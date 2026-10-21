
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ErrorMessage,
  LoadingSpinner,
  SkillTag,
  StatusBadge,
} from "../../components";
import opportunityService from "../../services/opportunityService";
import { formatDate } from "../../utils/formatters";
import { useAuth } from "../../context/AuthContext";

function getOpportunity(response) {
  return (
    response?.data?.opportunity ??
    response?.data?.item ??
    response?.opportunity ??
    response?.item ??
    response?.data ??
    response
  );
}

function displayText(value, fallback = "Not specified") {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  return String(value).replaceAll("_", " ");
}

export default function OpportunityDetailsPage() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();

  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applying, setApplying] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadOpportunity() {
      setLoading(true);
      setError("");
      setOpportunity(null);

      try {
        const response = await opportunityService.getById(id);

        if (active) {
          const result = getOpportunity(response);

          if (!result || typeof result !== "object") {
            throw new Error("Opportunity details were not found.");
          }

          setOpportunity(result);
        }
      } catch (err) {
        if (active) {
          setError(
            err?.message ||
              "We could not load this opportunity. Please try again."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    if (id) {
      loadOpportunity();
    } else {
      setError("No opportunity was selected.");
      setLoading(false);
    }

    return () => {
      active = false;
    };
  }, [id]);

  async function handleApply() {
    if (!isAuthenticated) {
      setApplicationMessage("Please sign in to apply for this opportunity.");
      return;
    }

    const role = String(user?.role ?? user?.role_name ?? "")
      .toLowerCase()
      .replace("role_", "");

    if (role && !role.includes("candidate")) {
      setApplicationMessage(
        "Only candidate accounts can apply for opportunities."
      );
      return;
    }

    setApplying(true);
    setApplicationMessage("");

    try {
      await opportunityService.apply(id);
      setApplicationMessage(
        "Your application has been submitted successfully."
      );
    } catch (err) {
      setApplicationMessage(
        err?.message ||
          "We could not submit your application. Please try again."
      );
    } finally {
      setApplying(false);
    }
  }

  if (loading) {
    return (
      <main className="section-container opportunity-details">
        <LoadingSpinner />
      </main>
    );
  }

  if (error || !opportunity) {
    return (
      <main className="section-container opportunity-details">
        <ErrorMessage
          message={error || "Opportunity not found."}
        />
        <Link to="/opportunities" className="button button--secondary">
          Browse opportunities
        </Link>
      </main>
    );
  }

  const title = opportunity.title ?? "Opportunity";
  const company =
    opportunity.company_name ??
    opportunity.employer_name ??
    opportunity.employer?.company_name ??
    opportunity.employer?.name ??
    "Employer";
  const skills = Array.isArray(opportunity.skills)
    ? opportunity.skills
    : Array.isArray(opportunity.required_skills)
      ? opportunity.required_skills
      : [];

  const deadline =
    opportunity.application_deadline ?? opportunity.deadline;

  const description =
    opportunity.description ?? "No description has been provided.";

  return (
    <main className="section-container opportunity-details">
      <Link to="/opportunities" className="opportunity-details__back">
        ← Back to opportunities
      </Link>

      <article className="opportunity-details__card">
        <header className="opportunity-details__header">
          <div>
            <span className="section-heading__eyebrow">
              {displayText(
                opportunity.opportunity_type ?? opportunity.type,
                "Career opportunity"
              )}
            </span>

            <h1>{title}</h1>
            <p className="opportunity-details__company">{company}</p>
          </div>

          {opportunity.status && (
            <StatusBadge status={opportunity.status} />
          )}
        </header>

        <section className="opportunity-details__facts">
          <div>
            <span className="opportunity-details__fact-label">Location</span>
            <strong>{displayText(opportunity.location)}</strong>
          </div>

          <div>
            <span className="opportunity-details__fact-label">
              Work arrangement
            </span>
            <strong>{displayText(opportunity.work_type)}</strong>
          </div>

          <div>
            <span className="opportunity-details__fact-label">
              Application deadline
            </span>
            <strong>
              {deadline ? formatDate(deadline) : "Not specified"}
            </strong>
          </div>

          <div>
            <span className="opportunity-details__fact-label">
              Remuneration
            </span>
            <strong>
              {displayText(
                opportunity.salary_range ??
                  opportunity.stipend ??
                  opportunity.remuneration
              )}
            </strong>
          </div>
        </section>

        <section className="opportunity-details__section">
          <h2>About this opportunity</h2>
          <p className="opportunity-details__description">{description}</p>
        </section>

        {skills.length > 0 && (
          <section className="opportunity-details__section">
            <h2>Skills required</h2>

            <div className="opportunity-details__skills">
              {skills.map((skill, index) => (
                <SkillTag
                  key={skill?.id ?? skill?.name ?? skill?.skill_name ?? index}
                  skill={skill}
                />
              ))}
            </div>
          </section>
        )}

        {opportunity.requirements && (
          <section className="opportunity-details__section">
            <h2>Requirements</h2>
            <p>{opportunity.requirements}</p>
          </section>
        )}

        {opportunity.benefits && (
          <section className="opportunity-details__section">
            <h2>What you can gain</h2>
            <p>{opportunity.benefits}</p>
          </section>
        )}

        <footer className="opportunity-details__footer">
          <button
            type="button"
            className="button button--primary"
            onClick={handleApply}
            disabled={applying}
          >
            {applying ? "Submitting..." : "Apply now"}
          </button>

          {applicationMessage && (
            <p className="opportunity-details__message" role="status">
              {applicationMessage}
              {!isAuthenticated && (
                <>
                  {" "}
                  <Link to="/login">Sign in</Link> or{" "}
                  <Link to="/register">create an account</Link>.
                </>
              )}
            </p>
          )}
        </footer>
      </article>
    </main>
  );
}
