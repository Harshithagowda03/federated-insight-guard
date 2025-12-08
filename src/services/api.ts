// API service layer for connecting to Flask backend
// Replace BASE_URL with your Flask backend URL

import { supabase } from "@/integrations/supabase/client";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

// Get current user session for authenticated API calls
async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.access_token) {
    throw new Error("Authentication required. Please log in.");
  }
  
  return {
    "Authorization": `Bearer ${session.access_token}`,
  };
}

// Generic API call handler with authentication
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    // Get auth headers - will throw if not authenticated
    const authHeaders = await getAuthHeaders();
    
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
        ...options.headers,
      },
    });

    const data = await response.json();

    return {
      data: response.ok ? data : undefined,
      error: !response.ok ? data.message || "An error occurred" : undefined,
      status: response.status,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Network error",
      status: 0,
    };
  }
}

// Federated Learning APIs
export const federatedLearningApi = {
  // Start training round
  startTraining: () => apiCall("/federated/train", { method: "POST" }),

  // Get training status
  getStatus: () => apiCall("/federated/status", { method: "GET" }),

  // Get node information
  getNodes: () => apiCall("/federated/nodes", { method: "GET" }),

  // Pause training
  pauseTraining: () => apiCall("/federated/pause", { method: "POST" }),
};

// Threat Analytics APIs
export const threatAnalyticsApi = {
  // Get threat timeline
  getThreatTimeline: (hours = 24) =>
    apiCall(`/threats/timeline?hours=${hours}`, { method: "GET" }),

  // Get threat distribution
  getThreatDistribution: () =>
    apiCall("/threats/distribution", { method: "GET" }),

  // Get top threat types
  getTopThreats: () => apiCall("/threats/top", { method: "GET" }),

  // Get recent threats
  getRecentThreats: (limit = 10) =>
    apiCall(`/threats/recent?limit=${limit}`, { method: "GET" }),
};

// Attack Simulator APIs
export const attackSimulatorApi = {
  // Run attack simulation
  runSimulation: (attackType: string, intensity: number) =>
    apiCall("/simulator/run", {
      method: "POST",
      body: JSON.stringify({ attackType, intensity }),
    }),

  // Get simulation results
  getResults: (simulationId: string) =>
    apiCall(`/simulator/results/${simulationId}`, { method: "GET" }),

  // Get available attack types
  getAttackTypes: () => apiCall("/simulator/attack-types", { method: "GET" }),
};

// Data Upload APIs
export const dataUploadApi = {
  // Upload training data
  uploadData: async (file: File) => {
    try {
      // Get auth headers first
      const authHeaders = await getAuthHeaders();
      
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${BASE_URL}/data/upload`, {
        method: "POST",
        headers: authHeaders,
        body: formData,
      });

      const data = await response.json();

      return {
        data: response.ok ? data : undefined,
        error: !response.ok ? data.message || "Upload failed" : undefined,
        status: response.status,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Network error",
        status: 0,
      };
    }
  },

  // Get upload status
  getUploadStatus: (uploadId: string) =>
    apiCall(`/data/upload/${uploadId}`, { method: "GET" }),

  // Get processed data stats
  getDataStats: () => apiCall("/data/stats", { method: "GET" }),
};

// Performance Metrics APIs
export const performanceMetricsApi = {
  // Get accuracy metrics
  getAccuracyMetrics: () => apiCall("/metrics/accuracy", { method: "GET" }),

  // Get loss metrics
  getLossMetrics: () => apiCall("/metrics/loss", { method: "GET" }),

  // Get classification metrics
  getClassificationMetrics: () =>
    apiCall("/metrics/classification", { method: "GET" }),

  // Get model comparison
  getModelComparison: () => apiCall("/metrics/comparison", { method: "GET" }),
};

// Dashboard Overview APIs
export const dashboardApi = {
  // Get dashboard stats
  getStats: () => apiCall("/dashboard/stats", { method: "GET" }),

  // Get system status
  getSystemStatus: () => apiCall("/dashboard/status", { method: "GET" }),
};

export default {
  federatedLearningApi,
  threatAnalyticsApi,
  attackSimulatorApi,
  dataUploadApi,
  performanceMetricsApi,
  dashboardApi,
};
