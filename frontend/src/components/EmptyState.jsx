import { Link } from "react-router-dom";

export default function EmptyState({
  title = "Nothing here yet",
  message = "There is no information to display right now.",
  actionLabel,
  actionTo,
  onAction,
  icon = "◇",
}) {
  return (
    <section className="empty-state" aria-label={title}>
      <div className="empty-state__icon" aria-hidden="true">
        {icon}
      </div>

      <h2>{title}</h2>
      <p>{message}</p>

      {actionLabel && actionTo && (
        <Link to={actionTo} className="button button--primary">
          {actionLabel}
        </Link>
      )}

      {actionLabel && !actionTo && onAction && (
        <button
          type="button"
          className="button button--primary"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </section>
  );
}