// Python FastAPI Backend Integration
const PYTHON_API_URL = import.meta.env.VITE_PYTHON_API_URL || 'http://localhost:8000';

export interface TrainingRequest {
  participant_ids: string[];
  max_rounds: number;
  target_accuracy: number;
}

export interface TrainingResponse {
  status: string;
  message: string;
  round_id: string;
}

export interface TrainingStatus {
  round_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  current_round: number;
  max_rounds: number;
  accuracy: number;
  loss: number;
  participants: number;
  elapsed_time: number;
}

export interface ModelUpdate {
  model_weights: Record<string, number[]>;
  samples_count: number;
  loss: number;
  accuracy: number;
}

class PythonAPIService {
  private token: string | null = null;
  private baseUrl: string;

  constructor() {
    this.baseUrl = PYTHON_API_URL;
    // Token is now managed in-memory only, not persisted to localStorage
    this.token = null;
  }

  private getHeaders(includeAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Authentication
  async login(email: string, password: string): Promise<{ access_token: string; token_type: string }> {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await fetch(`${this.baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    // Store token in memory only - not in localStorage to prevent XSS access
    this.token = data.access_token;
    return data;
  }

  async register(email: string, password: string, full_name: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/v1/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify({ email, password, full_name }),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    return response.json();
  }

  logout() {
    // Clear in-memory token only
    this.token = null;
  }

  // Training endpoints
  async startTraining(request: TrainingRequest): Promise<TrainingResponse> {
    const response = await fetch(`${this.baseUrl}/api/v1/training/start`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to start training');
    }

    return response.json();
  }

  async getTrainingStatus(roundId: string): Promise<TrainingStatus> {
    const response = await fetch(`${this.baseUrl}/api/v1/training/status/${roundId}`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch training status');
    }

    return response.json();
  }

  async uploadModelUpdate(roundId: string, clientId: string, update: ModelUpdate): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/v1/training/upload-update`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        round_id: roundId,
        client_id: clientId,
        model_update: update,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to upload model update');
    }

    return response.json();
  }

  // Metrics endpoints
  async getGlobalMetrics(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/v1/metrics/global`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch metrics');
    }

    return response.json();
  }

  async getNodeMetrics(nodeId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/v1/metrics/node/${nodeId}`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch node metrics');
    }

    return response.json();
  }

  // Dataset endpoints
  async uploadDataset(file: File, name: string): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);

    const response = await fetch(`${this.baseUrl}/api/v1/datasets/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload dataset');
    }

    return response.json();
  }

  async listDatasets(): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/api/v1/datasets/list`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch datasets');
    }

    return response.json();
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    const response = await fetch(`${this.baseUrl}/health`);
    
    if (!response.ok) {
      throw new Error('Backend is not healthy');
    }

    return response.json();
  }

  // WebSocket connection for real-time updates
  connectToTraining(roundId: string, onMessage: (data: any) => void, onError?: (error: Event) => void): WebSocket {
    const wsUrl = this.baseUrl.replace(/^http/, 'ws');
    const ws = new WebSocket(`${wsUrl}/ws/training/${roundId}`);

    ws.onopen = () => {
      console.log('WebSocket connected to training round:', roundId);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      if (onError) {
        onError(error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected from training round:', roundId);
    };

    return ws;
  }
}

export const pythonApi = new PythonAPIService();
