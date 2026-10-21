
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  EmptyState,
  ErrorMessage,
  LoadingSpinner,
  OpportunityCard,
  ProgressBar,
  SectionHeader,
  StatusBadge,
} from "../../components";
import { useAuth } from "../../context/AuthContext";
import candidateService from "../../services/candidateService";
import applicationService from "../../services/applicationService";
import matchingService from "../../services/matchingService";

function getList(response, keys = []) {
  if (Array.isArray(response)) return response;

  for (const key of keys) {
    if (Array.isArray(response?.[key])) return response[key];
    if (Array.isArray(response?.data?.[key])) return response.data[key];
  }

  if (Array.isArray(response?.data)) return response.data;

  return [];
}

function getProfileCompletion(profile) {
  if (typeof profile?.profile_completion === "number") {
    return Math.min(100, Math.max(0, profile.profile_completion));
  }

  if (typeof profile?.completion_percentage === "number") {
    return Math.min(100, Math.max(0, profile.completion_percentage));
  }

  const fields = [
    profile?.full_name,
    profile?.headline,
    profile?.bio,
    profile?.location,
    profile?.education,
    profile?.skills,
  ];

  const completed = fields.filter((value) => {
    if (Array.isArray(value)) return value.length > 0;
    return Boolean(value);
  }).length;

  return Math.round((completed / fields.length) * 100);
}

export default function CandidateDashboardPage() {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setLoading(true);
      setError("");

      const results = await Promise.allSettled([
        candidateService.getProfile(),
        applicationService.getMyApplications(),
        matchingService.getRecommendations(),
      ]);

      if (!active) return;

      const errors = [];

      if (results[0].status === "fulfilled") {
        const result = results[0].value;
        setProfile(
          result?.data?.profile ??
            result?.profile ??
            result?.data ??
            result ??
            null
        );
      } else {
        errors.push("profile");
      }

      if (results[1].status === "fulfilled") {
        setApplications(
          getList(results[1].value, ["applications", "items", "results"])
        );
      } else {
        errors.push("applications");
      }

      if (results[2].status === "fulfilled") {
        setMatches(
          getList(results[2].value, [
            "recommendations",
            "matches",
            "items",
            "results",
          ])
        );
      } else {
        errors.push("recommendations");
      }

      if (errors.length === 3) {
        setError("We could not load your dashboard. Please try again.");
      } else if (errors.length > 0) {
        setError(
          "Some dashboard information could not be loaded. You can still use the sections that are available."
        );
      }

      setLoading(false);
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const firstName =
    profile?.full_name?.trim()?.split(/\s+/)[0] ||
    user?.full_name?.trim()?.split(/\s+/)[0] ||
    user?.name?.trim()?.split(/\s+/)[0] ||
    "there";

  const completion = getProfileCompletion(profile || {});
  const recentApplications = applications.slice(0, 4);
  const recommendedOpportunities = matches
    .map((match) => match.opportunity ?? match)
    .filter((opportunity) => opportunity?.title)
    .slice(0, 3);

  const pendingApplications = applications.filter((application) =>
    ["pending", "submitted", "under_review", "in_review"].includes(
      String(application.status ?? "pending").toLowerCase()
    )
  ).length;

  return (
    <main className="candidate-dashboard dashboard-page">
      <header className="dashboard-welcome">
        <div>
          <span className="section-heading__eyebrow">
            Candidate workspace
          </span>
          <h1>Welcome back, {firstName}!</h1>
          <p>
            Keep building your skills and take the next step towards your
            career goals.
          </p>
        </div>

        <Link
          to="/candidate/profile"
          className="button button--primary"
        >
          Update profile
        </Link>
      </header>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <section className="candidate-dashboard__overview">
            <article className="dashboard-summary-card">
              <span className="dashboard-summary-card__label">
                Applications
              </span>
              <strong className="dashboard-summary-card__value">
                {applications.length}
              </strong>
              <Link to="/candidate/applications">
                View applications
              </Link>
            </article>

            <article className="dashboard-summary-card">
              <span className="dashboard-summary-card__label">
                Awaiting updates
              </span>
              <strong className="dashboard-summary-card__value">
                {pendingApplications}
              </strong>
              <Link to="/candidate/applications">
                Track progress
              </Link>
            </article>

            <article className="dashboard-summary-card">
              <span className="dashboard-summary-card__label">
                Recommended opportunities
              </span>
              <strong className="dashboard-summary-card__value">
                {matches.length}
              </strong>
              <Link to="/opportunities">
                Explore opportunities
              </Link>
            </article>
          </section>

          <section className="dashboard-panel candidate-dashboard__profile">
            <SectionHeader
              title="Your profile progress"
              description="A more complete profile helps employers understand your experience and skills."
              action={
                <Link to="/candidate/profile">Complete your profile</Link>
              }
            />

            <ProgressBar value={completion} />

            <p className="candidate-dashboard__completion">
              {completion}% complete
            </p>

            {completion < 100 && (
              <p>
                Add your skills, education, certificates and experience to
                strengthen your profile.
              </p>
            )}
          </section>

          <section className="dashboard-panel">
            <SectionHeader
              title="Recommended opportunities"
              description="Explore opportunities that may fit your career interests."
              action={
                <Link to="/opportunities">Browse all opportunities</Link>
              }
            />

            {recommendedOpportunities.length > 0 ? (
              <div className="opportunities-grid">
                {recommendedOpportunities.map((opportunity, index) => (
                  <OpportunityCard
                    key={
                      opportunity.opportunity_id ??
                      opportunity.id ??
                      `${opportunity.title}-${index}`
                    }
                    opportunity={opportunity}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No recommendations yet"
                description="Keep your profile up to date and browse available opportunities while recommendations become available."
                action={
                  <Link
                    to="/opportunities"
                    className="button button--secondary"
                  >
                    Explore opportunities
                  </Link>
                }
              />
            )}
          </section>

          <section className="dashboard-panel">
            <SectionHeader
              title="Recent applications"
              description="Keep track of your latest applications and their status."
              action={
                <Link to="/candidate/applications">
                  View all applications
                </Link>
              }
            />

            {recentApplications.length > 0 ? (
              <div className="candidate-dashboard__applications">
                {recentApplications.map((application, index) => {
                  const applicationId =
                    application.application_id ?? application.id;
                  const opportunityId =
                    application.opportunity_id ??
                    application.opportunity?.id;
                  const title =
                    application.opportunity_title ??
                    application.opportunity?.title ??
                    "Opportunity";

                  return (
                    <article
                      className="candidate-dashboard__application-row"
                      key={applicationId ?? `${title}-${index}`}
                    >
                      <div>
                        <h3>{title}</h3>
                        <p>
                          {application.company_name ??
                            application.employer_name ??
                            application.opportunity?.company_name ??
                            "Employer"}
                        </p>
                      </div>

                      <StatusBadge status={application.status ?? "pending"} />

                      {opportunityId != null && (
                        <Link to={`/opportunities/${opportunityId}`}>
                          View
                        </Link>
                      )}
                    </article>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                title="No applications yet"
                description="When you apply for an opportunity, it will appear here."
                action={
                  <Link
                    to="/opportunities"
                    className="button button--primary"
                  >
                    Find opportunities
                  </Link>
                }
              />
            )}
          </section>

          <section className="candidate-dashboard__quick-links">
            <h2>Continue your journey</h2>

            <div className="candidate-dashboard__quick-links-grid">
              <Link to="/candidate/skills" className="dashboard-quick-link">
                <strong>My skills</strong>
                <span>Manage your skills and identify gaps.</span>
              </Link>

              <Link
                to="/candidate/education"
                className="dashboard-quick-link"
              >
                <strong>Education and certificates</strong>
                <span>Showcase your qualifications.</span>
              </Link>

              <Link
                to="/candidate/career-pathways"
                className="dashboard-quick-link"
              >
                <strong>Career pathways</strong>
                <span>Explore possible career directions.</span>
              </Link>

              <Link
                to="/candidate/mentorship"
                className="dashboard-quick-link"
              >
                <strong>Mentorship</strong>
                <span>Discover opportunities to learn from others.</span>
              </Link>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
