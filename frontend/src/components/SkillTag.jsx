export default function SkillTag({
  skill,
  variant = "default",
  onRemove,
}) {
  const label =
    typeof skill === "string"
      ? skill
      : skill?.name || skill?.skill_name || "Unknown skill";

  return (
    <span className={`skill-tag skill-tag--${variant}`}>
      <span className="skill-tag__label">{label}</span>

      {onRemove && (
        <button
          type="button"
          className="skill-tag__remove"
          onClick={() => onRemove(skill)}
          aria-label={`Remove ${label}`}
          title={`Remove ${label}`}
        >
          ×
        </button>
      )}
    </span>
  );
}