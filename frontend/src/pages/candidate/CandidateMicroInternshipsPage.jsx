
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { microInternshipService } from "../../services";
import {
  ErrorMessage,
  LoadingSpinner,
  EmptyState,
  SectionHeader,
  StatusBadge,
  SearchBar,
} from "../../components";

export default function CandidateMicroInternshipsPage() {
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadInternships();
  }, []);

  async function loadInternships() {
    setLoading(true);
    setError("");

    try {
      const [internshipResponse, applicationResponse] = await Promise.all([
        microInternshipService.getAll(),
        microInternshipService.getMyApplications(),
      ]);

      setInternships(
        Array.isArray(internshipResponse)
          ? internshipResponse
          : internshipResponse?.items ||
              internshipResponse?.internships ||
              internshipResponse?.data ||
              []
      );

      setApplications(
        Array.isArray(applicationResponse)
          ? applicationResponse
          : applicationResponse?.items ||
              applicationResponse?.applications ||
              applicationResponse?.data ||
              []
      );
    } catch (err) {
      setError(
        err?.message ||
          "Unable to load micro-internships. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleApply(internship) {
    const internshipId = internship.id ?? internship.micro_internship_id;

    if (!internshipId) {
      setError("This micro-internship is missing its ID.");
      return;
    }

    setApplyingId(internshipId);
    setError("");
    setMessage("");

    try {
      await microInternshipService.apply(internshipId);
      setMessage("Your application was submitted successfully.");
      await loadInternships();
    } catch (err) {
      setError(
        err?.message ||
          "Unable to submit your application. Please try again."
      );
    } finally {
      setApplyingId(null);
    }
  }

  function getApplication(internship) {
    const internshipId = internship.id ?? internship.micro_internship_id;

    return applications.find((application) => {
      const appliedId =
        application.micro_internship_id ??
        application.internship_id ??
        application.micro_internship?.id ??
        application.internship?.id;

      return String(appliedId) === String(internshipId);
    });
  }

  const filteredInternships = internships.filter((internship) => {
    const searchText = [
      internship.title,
      internship.description,
      internship.category,
      internship.required_skills,
      internship.location,
      internship.company_name,
      internship.employer?.company_name,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchText.includes(search.trim().toLowerCase());
  });

  if (loading) {
    return <LoadingSpinner message="Loading micro-internships..." />;
  }

  return (
    <div className="page-container candidate-micro-internships-page">
      <SectionHeader
        title="Micro-Internships"
        subtitle="Find short-term projects where you can gain practical experience and develop your skills."
      />

      {error && (
        <ErrorMessage
          message={error}
          onRetry={loadInternships}
        />
      )}

      {message && (
        <div className="alert alert-success" role="status">
          {message}
        </div>
      )}

      <div className="page-toolbar">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search projects, skills or companies..."
        />
      </div>

      {filteredInternships.length === 0 ? (
        <EmptyState
          title="No micro-internships found"
          description={
            search
              ? "Try a different search term."
              : "There are no micro-internships available at the moment. Please check again later."
          }
        />
      ) : (
        <div className="card-grid">
          {filteredInternships.map((internship) => {
            const id = internship.id ?? internship.micro_internship_id;
            const existingApplication = getApplication(internship);
            const status = existingApplication?.status;
            const isApplying = applyingId === id;

            return (
              <article className="card internship-card" key={id}>
                <div className="card-header">
                  <div>
                    <h3>{internship.title || "Micro-Internship"}</h3>
                    <p className="text-muted">
                      {internship.company_name ||
                        internship.employer?.company_name ||
                        "Employer"}
                    </p>
                  </div>

                  {status && <StatusBadge status={status} />}
                </div>

                <p className="card-description">
                  {internship.description ||
                    "No project description has been provided."}
                </p>

                <div className="internship-meta">
                  {internship.category && (
                    <span>
                      <strong>Category:</strong> {internship.category}
                    </span>
                  )}

                  {internship.location && (
                    <span>
                      <strong>Location:</strong> {internship.location}
                    </span>
                  )}

                  {internship.duration && (
                    <span>
                      <strong>Duration:</strong> {internship.duration}
                    </span>
                  )}

                  {internship.stipend != null && (
                    <span>
                      <strong>Stipend:</strong> {internship.stipend}
                    </span>
                  )}
                </div>

                {internship.required_skills && (
                  <p>
                    <strong>Skills:</strong>{" "}
                    {Array.isArray(internship.required_skills)
                      ? internship.required_skills.join(", ")
                      : internship.required_skills}
                  </p>
                )}

                <div className="card-actions">
                  {existingApplication ? (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      disabled
                    >
                      Already applied
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={isApplying}
                      onClick={() => handleApply(internship)}
                    >
                      {isApplying ? "Applying..." : "Apply"}
                    </button>
                  )}

                  {internship.id && (
                    <Link
                      className="btn btn-outline"
                      to={`/micro-internships/${internship.id}`}
                    >
                      View details
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
