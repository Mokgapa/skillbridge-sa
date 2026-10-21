import { useCallback, useMemo, useState } from "react";

export default function usePagination(
  totalItems = 0,
  initialPageSize = 10
) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const page = Math.min(currentPage, totalPages);

  const pagination = useMemo(() => {
    const startIndex = (page - 1) * pageSize;

    return {
      currentPage: page,
      pageSize,
      totalItems,
      totalPages,
      startIndex,
      endIndex: Math.min(startIndex + pageSize, totalItems),
      hasPreviousPage: page > 1,
      hasNextPage: page < totalPages,
    };
  }, [page, pageSize, totalItems, totalPages]);

  const goToPage = useCallback(
    (pageNumber) => {
      const nextPage = Number(pageNumber);

      if (!Number.isInteger(nextPage)) return;

      setCurrentPage(Math.min(Math.max(nextPage, 1), totalPages));
    },
    [totalPages]
  );

  const nextPage = useCallback(() => {
    setCurrentPage((previous) => Math.min(previous + 1, totalPages));
  }, [totalPages]);

  const previousPage = useCallback(() => {
    setCurrentPage((previous) => Math.max(previous - 1, 1));
  }, []);

  const changePageSize = useCallback((newSize) => {
    const size = Number(newSize);

    if (!Number.isInteger(size) || size < 1) return;

    setPageSize(size);
    setCurrentPage(1);
  }, []);

  const resetPagination = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    ...pagination,
    goToPage,
    nextPage,
    previousPage,
    changePageSize,
    resetPagination,
  };
}