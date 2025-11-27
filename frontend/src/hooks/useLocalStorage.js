// src/hooks/useLocalStorage.js

import { useState, useEffect, useCallback } from "react";

const useLocalStorage = (key, initialValue) => {
  /**
   * Get initial value from localStorage
   */
  const getInitialValue = () => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState(getInitialValue);

  /**
   * Update localStorage and state
   */
  const setValue = useCallback(
    (value) => {
      try {
        // Allow value to be a function
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        // Save to state
        setStoredValue(valueToStore);

        // Save to localStorage
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  /**
   * Remove from localStorage
   */
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  /**
   * Listen to storage changes from other tabs/windows
   */
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(
            `Error parsing storage change for key "${key}":`,
            error
          );
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue];
};

export default useLocalStorage;
