export default function LoadingSpinner({
  message = "Loading...",
  size = "medium",
  fullPage = false,
}) {
  const sizeClass = `loading-spinner__circle--${size}`;

  return (
    <div
      className={`loading-spinner${fullPage ? " loading-spinner--full-page" : ""}`}
      role="status"
      aria-live="polite"
    >
      <span
        className={`loading-spinner__circle ${sizeClass}`}
        aria-hidden="true"
      />
      <span className="loading-spinner__message">{message}</span>
    </div>
  );
}