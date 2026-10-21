
import { Link } from "react-router-dom";
import { formatDate } from "../utils/formatters";
import StatusBadge from "./StatusBadge";

export default function ApplicationCard({ application }) {
  if (!application) return null;

  const {
    id,
    application_id,
    opportunity_id,
    opportunity,
    opportunity_title,
    company_name,
    employer_name,
    status,
    applied_at,
    created_at,
    updated_at,
  } = application;

  const applicationId = application_id ?? id;
  const opportunityId = opportunity_id ?? opportunity?.id;
  const title =
    opportunity_title ?? opportunity?.title ?? "Opportunity";
  const company =
    company_name ?? employer_name ?? opportunity?.company_name ?? "Employer";
  const appliedDate = applied_at ?? created_at;

  return (
    <article className="application-card">
      <div className="application-card__main">
        <div className="application-card__content">
          <h3 className="application-card__title">{title}</h3>
          <p className="application-card__company">{company}</p>

          {appliedDate && (
            <p className="application-card__date">
              Applied on {formatDate(appliedDate)}
            </p>
          )}

          {updated_at && updated_at !== appliedDate && (
            <p className="application-card__date">
              Last updated: {formatDate(updated_at)}
            </p>
          )}
        </div>

        <div className="application-card__status">
          <StatusBadge status={status ?? "pending"} />
        </div>
      </div>

      <div className="application-card__footer">
        {opportunityId != null && (
          <Link
            className="button button--secondary"
            to={`/opportunities/${opportunityId}`}
          >
            View opportunity
          </Link>
        )}

        {applicationId != null && (
          <Link
            className="button button--secondary"
            to={`/candidate/applications/${applicationId}`}
          >
            Application details
          </Link>
        )}
      </div>
    </article>
  );
}
