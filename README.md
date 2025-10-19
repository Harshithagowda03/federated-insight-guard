# FedSecure AI

A full-stack web application for adaptive threat detection using deep learning and federated learning. This React dashboard interfaces with a Python Flask backend for AI-powered security operations.

## Features

- 🛡️ **Real-time Threat Detection**: Monitor and analyze security threats in real-time
- 🤖 **Federated Learning**: Distributed model training across multiple nodes
- 📊 **Threat Analytics**: Visualize threat patterns and trends
- 🎯 **Attack Simulator**: Test AI models with simulated attack scenarios (GANs)
- 📤 **Data Upload**: Upload training data (CSV, JSON, PCAP, LOG files)
- 📈 **Performance Metrics**: Detailed model performance visualization

## Project info

**URL**: https://lovable.dev/projects/cb66a470-9de5-458c-9d3b-8084a84877ec

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/cb66a470-9de5-458c-9d3b-8084a84877ec) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Recharts for data visualization
- shadcn/ui component library
- Vite for build tooling

### Backend (To be implemented)
- Python Flask REST API
- Deep Learning frameworks (TensorFlow/PyTorch)
- Federated Learning implementation
- GAN-based attack generation

## Connecting Your Flask Backend

The frontend uses the API service layer located in `src/services/api.ts`. Here are the required Flask endpoints:

### API Endpoints

#### Federated Learning
- `POST /api/federated/train` - Start training round
- `GET /api/federated/status` - Get training status
- `GET /api/federated/nodes` - Get node information
- `POST /api/federated/pause` - Pause training

#### Threat Analytics
- `GET /api/threats/timeline?hours=24` - Get threat timeline
- `GET /api/threats/distribution` - Get threat distribution
- `GET /api/threats/top` - Get top threat types
- `GET /api/threats/recent?limit=10` - Get recent threats

#### Attack Simulator
- `POST /api/simulator/run` - Run attack simulation
- `GET /api/simulator/results/:id` - Get simulation results
- `GET /api/simulator/attack-types` - Get available attack types

#### Data Upload
- `POST /api/data/upload` - Upload training data (multipart/form-data)
- `GET /api/data/upload/:id` - Get upload status
- `GET /api/data/stats` - Get processed data stats

#### Performance Metrics
- `GET /api/metrics/accuracy` - Get accuracy metrics
- `GET /api/metrics/loss` - Get loss metrics
- `GET /api/metrics/classification` - Get classification metrics
- `GET /api/metrics/comparison` - Get model comparison

#### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/status` - Get system status

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:5000/api
```

## Docker Deployment

### Frontend Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["npm", "run", "preview"]
```

### Backend Dockerfile (Example)
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "app.py"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "8080:8080"
    environment:
      - VITE_API_URL=http://backend:5000/api
    depends_on:
      - backend
  
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
```

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/cb66a470-9de5-458c-9d3b-8084a84877ec) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
