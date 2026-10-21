const STATUS_STYLES = {
  pending: "warning",
  reviewing: "info",
  shortlisted: "success",
  interview: "info",
  accepted: "success",
  rejected: "danger",
  withdrawn: "neutral",
  published: "success",
  draft: "neutral",
  closed: "danger",
  archived: "neutral",
  active: "success",
  inactive: "neutral",
  completed: "success",
  cancelled: "danger",
};

function formatLabel(status) {
  if (!status) return "Unknown";

  return String(status)
    .replace(/[_-]+/g, " ")
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export default function StatusBadge({ status, variant }) {
  const normalizedStatus = String(status || "unknown")
    .toLowerCase()
    .replace(/\s+/g, "_");

  const style = variant || STATUS_STYLES[normalizedStatus] || "neutral";

  return (
    <span
      className={`status-badge status-badge--${style}`}
      title={formatLabel(status)}
    >
      <span className="status-badge__dot" aria-hidden="true" />
      {formatLabel(status)}
    </span>
  );
}