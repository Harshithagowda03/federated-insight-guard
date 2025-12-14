"""
FedSecure AI - Flask Backend Server
Adaptive Threat Detection with Federated Learning

This module provides REST API endpoints for the federated learning
threat detection system with JWT authentication.

Author: FedSecure AI Team
Course: MCA Project - Cybersecurity
"""

import os
import random
import hashlib
from datetime import datetime, timedelta
from functools import wraps

from flask import Flask, jsonify, request

# JWT handling - using PyJWT library
import jwt

# CORS for frontend communication
from flask_cors import CORS

# ============================================================
# Application Configuration
# ============================================================

app = Flask(__name__)

# Secret key for JWT signing - use environment variable in production
app.config['SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'fedsecure-dev-secret-change-in-production')

# Enable CORS for frontend communication
# Multiple origins for development flexibility
# In production, restrict to specific domains
allowed_origins = [
    'http://localhost:5173',
    'http://localhost:8080',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:8080',
    'https://lovable.dev',
    'https://*.lovable.app',  # Lovable preview URLs
]

# Enable CORS - in development allow all origins for easier testing
if os.getenv('FLASK_ENV') == 'development':
    CORS(app, origins='*', supports_credentials=True)
else:
    CORS(app, origins=allowed_origins, supports_credentials=True)

# Environment configuration
app.config['ENV'] = os.getenv('FLASK_ENV', 'development')
app.config['DEBUG'] = app.config['ENV'] == 'development'

# JWT token expiry duration
TOKEN_EXPIRY_HOURS = 24

# ============================================================
# User Storage (In-memory for demo - use database in production)
# ============================================================

registered_users = {}  # Format: { email: { password_hash, name, created_at } }

def hash_password(password):
    """Simple password hashing using SHA256 with salt."""
    salt = "fedsecure_salt_2024"
    return hashlib.sha256(f"{password}{salt}".encode()).hexdigest()

# ============================================================
# JWT Authentication Helpers
# ============================================================

def create_access_token(user_email):
    """
    Generates JWT token for authenticated user.
    Token includes user email and expiration timestamp.
    """
    payload = {
        'email': user_email,
        'exp': datetime.utcnow() + timedelta(hours=TOKEN_EXPIRY_HOURS),
        'iat': datetime.utcnow()
    }
    token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
    return token


def verify_token(token):
    """
    Validates JWT token and extracts user information.
    Returns user email if valid, None otherwise.
    """
    try:
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        return payload.get('email')
    except jwt.ExpiredSignatureError:
        return None  # Token has expired
    except jwt.InvalidTokenError:
        return None  # Token is invalid


def token_required(f):
    """
    Decorator to protect API endpoints.
    Checks for valid JWT in Authorization header.
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            return jsonify({'error': 'Authorization header missing'}), 401
        
        # Expect format: "Bearer <token>"
        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != 'bearer':
            return jsonify({'error': 'Invalid authorization format'}), 401
        
        token = parts[1]
        user_email = verify_token(token)
        
        if not user_email:
            return jsonify({'error': 'Invalid or expired token'}), 401
        
        # Attach user email to request context
        request.current_user = user_email
        return f(*args, **kwargs)
    
    return decorated


# ============================================================
# Simulated Data Store
# For academic purposes - replace with actual database in production
# ============================================================

federated_nodes = [
    {
        'node_id': 'alpha',
        'name': 'Node Alpha',
        'location': 'Campus Network A',
        'samples': 15000,
        'accuracy': 0.925,
        'status': 'online',
        'last_update': datetime.now().isoformat()
    },
    {
        'node_id': 'beta',
        'name': 'Node Beta',
        'location': 'Campus Network B',
        'samples': 18500,
        'accuracy': 0.941,
        'status': 'online',
        'last_update': datetime.now().isoformat()
    },
    {
        'node_id': 'gamma',
        'name': 'Node Gamma',
        'location': 'Research Lab',
        'samples': 12000,
        'accuracy': 0.918,
        'status': 'online',
        'last_update': datetime.now().isoformat()
    },
    {
        'node_id': 'delta',
        'name': 'Node Delta',
        'location': 'Data Center',
        'samples': 16200,
        'accuracy': 0.932,
        'status': 'online',
        'last_update': datetime.now().isoformat()
    }
]

training_state = {
    'is_running': False,
    'current_round': 0,
    'max_rounds': 10,
    'global_accuracy': 0.0,
    'global_loss': 1.0,
    'started_at': None,
    'last_aggregation': None
}

attack_categories = [
    {'type': 'dos', 'label': 'DoS Attack', 'severity': 'high'},
    {'type': 'ddos', 'label': 'DDoS Attack', 'severity': 'critical'},
    {'type': 'brute_force', 'label': 'Brute Force', 'severity': 'medium'},
    {'type': 'sql_injection', 'label': 'SQL Injection', 'severity': 'high'},
    {'type': 'xss', 'label': 'Cross-Site Scripting', 'severity': 'medium'},
    {'type': 'port_scan', 'label': 'Port Scanning', 'severity': 'low'},
    {'type': 'mitm', 'label': 'Man-in-the-Middle', 'severity': 'critical'},
    {'type': 'data_exfil', 'label': 'Data Exfiltration', 'severity': 'critical'}
]


# ============================================================
# Helper Functions
# ============================================================

def generate_threat_entry():
    """Creates a simulated threat detection record."""
    attack = random.choice(attack_categories)
    
    source_ip = f"192.168.{random.randint(1, 254)}.{random.randint(1, 254)}"
    target_ip = f"10.0.{random.randint(1, 10)}.{random.randint(1, 254)}"
    
    base_confidence = 0.75 if attack['severity'] == 'low' else 0.85
    confidence = min(0.99, base_confidence + random.uniform(0, 0.15))
    
    time_offset = random.randint(0, 3600)
    detected_at = datetime.now() - timedelta(seconds=time_offset)
    
    return {
        'threat_id': f"THR-{random.randint(10000, 99999)}",
        'attack_type': attack['type'],
        'attack_label': attack['label'],
        'severity': attack['severity'],
        'source_ip': source_ip,
        'target_ip': target_ip,
        'confidence': round(confidence, 3),
        'detected_at': detected_at.isoformat(),
        'status': random.choice(['detected', 'mitigated', 'investigating'])
    }


def calculate_global_metrics():
    """Aggregates metrics from all federated nodes."""
    total_samples = sum(node['samples'] for node in federated_nodes)
    
    if total_samples == 0:
        return 0.0, 1.0
    
    weighted_accuracy = sum(
        node['accuracy'] * node['samples'] 
        for node in federated_nodes
    ) / total_samples
    
    estimated_loss = 1.0 - weighted_accuracy
    
    return round(weighted_accuracy, 4), round(estimated_loss, 4)


# ============================================================
# Public API Endpoints (No auth required)
# ============================================================

@app.route('/health', methods=['GET'])
def health_check():
    """
    Simple health check - no authentication required.
    Used by frontend to detect backend connectivity.
    """
    return jsonify({
        'status': 'online',
        'service': 'FedSecure AI Backend',
        'version': '1.0.0',
        'timestamp': datetime.now().isoformat()
    })


@app.route('/api/health', methods=['GET'])
def api_health():
    """
    Detailed health check with system info.
    Public endpoint for monitoring.
    """
    online_nodes = sum(1 for n in federated_nodes if n['status'] == 'online')
    
    return jsonify({
        'status': 'online',
        'environment': app.config['ENV'],
        'nodes_online': online_nodes,
        'nodes_total': len(federated_nodes),
        'training_active': training_state['is_running'],
        'uptime_check': datetime.now().isoformat()
    })


# ============================================================
# Authentication Endpoints
# ============================================================

@app.route('/api/auth/register', methods=['POST'])
def register_user():
    """
    Registers new user account.
    Accepts email, password, and optional name.
    """
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'Request body required'}), 400
    
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    name = data.get('name', '').strip()
    
    # Basic validation
    if not email or '@' not in email:
        return jsonify({'error': 'Valid email address required'}), 400
    
    if len(password) < 6:
        return jsonify({'error': 'Password must be at least 6 characters'}), 400
    
    # Check if user already exists
    if email in registered_users:
        return jsonify({'error': 'Email already registered'}), 409
    
    # Store new user
    registered_users[email] = {
        'password_hash': hash_password(password),
        'name': name or email.split('@')[0],
        'created_at': datetime.now().isoformat()
    }
    
    # Generate token for immediate login
    access_token = create_access_token(email)
    
    return jsonify({
        'success': True,
        'message': 'Registration successful',
        'access_token': access_token,
        'user': {
            'email': email,
            'name': registered_users[email]['name']
        }
    }), 201


@app.route('/api/auth/login', methods=['POST'])
def login_user():
    """
    Authenticates user and returns JWT token.
    Accepts email and password.
    """
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'Request body required'}), 400
    
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    
    # Check if user exists
    if email not in registered_users:
        return jsonify({'error': 'Invalid email or password'}), 401
    
    # Verify password
    stored_hash = registered_users[email]['password_hash']
    if stored_hash != hash_password(password):
        return jsonify({'error': 'Invalid email or password'}), 401
    
    # Generate access token
    access_token = create_access_token(email)
    
    return jsonify({
        'success': True,
        'message': 'Login successful',
        'access_token': access_token,
        'user': {
            'email': email,
            'name': registered_users[email]['name']
        }
    })


@app.route('/api/auth/me', methods=['GET'])
@token_required
def get_current_user():
    """
    Returns current authenticated user info.
    Requires valid JWT token.
    """
    email = request.current_user
    
    if email not in registered_users:
        return jsonify({'error': 'User not found'}), 404
    
    user_data = registered_users[email]
    
    return jsonify({
        'email': email,
        'name': user_data['name'],
        'created_at': user_data['created_at']
    })


# ============================================================
# Protected API Endpoints (Auth required)
# ============================================================

@app.route('/api/metrics', methods=['GET'])
@token_required
def get_metrics():
    """Returns aggregated system metrics. Requires authentication."""
    global_accuracy, global_loss = calculate_global_metrics()
    total_samples = sum(node['samples'] for node in federated_nodes)
    
    threats_today = random.randint(45, 120)
    threats_blocked = int(threats_today * 0.87)
    
    return jsonify({
        'global_accuracy': global_accuracy,
        'global_loss': global_loss,
        'total_samples': total_samples,
        'active_nodes': len([n for n in federated_nodes if n['status'] == 'online']),
        'threats_detected': threats_today,
        'threats_blocked': threats_blocked,
        'detection_rate': round(threats_blocked / max(threats_today, 1), 3),
        'last_updated': datetime.now().isoformat()
    })


@app.route('/api/threats', methods=['GET'])
@token_required
def get_threats():
    """Returns list of recently detected threats. Requires authentication."""
    limit = request.args.get('limit', default=10, type=int)
    limit = min(limit, 50)
    
    threats = [generate_threat_entry() for _ in range(limit)]
    threats.sort(key=lambda x: x['detected_at'], reverse=True)
    
    severity_counts = {}
    for threat in threats:
        sev = threat['severity']
        severity_counts[sev] = severity_counts.get(sev, 0) + 1
    
    return jsonify({
        'threats': threats,
        'total_count': len(threats),
        'severity_distribution': severity_counts,
        'query_timestamp': datetime.now().isoformat()
    })


@app.route('/api/federated/status', methods=['GET'])
@token_required
def get_federated_status():
    """Returns federated learning training status. Requires authentication."""
    global_accuracy, global_loss = calculate_global_metrics()
    
    training_info = {
        **training_state,
        'global_accuracy': global_accuracy,
        'global_loss': global_loss
    }
    
    return jsonify({
        'training': training_info,
        'nodes': federated_nodes,
        'total_samples': sum(n['samples'] for n in federated_nodes),
        'timestamp': datetime.now().isoformat()
    })


@app.route('/api/federated/nodes', methods=['GET'])
@token_required
def get_nodes():
    """Returns all federated node information. Requires authentication."""
    return jsonify({
        'nodes': federated_nodes,
        'online_count': sum(1 for n in federated_nodes if n['status'] == 'online'),
        'total_count': len(federated_nodes)
    })


@app.route('/api/federated/start', methods=['POST'])
@token_required
def start_training():
    """Initiates federated learning session. Requires authentication."""
    global training_state
    
    if training_state['is_running']:
        return jsonify({
            'success': False,
            'message': 'Training session already in progress'
        }), 400
    
    config = request.get_json() or {}
    max_rounds = config.get('max_rounds', 10)
    
    training_state = {
        'is_running': True,
        'current_round': 1,
        'max_rounds': max_rounds,
        'global_accuracy': 0.0,
        'global_loss': 1.0,
        'started_at': datetime.now().isoformat(),
        'last_aggregation': None
    }
    
    return jsonify({
        'success': True,
        'message': 'Federated training initiated',
        'session': training_state
    })


@app.route('/api/federated/stop', methods=['POST'])
@token_required
def stop_training():
    """Stops current federated learning session. Requires authentication."""
    global training_state
    
    if not training_state['is_running']:
        return jsonify({
            'success': False,
            'message': 'No active training session'
        }), 400
    
    final_accuracy = training_state['global_accuracy']
    training_state['is_running'] = False
    
    return jsonify({
        'success': True,
        'message': 'Training session terminated',
        'final_accuracy': final_accuracy,
        'completed_rounds': training_state['current_round']
    })


# ============================================================
# Error Handlers
# ============================================================

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found', 'status': 404}), 404


@app.errorhandler(500)
def server_error(error):
    return jsonify({'error': 'Internal server error', 'status': 500}), 500


# ============================================================
# Application Entry Point
# ============================================================

if __name__ == '__main__':
    # Use port 5000 as commonly expected for Flask
    port = int(os.getenv('PORT', 5000))
    
    print(f"""
    ╔══════════════════════════════════════════════════════════╗
    ║           FedSecure AI - Backend Server                  ║
    ║     Adaptive Threat Detection with Federated Learning    ║
    ╠══════════════════════════════════════════════════════════╣
    ║  Environment: {app.config['ENV']:<42} ║
    ║  Port: {port:<48} ║
    ║  Debug Mode: {str(app.config['DEBUG']):<43} ║
    ║  JWT Auth: Enabled                                       ║
    ╚══════════════════════════════════════════════════════════╝
    
    Available Endpoints:
    - GET  /health              - Health check (public)
    - GET  /api/health          - Detailed health (public)
    - POST /api/auth/register   - User registration (public)
    - POST /api/auth/login      - User login (public)
    - GET  /api/auth/me         - Current user (protected)
    - GET  /api/metrics         - System metrics (protected)
    - GET  /api/threats         - Threat list (protected)
    - GET  /api/federated/*     - FL endpoints (protected)
    """)
    
    app.run(
        host='0.0.0.0',
        port=port,
        debug=app.config['DEBUG']
    )
