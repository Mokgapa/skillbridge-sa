import { Link } from "react-router-dom";

export default function SectionHeader({
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
  eyebrow,
}) {
  return (
    <div className="section-header">
      <div className="section-header__content">
        {eyebrow && (
          <span className="section-header__eyebrow">{eyebrow}</span>
        )}

        <h2 className="section-header__title">{title}</h2>

        {description && (
          <p className="section-header__description">{description}</p>
        )}
      </div>

      {actionLabel && actionTo && (
        <Link to={actionTo} className="section-header__action">
          {actionLabel}
        </Link>
      )}

      {actionLabel && !actionTo && onAction && (
        <button
          type="button"
          className="section-header__action"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}