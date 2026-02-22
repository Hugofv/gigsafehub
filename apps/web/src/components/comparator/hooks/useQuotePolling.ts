'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { QuotePollResponse } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const POLL_INTERVAL = 2000;
const MAX_POLL_TIME = 30000;

export function useQuotePolling(leadId: string | null) {
  const [data, setData] = useState<QuotePollResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const startTime = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const poll = useCallback(async () => {
    if (!leadId) return;

    try {
      const res = await fetch(`${API_URL}/api/leads/${leadId}/quotes`);
      if (!res.ok) throw new Error('Failed to fetch quotes');
      const result: QuotePollResponse = await res.json();
      setData(result);

      if (result.allResolved || Date.now() - startTime.current > MAX_POLL_TIME) {
        setIsPolling(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch quotes');
      setIsPolling(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [leadId]);

  useEffect(() => {
    if (!leadId) return;

    setIsPolling(true);
    setError(null);
    startTime.current = Date.now();

    poll();
    intervalRef.current = setInterval(poll, POLL_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [leadId, poll]);

  return { data, error, isPolling };
}
