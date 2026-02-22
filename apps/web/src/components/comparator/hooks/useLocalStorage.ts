'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'insurance-comparator-draft';

export function useLocalStorage<T>(defaultValue: T) {
  const [data, setData] = useState<T>(defaultValue);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setData(JSON.parse(stored));
      }
    } catch {
      // Ignore parse errors
    }
    setLoaded(true);
  }, []);

  const save = useCallback((value: T) => {
    setData(value);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {
      // Ignore storage errors
    }
  }, []);

  const clear = useCallback(() => {
    setData(defaultValue);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  }, [defaultValue]);

  return { data, save, clear, loaded };
}
