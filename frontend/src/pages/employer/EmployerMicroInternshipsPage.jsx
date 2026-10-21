
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { microInternshipService } from "../../services";
import {
  ErrorMessage,
  LoadingSpinner,
  EmptyState,
  SectionHeader,
  StatusBadge,
} from "../../components";

export default function EmployerMicroInternshipsPage() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadInternships();
  }, []);

  async function loadInternships() {
    setLoading(true);
    setError("");

    try {
      const response = await microInternshipService.getMyInternships();

      setInternships(
        Array.isArray(response)
          ? response
          : response?.items ||
              response?.internships ||
              response?.data ||
              []
      );
    } catch (err) {
      setError(
        err?.message ||
          "Unable to load your micro-internships."
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading your micro-internships..." />;
  }

  return (
    <div className="page-container employer-micro-internships-page">
      <SectionHeader
        title="My Micro-Internships"
        subtitle="Manage short-term projects that help candidates gain practical work experience."
        action={
          <Link
            to="/employer/micro-internships/new"
            className="btn btn-primary"
          >
            Create micro-internship
          </Link>
        }
      />

      {error && (
        <ErrorMessage message={error} onRetry={loadInternships} />
      )}

      {internships.length === 0 ? (
        <EmptyState
          title="No micro-internships yet"
          description="Create a short-term project to connect with candidates and give them practical experience."
          action={
            <Link
              to="/employer/micro-internships/new"
              className="btn btn-primary"
            >
              Create micro-internship
            </Link>
          }
        />
      ) : (
        <div className="card-list">
          {internships.map((internship) => {
            const id = internship.id ?? internship.micro_internship_id;

            return (
              <article className="card internship-management-card" key={id}>
                <div className="card-header">
                  <div>
                    <h3>{internship.title || "Untitled project"}</h3>
                    <p className="text-muted">
                      {internship.location || "Location not specified"}
                    </p>
                  </div>

                  <StatusBadge
                    status={
                      internship.status ||
                      (internship.is_active ? "active" : "inactive")
                    }
                  />
                </div>

                <p className="card-description">
                  {internship.description ||
                    "No project description provided."}
                </p>

                <div className="opportunity-meta">
                  {internship.duration && (
                    <span>
                      <strong>Duration:</strong> {internship.duration}
                    </span>
                  )}

                  {internship.category && (
                    <span>
                      <strong>Category:</strong> {internship.category}
                    </span>
                  )}

                  {internship.stipend != null && (
                    <span>
                      <strong>Stipend:</strong> {internship.stipend}
                    </span>
                  )}
                </div>

                <div className="card-actions">
                  <Link
                    to={`/employer/micro-internships/${id}/edit`}
                    className="btn btn-outline"
                  >
                    Edit
                  </Link>

                  <Link
                    to={`/employer/micro-internships/${id}/applications`}
                    className="btn btn-primary"
                  >
                    View applications
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
