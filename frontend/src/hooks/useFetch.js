// src/hooks/useFetch.js

import { useState, useEffect, useCallback } from "react";

const useFetch = (fetchFunction, params = {}, options = {}) => {
  const { immediate = true, onSuccess, onError } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  /**
   * Execute fetch
   */
  const execute = useCallback(
    async (executeParams = {}) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetchFunction({
          ...params,
          ...executeParams,
        });

        if (response.success) {
          setData(response.data);
          if (onSuccess) {
            onSuccess(response.data);
          }
          return { success: true, data: response.data };
        } else {
          throw new Error(response.message || "Request failed");
        }
      } catch (err) {
        setError(err);
        if (onError) {
          onError(err);
        }
        return { success: false, error: err };
      } finally {
        setLoading(false);
      }
    },
    [fetchFunction, params, onSuccess, onError]
  );

  /**
   * Refresh data
   */
  const refresh = useCallback(() => {
    return execute();
  }, [execute]);

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  // Execute on mount if immediate is true
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate]); // Only run on mount

  return {
    data,
    loading,
    error,
    execute,
    refresh,
    reset,
  };
};

export default useFetch;
