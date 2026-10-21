
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { opportunityService } from "../../services";
import {
  ErrorMessage,
  LoadingSpinner,
  EmptyState,
  SectionHeader,
  StatusBadge,
  ConfirmDialog,
} from "../../components";

export default function EmployerOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  useEffect(() => {
    loadOpportunities();
  }, []);

  async function loadOpportunities() {
    setLoading(true);
    setError("");

    try {
      const response = await opportunityService.getMyOpportunities();

      setOpportunities(
        Array.isArray(response)
          ? response
          : response?.items ||
              response?.opportunities ||
              response?.data ||
              []
      );
    } catch (err) {
      setError(
        err?.message || "Unable to load your opportunities."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!selectedOpportunity) return;

    const id =
      selectedOpportunity.id ??
      selectedOpportunity.opportunity_id;

    if (!id) {
      setError("This opportunity is missing its ID.");
      setSelectedOpportunity(null);
      return;
    }

    setDeletingId(id);
    setError("");

    try {
      await opportunityService.delete(id);
      setOpportunities((current) =>
        current.filter(
          (opportunity) =>
            String(opportunity.id ?? opportunity.opportunity_id) !==
            String(id)
        )
      );
      setSelectedOpportunity(null);
    } catch (err) {
      setError(
        err?.message || "Unable to delete this opportunity."
      );
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading your opportunities..." />;
  }

  return (
    <div className="page-container employer-opportunities-page">
      <SectionHeader
        title="My Opportunities"
        subtitle="Create and manage the opportunities your organisation offers."
        action={
          <Link
            to="/employer/opportunities/new"
            className="btn btn-primary"
          >
            Create opportunity
          </Link>
        }
      />

      {error && (
        <ErrorMessage message={error} onRetry={loadOpportunities} />
      )}

      {opportunities.length === 0 ? (
        <EmptyState
          title="No opportunities yet"
          description="Create your first opportunity to start connecting with candidates."
          action={
            <Link
              to="/employer/opportunities/new"
              className="btn btn-primary"
            >
              Create opportunity
            </Link>
          }
        />
      ) : (
        <div className="card-list">
          {opportunities.map((opportunity) => {
            const id = opportunity.id ?? opportunity.opportunity_id;

            return (
              <article className="card opportunity-management-card" key={id}>
                <div className="card-header">
                  <div>
                    <h3>{opportunity.title || "Untitled opportunity"}</h3>
                    <p className="text-muted">
                      {opportunity.location || "Location not specified"}
                    </p>
                  </div>

                  <StatusBadge
                    status={
                      opportunity.status ||
                      (opportunity.is_active ? "active" : "inactive")
                    }
                  />
                </div>

                <p className="card-description">
                  {opportunity.description ||
                    "No description provided."}
                </p>

                <div className="opportunity-meta">
                  {opportunity.employment_type && (
                    <span>
                      <strong>Type:</strong>{" "}
                      {opportunity.employment_type}
                    </span>
                  )}

                  {opportunity.workplace_type && (
                    <span>
                      <strong>Workplace:</strong>{" "}
                      {opportunity.workplace_type}
                    </span>
                  )}

                  {opportunity.created_at && (
                    <span>
                      <strong>Created:</strong>{" "}
                      {new Date(opportunity.created_at).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <div className="card-actions">
                  <Link
                    to={`/employer/opportunities/${id}/edit`}
                    className="btn btn-outline"
                  >
                    Edit
                  </Link>

                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => setSelectedOpportunity(opportunity)}
                    disabled={deletingId === id}
                  >
                    Delete
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {selectedOpportunity && (
        <ConfirmDialog
          title="Delete opportunity?"
          message={`Are you sure you want to delete "${selectedOpportunity.title || "this opportunity"}"? This action may not be reversible.`}
          confirmText={deletingId ? "Deleting..." : "Delete"}
          cancelText="Cancel"
          isLoading={Boolean(deletingId)}
          onConfirm={handleDelete}
          onCancel={() => {
            if (!deletingId) setSelectedOpportunity(null);
          }}
        />
      )}
    </div>
  );
}
