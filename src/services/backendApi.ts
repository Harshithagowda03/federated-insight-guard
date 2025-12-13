/**
 * FedSecure AI - Backend API Service
 * 
 * Provides communication layer between React frontend and Flask backend.
 * Handles all HTTP requests with proper error handling and type safety.
 * 
 * @author FedSecure AI Team
 * @course MCA Cybersecurity Project
 */

// Base URL from environment variable, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_PYTHON_API_URL || 'http://localhost:8000';

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
   * Generic method used by all specific endpoint methods.
   */
  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Request failed: ${response.status} - ${errorBody}`);
    }

    return response.json();
  }

  /**
   * Checks if backend server is running and accessible.
   * Used for connection status indicator in UI.
   */
  async checkHealth(): Promise<HealthResponse> {
    return this.makeRequest<HealthResponse>('/health');
  }

  /**
   * Retrieves aggregated system metrics including accuracy,
   * threat counts, and node statistics.
   */
  async getMetrics(): Promise<SystemMetrics> {
    return this.makeRequest<SystemMetrics>('/api/metrics');
  }

  /**
   * Fetches list of recently detected threats.
   * Supports pagination through limit parameter.
   */
  async getThreats(limit: number = 10): Promise<ThreatListResponse> {
    return this.makeRequest<ThreatListResponse>(`/api/threats?limit=${limit}`);
  }

  /**
   * Gets current federated learning training status
   * including node information and progress.
   */
  async getFederatedStatus(): Promise<FederatedStatusResponse> {
    return this.makeRequest<FederatedStatusResponse>('/api/federated/status');
  }

  /**
   * Retrieves list of all federated learning nodes.
   */
  async getNodes(): Promise<{ nodes: FederatedNode[]; online_count: number; total_count: number }> {
    return this.makeRequest('/api/federated/nodes');
  }

  /**
   * Initiates a new federated learning training session.
   */
  async startTraining(maxRounds: number = 10): Promise<{ success: boolean; message: string; session?: TrainingState }> {
    return this.makeRequest('/api/federated/start', {
      method: 'POST',
      body: JSON.stringify({ max_rounds: maxRounds }),
    });
  }

  /**
   * Stops the current federated learning session.
   */
  async stopTraining(): Promise<{ success: boolean; message: string; final_accuracy?: number }> {
    return this.makeRequest('/api/federated/stop', {
      method: 'POST',
    });
  }
}

// Export singleton instance for use throughout application
export const backendApi = new BackendApiService(API_BASE_URL);

// Also export class for testing purposes
export { BackendApiService };
