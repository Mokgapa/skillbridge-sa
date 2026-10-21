
export default function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  hint,
  required = false,
  disabled = false,
  options = [],
  rows = 4,
  autoComplete,
  min,
  max,
  maxLength,
}) {
  const fieldId = `field-${name}`;
  const errorId = `${fieldId}-error`;
  const hintId = `${fieldId}-hint`;

  const describedBy = [
    error ? errorId : null,
    hint ? hintId : null,
  ]
    .filter(Boolean)
    .join(" ") || undefined;

  const commonProps = {
    id: fieldId,
    name,
    value: value ?? "",
    onChange,
    required,
    disabled,
    "aria-invalid": Boolean(error),
    "aria-describedby": describedBy,
  };

  function renderControl() {
    if (type === "textarea") {
      return (
        <textarea
          {...commonProps}
          className="form-field__control form-field__textarea"
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
        />
      );
    }

    if (type === "select") {
      return (
        <select {...commonProps} className="form-field__control">
          <option value="">Select an option</option>
          {options.map((option) => {
            const optionValue =
              typeof option === "string" ? option : option.value;
            const optionLabel =
              typeof option === "string" ? option : option.label;

            return (
              <option key={optionValue} value={optionValue}>
                {optionLabel}
              </option>
            );
          })}
        </select>
      );
    }

    return (
      <input
        {...commonProps}
        className="form-field__control"
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        min={min}
        max={max}
        maxLength={maxLength}
      />
    );
  }

  return (
    <div className={`form-field${error ? " form-field--error" : ""}`}>
      {label && (
        <label className="form-field__label" htmlFor={fieldId}>
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </label>
      )}

      {renderControl()}

      {hint && (
        <p className="form-field__hint" id={hintId}>
          {hint}
        </p>
      )}

      {error && (
        <p className="form-field__error" id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
