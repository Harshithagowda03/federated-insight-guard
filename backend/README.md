# FedSecure AI - Flask Backend

## Overview

This is the Python Flask backend for the Adaptive Threat Detection with Federated Learning project. It provides REST APIs for threat detection, federated learning coordination, and system metrics.

## Setup Instructions

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv

# On Windows
venv\Scripts\activate

# On Linux/Mac
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

Create a `.env` file in the backend directory:

```env
FLASK_ENV=development
PORT=8000
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 4. Run the Server

```bash
python app.py
```

The server will start on `http://localhost:8000`

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Basic health check |
| `/api/health` | GET | Detailed system status |
| `/api/metrics` | GET | Aggregated system metrics |
| `/api/threats` | GET | Recent threat detections |
| `/api/federated/status` | GET | Training session status |
| `/api/federated/nodes` | GET | List federated nodes |
| `/api/federated/start` | POST | Start training session |
| `/api/federated/stop` | POST | Stop training session |

## Testing

Test the health endpoint:

```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "FedSecure AI Backend",
  "version": "1.0.0"
}
```

## Production Deployment

For production, use Gunicorn:

```bash
gunicorn -w 4 -b 0.0.0.0:8000 app:app
```

## Project Structure

```
backend/
├── app.py              # Main Flask application
├── requirements.txt    # Python dependencies
├── README.md          # This file
└── .env               # Environment configuration
```

## Author

FedSecure AI Team - MCA Cybersecurity Project
