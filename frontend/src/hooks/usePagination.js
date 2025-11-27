// src/hooks/usePagination.js

import { useState, useCallback, useMemo } from "react";

const usePagination = (initialPage = 1, initialPageSize = 10) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalItems, setTotalItems] = useState(0);

  /**
   * Calculate total pages
   */
  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / pageSize);
  }, [totalItems, pageSize]);

  /**
   * Go to specific page
   */
  const goToPage = useCallback(
    (page) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    },
    [totalPages]
  );

  /**
   * Go to next page
   */
  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [currentPage, totalPages]);

  /**
   * Go to previous page
   */
  const previousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentPage]);

  /**
   * Go to first page
   */
  const firstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  /**
   * Go to last page
   */
  const lastPage = useCallback(() => {
    setCurrentPage(totalPages);
  }, [totalPages]);

  /**
   * Change page size
   */
  const changePageSize = useCallback((newSize) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page
  }, []);

  /**
   * Reset pagination
   */
  const reset = useCallback(() => {
    setCurrentPage(initialPage);
    setPageSize(initialPageSize);
    setTotalItems(0);
  }, [initialPage, initialPageSize]);

  /**
   * Get pagination params for API
   */
  const getPaginationParams = useCallback(() => {
    return {
      page: currentPage,
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
    };
  }, [currentPage, pageSize]);

  return {
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    setTotalItems,
    goToPage,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    changePageSize,
    reset,
    getPaginationParams,
  };
};

export default usePagination;
