import { useCallback, useEffect, useState } from "react";

export default function useApi(apiFunction, options = {}) {
  const { immediate = true, initialData = null } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiFunction(...args);
        setData(result);
        return result;
      } catch (err) {
        setError(err?.message || "Something went wrong.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction]
  );

  useEffect(() => {
    if (!immediate) return undefined;

    let active = true;

    async function loadData() {
      setLoading(true);
      setError(null);

      try {
        const result = await apiFunction();

        if (active) {
          setData(result);
        }
      } catch (err) {
        if (active) {
          setError(err?.message || "Something went wrong.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, [apiFunction, immediate]);

  const reset = useCallback(() => {
    setData(initialData);
    setError(null);
    setLoading(false);
  }, [initialData]);

  return { data, loading, error, execute, reset, setData };
}