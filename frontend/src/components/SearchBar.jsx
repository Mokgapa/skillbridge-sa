export default function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Search opportunities, skills, or careers...",
  buttonLabel = "Search",
  disabled = false,
}) {
  function handleSubmit(event) {
    event.preventDefault();
    onSearch?.(value?.trim() || "");
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit} role="search">
      <label className="search-bar__input-wrapper">
        <span className="search-bar__icon" aria-hidden="true">
          ⌕
        </span>

        <input
          type="search"
          className="search-bar__input"
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          placeholder={placeholder}
          aria-label="Search"
          disabled={disabled}
        />
      </label>

      <button
        type="submit"
        className="button button--primary search-bar__button"
        disabled={disabled}
      >
        {buttonLabel}
      </button>
    </form>
  );
}