
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  opportunityService,
  applicationService,
} from "../../services";
import {
  ErrorMessage,
  LoadingSpinner,
  SectionHeader,
} from "../../components";

export default function EmployerDashboardPage() {
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      const results = await Promise.allSettled([
        opportunityService.getMyOpportunities(),
        applicationService.getEmployerApplications(),
      ]);

      const opportunityResult = results[0];
      const applicationResult = results[1];

      if (
        opportunityResult.status === "fulfilled"
      ) {
        const response = opportunityResult.value;

        setOpportunities(
          Array.isArray(response)
            ? response
            : response?.items ||
                response?.opportunities ||
                response?.data ||
                []
        );
      } else {
        setError(
          opportunityResult.reason?.message ||
            "Unable to load your opportunities."
        );
      }

      if (
        applicationResult.status === "fulfilled"
      ) {
        const response = applicationResult.value;

        setApplications(
          Array.isArray(response)
            ? response
            : response?.items ||
                response?.applications ||
                response?.data ||
                []
        );
      } else {
        setError((previous) =>
          [
            previous,
            applicationResult.reason?.message ||
              "Unable to load applications.",
          ]
            .filter(Boolean)
            .join(" ")
        );
      }
    } catch (err) {
      setError(
        err?.message || "Unable to load the employer dashboard."
      );
    } finally {
      setLoading(false);
    }
  }

  const activeOpportunities = opportunities.filter(
    (opportunity) =>
      opportunity.is_active !== false &&
      !["closed", "inactive", "draft"].includes(
        String(opportunity.status || "").toLowerCase()
      )
  );

  const pendingApplications = applications.filter((application) =>
    ["pending", "submitted", "under_review", "received"].includes(
      String(application.status || "").toLowerCase()
    )
  );

  if (loading) {
    return <LoadingSpinner message="Loading employer dashboard..." />;
  }

  return (
    <div className="page-container employer-dashboard-page">
      <SectionHeader
        title="Employer Dashboard"
        subtitle="Manage your opportunities and review candidate applications."
      />

      {error && (
        <ErrorMessage message={error} onRetry={loadDashboard} />
      )}

      <div className="stats-grid">
        <article className="card stat-card">
          <span className="stat-label">Total opportunities</span>
          <strong className="stat-value">{opportunities.length}</strong>
        </article>

        <article className="card stat-card">
          <span className="stat-label">Active opportunities</span>
          <strong className="stat-value">
            {activeOpportunities.length}
          </strong>
        </article>

        <article className="card stat-card">
          <span className="stat-label">Applications received</span>
          <strong className="stat-value">{applications.length}</strong>
        </article>

        <article className="card stat-card">
          <span className="stat-label">Pending applications</span>
          <strong className="stat-value">
            {pendingApplications.length}
          </strong>
        </article>
      </div>

      <section className="card dashboard-action-card">
        <div>
          <h3>Manage opportunities</h3>
          <p>
            Create opportunities and keep your listings up to date so
            candidates can discover them.
          </p>
        </div>

        <div className="card-actions">
          <Link
            to="/employer/opportunities"
            className="btn btn-outline"
          >
            View opportunities
          </Link>

          <Link
            to="/employer/opportunities/new"
            className="btn btn-primary"
          >
            Create opportunity
          </Link>
        </div>
      </section>

      <section className="card dashboard-action-card">
        <div>
          <h3>Review applications</h3>
          <p>
            Review submitted applications and track candidates through
            your recruitment process.
          </p>
        </div>

        <Link
          to="/employer/applications"
          className="btn btn-primary"
        >
          View applications
        </Link>
      </section>
    </div>
  );
}
