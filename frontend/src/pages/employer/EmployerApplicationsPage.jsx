
import { useEffect, useState } from "react";
import { applicationService } from "../../services";
import {
  ErrorMessage,
  LoadingSpinner,
  EmptyState,
  SectionHeader,
  StatusBadge,
  SearchBar,
} from "../../components";

const APPLICATION_STATUSES = [
  "all",
  "pending",
  "submitted",
  "under_review",
  "shortlisted",
  "accepted",
  "rejected",
];

export default function EmployerApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    setLoading(true);
    setError("");

    try {
      const response =
        await applicationService.getEmployerApplications();

      setApplications(
        Array.isArray(response)
          ? response
          : response?.items ||
              response?.applications ||
              response?.data ||
              []
      );
    } catch (err) {
      setError(
        err?.message || "Unable to load employer applications."
      );
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(application, status) {
    const id = application.id ?? application.application_id;

    if (!id) {
      setError("This application is missing its ID.");
      return;
    }

    setUpdatingId(id);
    setError("");

    try {
      await applicationService.updateStatus(id, status);

      setApplications((current) =>
        current.map((item) =>
          String(item.id ?? item.application_id) === String(id)
            ? { ...item, status }
            : item
        )
      );
    } catch (err) {
      setError(
        err?.message || "Unable to update the application status."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  const filteredApplications = applications.filter((application) => {
    const status = String(application.status || "").toLowerCase();

    const matchesStatus =
      statusFilter === "all" || status === statusFilter;

    const candidate =
      application.candidate ||
      application.applicant ||
      application.user ||
      {};

    const searchableText = [
      candidate.full_name,
      candidate.name,
      candidate.email,
      application.candidate_name,
      application.applicant_name,
      application.opportunity?.title,
      application.opportunity_title,
      application.cover_letter,
      application.status,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return (
      matchesStatus &&
      searchableText.includes(search.trim().toLowerCase())
    );
  });

  if (loading) {
    return <LoadingSpinner message="Loading applications..." />;
  }

  return (
    <div className="page-container employer-applications-page">
      <SectionHeader
        title="Candidate Applications"
        subtitle="Review applications and update candidate progress."
      />

      {error && (
        <ErrorMessage message={error} onRetry={loadApplications} />
      )}

      <div className="page-toolbar">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search candidates or opportunities..."
        />

        <div className="form-field status-filter">
          <label htmlFor="application-status-filter">
            Filter by status
          </label>

          <select
            id="application-status-filter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            {APPLICATION_STATUSES.map((status) => (
              <option value={status} key={status}>
                {status === "all"
                  ? "All statuses"
                  : status.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredApplications.length === 0 ? (
        <EmptyState
          title="No applications found"
          description={
            applications.length === 0
              ? "Applications for your opportunities will appear here."
              : "Try changing your search or status filter."
          }
        />
      ) : (
        <div className="card-list">
          {filteredApplications.map((application) => {
            const id = application.id ?? application.application_id;
            const candidate =
              application.candidate ||
              application.applicant ||
              application.user ||
              {};

            const candidateName =
              candidate.full_name ||
              candidate.name ||
              application.candidate_name ||
              application.applicant_name ||
              "Candidate";

            const opportunityTitle =
              application.opportunity?.title ||
              application.opportunity_title ||
              "Opportunity";

            const currentStatus = String(
              application.status || "pending"
            ).toLowerCase();

            return (
              <article className="card application-review-card" key={id}>
                <div className="card-header">
                  <div>
                    <h3>{candidateName}</h3>
                    <p className="text-muted">{opportunityTitle}</p>
                    {candidate.email && <p>{candidate.email}</p>}
                  </div>

                  <StatusBadge status={currentStatus} />
                </div>

                {application.cover_letter && (
                  <div className="application-cover-letter">
                    <h4>Cover letter</h4>
                    <p>{application.cover_letter}</p>
                  </div>
                )}

                {application.created_at && (
                  <p className="text-muted">
                    Applied on{" "}
                    {new Date(
                      application.created_at
                    ).toLocaleDateString()}
                  </p>
                )}

                <div className="form-field application-status-control">
                  <label htmlFor={`status-${id}`}>
                    Update application status
                  </label>

                  <select
                    id={`status-${id}`}
                    value={currentStatus}
                    disabled={updatingId === id}
                    onChange={(event) =>
                      updateStatus(application, event.target.value)
                    }
                  >
                    {APPLICATION_STATUSES.filter(
                      (status) => status !== "all"
                    ).map((status) => (
                      <option value={status} key={status}>
                        {status.replaceAll("_", " ")}
                      </option>
                    ))}
                  </select>

                  {updatingId === id && (
                    <small>Updating status...</small>
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
