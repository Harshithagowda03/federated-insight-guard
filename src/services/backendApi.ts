/**
 * FedSecure AI - Backend API Service
 * 
 * Provides communication layer between React frontend and Flask backend.
 * Handles all HTTP requests with proper error handling and type safety.
 * 
 * @author FedSecure AI Team
 * @course MCA Cybersecurity Project
 */

// Backend API URL - use VITE_API_URL environment variable
// Falls back to localhost:5000 where Flask server runs
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Log for debugging connection issues
console.log('[FedSecure] Backend API configured at:', API_BASE_URL);

// ============================================================
// Type Definitions
// ============================================================

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
  timestamp: string;
}

export interface SystemMetrics {
  global_accuracy: number;
  global_loss: number;
  total_samples: number;
  active_nodes: number;
  threats_detected: number;
  threats_blocked: number;
  detection_rate: number;
  last_updated: string;
}

export interface ThreatEntry {
  threat_id: string;
  attack_type: string;
  attack_label: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source_ip: string;
  target_ip: string;
  confidence: number;
  detected_at: string;
  status: 'detected' | 'mitigated' | 'investigating';
}

export interface ThreatListResponse {
  threats: ThreatEntry[];
  total_count: number;
  severity_distribution: Record<string, number>;
  query_timestamp: string;
}

export interface FederatedNode {
  node_id: string;
  name: string;
  location: string;
  samples: number;
  accuracy: number;
  status: 'online' | 'offline' | 'training';
  last_update: string;
}

export interface TrainingState {
  is_running: boolean;
  current_round: number;
  max_rounds: number;
  global_accuracy: number;
  global_loss: number;
  started_at: string | null;
  last_aggregation: string | null;
}

export interface FederatedStatusResponse {
  training: TrainingState;
  nodes: FederatedNode[];
  total_samples: number;
  timestamp: string;
}

// ============================================================
// API Service Class
// ============================================================

class BackendApiService {
  private baseUrl: string;
  
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Makes HTTP request to backend with error handling.
   * Automatically includes auth token for protected endpoints.
   */
  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {},
    requireAuth: boolean = false
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Build headers with optional auth token
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Add auth token if required or available
    if (requireAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Request failed: ${response.status} - ${errorBody}`);
    }

    return response.json();
  }

  /**
   * Gets auth token from localStorage.
   * Used for protected API endpoints.
   */
  private getAuthToken(): string | null {
    try {
      return localStorage.getItem('fedsecure_auth_token');
    } catch {
      return null;
    }
  }

  /**
   * Checks if backend server is running and accessible.
   * Uses /api/health for detailed status info.
   */
  async checkHealth(): Promise<HealthResponse> {
    const url = `${this.baseUrl}/api/health`;
    console.log('[FedSecure] Health check request:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('[FedSecure] Health check response:', data);
    return data;
  }

  /**
   * Retrieves aggregated system metrics including accuracy,
   * threat counts, and node statistics.
   * Requires authentication.
   */
  async getMetrics(): Promise<SystemMetrics> {
    return this.makeRequest<SystemMetrics>('/api/metrics', {}, true);
  }

  /**
   * Fetches list of recently detected threats.
   * Requires authentication.
   */
  async getThreats(limit: number = 10): Promise<ThreatListResponse> {
    return this.makeRequest<ThreatListResponse>(`/api/threats?limit=${limit}`, {}, true);
  }

  /**
   * Gets current federated learning training status.
   * Requires authentication.
   */
  async getFederatedStatus(): Promise<FederatedStatusResponse> {
    return this.makeRequest<FederatedStatusResponse>('/api/federated/status', {}, true);
  }

  /**
   * Retrieves list of all federated learning nodes.
   * Requires authentication.
   */
  async getNodes(): Promise<{ nodes: FederatedNode[]; online_count: number; total_count: number }> {
    return this.makeRequest('/api/federated/nodes', {}, true);
  }

  /**
   * Initiates a new federated learning training session.
   * Requires authentication.
   */
  async startTraining(maxRounds: number = 10): Promise<{ success: boolean; message: string; session?: TrainingState }> {
    return this.makeRequest('/api/federated/start', {
      method: 'POST',
      body: JSON.stringify({ max_rounds: maxRounds }),
    }, true);
  }

  /**
   * Stops the current federated learning session.
   * Requires authentication.
   */
  async stopTraining(): Promise<{ success: boolean; message: string; final_accuracy?: number }> {
    return this.makeRequest('/api/federated/stop', {
      method: 'POST',
    }, true);
  }
}

// Export singleton instance for use throughout application
export const backendApi = new BackendApiService(API_BASE_URL);

// Also export class for testing purposes
export { BackendApiService };
