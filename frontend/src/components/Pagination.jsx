export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}) {
  const total = Math.max(1, Number(totalPages) || 1);
  const current = Math.min(
    total,
    Math.max(1, Number(currentPage) || 1)
  );

  if (total <= 1) return null;

  const rangeStart = Math.max(1, current - siblingCount);
  const rangeEnd = Math.min(total, current + siblingCount);

  const pages = [];

  for (let page = rangeStart; page <= rangeEnd; page += 1) {
    pages.push(page);
  }

  function goToPage(page) {
    if (page >= 1 && page <= total && page !== current) {
      onPageChange?.(page);
    }
  }

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        type="button"
        className="pagination__button"
        onClick={() => goToPage(current - 1)}
        disabled={current === 1}
        aria-label="Go to previous page"
      >
        Previous
      </button>

      {rangeStart > 1 && (
        <>
          <button
            type="button"
            className="pagination__button"
            onClick={() => goToPage(1)}
          >
            1
          </button>

          {rangeStart > 2 && (
            <span className="pagination__ellipsis" aria-hidden="true">
              …
            </span>
          )}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          className={`pagination__button${page === current ? " pagination__button--active" : ""}`}
          onClick={() => goToPage(page)}
          aria-current={page === current ? "page" : undefined}
          aria-label={`Go to page ${page}`}
        >
          {page}
        </button>
      ))}

      {rangeEnd < total && (
        <>
          {rangeEnd < total - 1 && (
            <span className="pagination__ellipsis" aria-hidden="true">
              …
            </span>
          )}

          <button
            type="button"
            className="pagination__button"
            onClick={() => goToPage(total)}
          >
            {total}
          </button>
        </>
      )}

      <button
        type="button"
        className="pagination__button"
        onClick={() => goToPage(current + 1)}
        disabled={current === total}
        aria-label="Go to next page"
      >
        Next
      </button>
    </nav>
  );
}