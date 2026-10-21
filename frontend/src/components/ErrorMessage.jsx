export default function ErrorMessage({
  message = "Something went wrong. Please try again.",
  onRetry,
  title = "Unable to complete your request",
}) {
  return (
    <div className="error-message" role="alert">
      <div className="error-message__icon" aria-hidden="true">
        !
      </div>

      <div className="error-message__content">
        <h3>{title}</h3>
        <p>{message}</p>

        {onRetry && (
          <button
            type="button"
            className="button button--secondary"
            onClick={onRetry}
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}