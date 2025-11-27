// src/hooks/useFilter.js

import { useState, useCallback, useMemo } from "react";

const useFilter = (initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters);

  /**
   * Update single filter
   */
  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  /**
   * Update multiple filters
   */
  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  /**
   * Remove filter
   */
  const removeFilter = useCallback((key) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  /**
   * Clear all filters
   */
  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  /**
   * Reset to initial filters
   */
  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  /**
   * Check if filters are active
   */
  const hasActiveFilters = useMemo(() => {
    return Object.keys(filters).some((key) => {
      const value = filters[key];
      return value !== null && value !== undefined && value !== "";
    });
  }, [filters]);

  /**
   * Get active filters (non-empty values)
   */
  const activeFilters = useMemo(() => {
    return Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        acc[key] = value;
      }
      return acc;
    }, {});
  }, [filters]);

  /**
   * Get filter params for API
   */
  const getFilterParams = useCallback(() => {
    return activeFilters;
  }, [activeFilters]);

  return {
    filters,
    updateFilter,
    updateFilters,
    removeFilter,
    clearFilters,
    resetFilters,
    hasActiveFilters,
    activeFilters,
    getFilterParams,
  };
};

export default useFilter;
