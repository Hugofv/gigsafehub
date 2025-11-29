'use client';

import { useState, useEffect } from 'react';

interface NetworkStatus {
  isOnline: boolean;
  effectiveType: string | null;
  downlink: number | null;
  saveData: boolean;
  isSlowConnection: boolean;
}

export function useNetworkStatus(): NetworkStatus {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    effectiveType: null,
    downlink: null,
    saveData: false,
    isSlowConnection: false,
  });

  useEffect(() => {
    if (typeof navigator === 'undefined') return;

    const updateNetworkStatus = () => {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

      const effectiveType = connection?.effectiveType || null;
      const downlink = connection?.downlink || null;
      const saveData = connection?.saveData || false;

      // Consider slow if 2g or slow-2g, or downlink < 1.5 Mbps
      const isSlowConnection =
        effectiveType === '2g' ||
        effectiveType === 'slow-2g' ||
        (downlink !== null && downlink < 1.5);

      setNetworkStatus({
        isOnline: navigator.onLine,
        effectiveType,
        downlink,
        saveData,
        isSlowConnection,
      });
    };

    updateNetworkStatus();

    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', updateNetworkStatus);
    }

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
      if (connection) {
        connection.removeEventListener('change', updateNetworkStatus);
      }
    };
  }, []);

  return networkStatus;
}

