/**
 * FedSecure AI - Backend Connection Hook
 * 
 * React hook for monitoring backend server connectivity.
 * Provides real-time status updates with configurable polling interval.
 * 
 * @author FedSecure AI Team
 * @course MCA Cybersecurity Project
 */

import { useState, useEffect, useCallback } from 'react';
import { backendApi, HealthResponse } from '@/services/backendApi';

// ============================================================
// Type Definitions
// ============================================================

export interface BackendConnectionState {
  isOnline: boolean;
  isChecking: boolean;
  lastChecked: Date | null;
  serverInfo: HealthResponse | null;
  errorMessage: string | null;
}

interface UseBackendConnectionOptions {
  // How often to check connection (in milliseconds)
  pollingInterval?: number;
  // Whether to start polling immediately
  autoStart?: boolean;
}

// ============================================================
// Default Configuration
// ============================================================

const DEFAULT_POLLING_INTERVAL = 5000; // 5 seconds as requested

// ============================================================
// Hook Implementation
// ============================================================

export function useBackendConnection(options: UseBackendConnectionOptions = {}) {
  const { 
    pollingInterval = DEFAULT_POLLING_INTERVAL,
    autoStart = true 
  } = options;

  // Connection state management
  const [state, setState] = useState<BackendConnectionState>({
    isOnline: false,
    isChecking: true,
    lastChecked: null,
    serverInfo: null,
    errorMessage: null,
  });

  /**
   * Performs single health check against backend.
   * Updates state based on response or error.
   */
  const checkConnection = useCallback(async () => {
    setState(prev => ({ ...prev, isChecking: true }));

    try {
      const healthData = await backendApi.checkHealth();
      
      // Backend responded successfully
      setState({
        isOnline: true,
        isChecking: false,
        lastChecked: new Date(),
        serverInfo: healthData,
        errorMessage: null,
      });
    } catch (error) {
      // Backend unreachable or returned error
      const message = error instanceof Error 
        ? error.message 
        : 'Unable to reach backend server';

      setState({
        isOnline: false,
        isChecking: false,
        lastChecked: new Date(),
        serverInfo: null,
        errorMessage: message,
      });
    }
  }, []);

  /**
   * Manual refresh function for immediate status check.
   * Can be triggered by user interaction.
   */
  const refreshStatus = useCallback(() => {
    checkConnection();
  }, [checkConnection]);

  // Setup polling on mount
  useEffect(() => {
    if (!autoStart) return;

    // Initial check on mount
    checkConnection();

    // Setup recurring checks
    const intervalId = setInterval(checkConnection, pollingInterval);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, [checkConnection, pollingInterval, autoStart]);

  return {
    ...state,
    refreshStatus,
  };
}

// ============================================================
// Legacy Hook (Backward Compatibility)
// ============================================================

/**
 * Simplified hook matching original usePythonBackend interface.
 * Use useBackendConnection for new implementations.
 */
export function usePythonBackend() {
  const { isOnline, isChecking, errorMessage } = useBackendConnection();

  return {
    connected: isOnline,
    loading: isChecking,
    error: errorMessage,
  };
}
