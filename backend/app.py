"""
FedSecure AI - Flask Backend Server
Adaptive Threat Detection with Federated Learning

This module provides REST API endpoints for the federated learning
threat detection system. Designed for academic demonstration purposes.

Author: FedSecure AI Team
Course: MCA Project - Cybersecurity
"""

import os
import random
from datetime import datetime, timedelta
from functools import wraps

from flask import Flask, jsonify, request
from flask_cors import CORS

# ============================================================
# Application Configuration
# ============================================================

app = Flask(__name__)

# Enable CORS for frontend communication
# In production, restrict origins to your actual frontend domain
allowed_origins = os.getenv('ALLOWED_ORIGINS', 'http://localhost:5173').split(',')
CORS(app, origins=allowed_origins, supports_credentials=True)

# Environment configuration
app.config['ENV'] = os.getenv('FLASK_ENV', 'development')
app.config['DEBUG'] = app.config['ENV'] == 'development'

# ============================================================
# Simulated Data Store
# For academic purposes - replace with actual database in production
# ============================================================

# Federated learning nodes representing distributed training participants
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

# Training session state
training_state = {
    'is_running': False,
    'current_round': 0,
    'max_rounds': 10,
    'global_accuracy': 0.0,
    'global_loss': 1.0,
    'started_at': None,
    'last_aggregation': None
}

# Attack type definitions for threat classification
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
    """
    Creates a simulated threat detection record.
    Mimics real-world network intrusion data patterns.
    """
    attack = random.choice(attack_categories)
    
    # Generate realistic-looking IP addresses
    source_ip = f"192.168.{random.randint(1, 254)}.{random.randint(1, 254)}"
    target_ip = f"10.0.{random.randint(1, 10)}.{random.randint(1, 254)}"
    
    # Confidence score varies based on attack type complexity
    base_confidence = 0.75 if attack['severity'] == 'low' else 0.85
    confidence = min(0.99, base_confidence + random.uniform(0, 0.15))
    
    # Timestamp within last hour for recent threats
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
    """
    Aggregates metrics from all federated nodes.
    Implements weighted averaging based on sample counts.
    """
    total_samples = sum(node['samples'] for node in federated_nodes)
    
    if total_samples == 0:
        return 0.0, 1.0
    
    # Weighted accuracy calculation
    weighted_accuracy = sum(
        node['accuracy'] * node['samples'] 
        for node in federated_nodes
    ) / total_samples
    
    # Loss decreases as accuracy improves
    estimated_loss = 1.0 - weighted_accuracy
    
    return round(weighted_accuracy, 4), round(estimated_loss, 4)


# ============================================================
# API Endpoints
# ============================================================

@app.route('/health', methods=['GET'])
def health_check():
    """
    Simple health check endpoint for frontend connectivity monitoring.
    Returns basic server status information.
    """
    return jsonify({
        'status': 'healthy',
        'service': 'FedSecure AI Backend',
        'version': '1.0.0',
        'timestamp': datetime.now().isoformat()
    })


@app.route('/api/health', methods=['GET'])
def api_health():
    """
    Detailed health check with system information.
    Used by monitoring dashboards.
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


@app.route('/api/metrics', methods=['GET'])
def get_metrics():
    """
    Returns aggregated system metrics.
    Combines node statistics with threat detection counts.
    """
    global_accuracy, global_loss = calculate_global_metrics()
    total_samples = sum(node['samples'] for node in federated_nodes)
    
    # Simulated threat counts for demonstration
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
def get_threats():
    """
    Returns list of recently detected threats.
    Supports pagination via query parameters.
    """
    # Parse pagination parameters
    limit = request.args.get('limit', default=10, type=int)
    limit = min(limit, 50)  # Cap at 50 for performance
    
    # Generate simulated threat data
    threats = [generate_threat_entry() for _ in range(limit)]
    
    # Sort by detection time, newest first
    threats.sort(key=lambda x: x['detected_at'], reverse=True)
    
    # Calculate severity distribution
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
def get_federated_status():
    """
    Returns current state of federated learning training.
    Includes node information and training progress.
    """
    global_accuracy, global_loss = calculate_global_metrics()
    
    # Update training state with current metrics
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
def get_nodes():
    """
    Returns detailed information about all federated nodes.
    """
    return jsonify({
        'nodes': federated_nodes,
        'online_count': sum(1 for n in federated_nodes if n['status'] == 'online'),
        'total_count': len(federated_nodes)
    })


@app.route('/api/federated/start', methods=['POST'])
def start_training():
    """
    Initiates federated learning training session.
    Accepts configuration parameters in request body.
    """
    global training_state
    
    if training_state['is_running']:
        return jsonify({
            'success': False,
            'message': 'Training session already in progress'
        }), 400
    
    # Parse training configuration
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
def stop_training():
    """
    Stops the current federated learning session.
    Preserves final metrics for analysis.
    """
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
    """Handle unknown routes gracefully."""
    return jsonify({
        'error': 'Endpoint not found',
        'status': 404
    }), 404


@app.errorhandler(500)
def server_error(error):
    """Handle internal errors without exposing details."""
    return jsonify({
        'error': 'Internal server error',
        'status': 500
    }), 500


# ============================================================
# Application Entry Point
# ============================================================

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8000))
    
    print(f"""
    ╔══════════════════════════════════════════════════════════╗
    ║           FedSecure AI - Backend Server                  ║
    ║     Adaptive Threat Detection with Federated Learning    ║
    ╠══════════════════════════════════════════════════════════╣
    ║  Environment: {app.config['ENV']:<42} ║
    ║  Port: {port:<48} ║
    ║  Debug Mode: {str(app.config['DEBUG']):<43} ║
    ╚══════════════════════════════════════════════════════════╝
    """)
    
    app.run(
        host='0.0.0.0',
        port=port,
        debug=app.config['DEBUG']
    )
