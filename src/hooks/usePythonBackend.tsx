import { useState, useEffect } from 'react';
import { pythonApi } from '@/services/pythonApi';

export interface BackendStatus {
  connected: boolean;
  loading: boolean;
  error: string | null;
}

export const usePythonBackend = () => {
  const [status, setStatus] = useState<BackendStatus>({
    connected: false,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const checkHealth = async () => {
      try {
        await pythonApi.healthCheck();
        setStatus({ connected: true, loading: false, error: null });
      } catch (error) {
        setStatus({
          connected: false,
          loading: false,
          error: error instanceof Error ? error.message : 'Backend unavailable',
        });
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30s

    return () => clearInterval(interval);
  }, []);

  return status;
};
