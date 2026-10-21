export default function ProgressBar({
  value = 0,
  max = 100,
  label,
  showPercentage = true,
  size = "medium",
}) {
  const numericValue = Number(value);
  const numericMax = Number(max);

  const safeMax =
    Number.isFinite(numericMax) && numericMax > 0 ? numericMax : 100;

  const safeValue = Number.isFinite(numericValue) ? numericValue : 0;
  const percentage = Math.min(
    100,
    Math.max(0, (safeValue / safeMax) * 100)
  );

  const displayPercentage = Math.round(percentage);

  return (
    <div className={`progress-bar progress-bar--${size}`}>
      {(label || showPercentage) && (
        <div className="progress-bar__header">
          {label && <span className="progress-bar__label">{label}</span>}

          {showPercentage && (
            <span className="progress-bar__percentage">
              {displayPercentage}%
            </span>
          )}
        </div>
      )}

      <div
        className="progress-bar__track"
        role="progressbar"
        aria-label={label || "Progress"}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={displayPercentage}
      >
        <div
          className="progress-bar__fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}