# Python FastAPI Backend Integration

This document explains how your React frontend integrates with the Python FastAPI backend for federated learning.

## 🔗 Integration Overview

Your frontend now includes:
- **API Service** (`src/services/pythonApi.ts`) - All backend communication
- **Backend Status Hook** (`src/hooks/usePythonBackend.tsx`) - Health monitoring
- **Status Badge** (`src/components/BackendStatusBadge.tsx`) - Visual connection indicator
- **WebSocket Support** - Real-time training updates

## 🚀 Quick Start

### 1. Set Backend URL

Update `.env` with your Python backend URL:

```env
# For local development
VITE_PYTHON_API_URL=http://localhost:8000

# For production (after deploying to Render/Railway)
VITE_PYTHON_API_URL=https://your-backend.onrender.com
```

### 2. Deploy Python Backend

Follow the Python backend setup guide I provided earlier. Quick options:

**Option A: Render (Recommended)**
1. Push code to GitHub
2. Create Web Service on Render
3. Set environment variables
4. Deploy

**Option B: Railway**
```bash
railway login
railway init
railway up
```

**Option C: Local Testing**
```bash
cd federated-backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 3. Test Connection

1. Start your React app: `npm run dev`
2. Check the badge in the top-right corner:
   - ✅ Green "Backend Online" = Connected
   - ❌ Red "Backend Offline" = Not connected
3. Go to Federated Learning tab
4. Click "Start Training" to test WebSocket connection

## 📡 API Endpoints Used

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration

### Training
- `POST /api/v1/training/start` - Start FL training
- `GET /api/v1/training/status/{round_id}` - Get training status
- `POST /api/v1/training/upload-update` - Upload model update

### Datasets
- `POST /api/v1/datasets/upload` - Upload dataset
- `GET /api/v1/datasets/list` - List datasets

### Metrics
- `GET /api/v1/metrics/global` - Global metrics
- `GET /api/v1/metrics/node/{node_id}` - Node metrics

### WebSocket
- `WS /ws/training/{round_id}` - Real-time training updates

## 🔄 How It Works

### Training Flow

1. **User clicks "Start Training"**
   ```typescript
   pythonApi.startTraining({
     participant_ids: ['node1', 'node2', 'node3'],
     max_rounds: 10,
     target_accuracy: 0.95
   })
   ```

2. **Backend starts FL round**
   - Returns `round_id`
   - Begins coordinating training across nodes

3. **Frontend connects to WebSocket**
   ```typescript
   pythonApi.connectToTraining(roundId, (data) => {
     // Real-time updates
     setProgress(data.progress)
     setAccuracy(data.accuracy)
   })
   ```

4. **Training updates stream in real-time**
   - Progress percentage
   - Current round number
   - Accuracy metrics
   - Completion status

### Backend Status Monitoring

The `usePythonBackend` hook automatically:
- Checks backend health every 30 seconds
- Updates connection status
- Shows errors in badge tooltip

## 🛠️ Development Tips

### Testing Without Backend

If backend is offline, the UI will:
- Show "Backend Offline" badge
- Disable "Start Training" button
- Display helpful error messages

### Adding New API Calls

1. Add method to `pythonApi` in `src/services/pythonApi.ts`:
```typescript
async newEndpoint(params: any): Promise<any> {
  const response = await fetch(`${this.baseUrl}/api/v1/new`, {
    method: 'POST',
    headers: this.getHeaders(),
    body: JSON.stringify(params)
  });
  return response.json();
}
```

2. Use in component:
```typescript
const result = await pythonApi.newEndpoint({ data: 'test' });
```

### WebSocket Debugging

Check browser console for WebSocket logs:
- `WebSocket connected to training round: {id}`
- `WebSocket disconnected from training round: {id}`

## 🔒 Security Notes

- API tokens stored in localStorage
- All requests include Authorization header
- WebSocket connections authenticated via URL
- CORS configured in backend for your frontend domains

## 📊 Features Ready to Use

✅ **Federated Learning Tab**
- Start/Pause/Reset training
- Real-time progress updates
- Live accuracy metrics
- WebSocket connection indicator

✅ **Backend Status Badge**
- Health monitoring
- Connection status
- Helpful tooltips

✅ **Error Handling**
- Connection failures
- Training errors
- User-friendly messages

## 🚀 Next Steps

1. Deploy your Python backend
2. Update `VITE_PYTHON_API_URL` in `.env`
3. Test the connection
4. Start training!

## 📝 Troubleshooting

**Backend Offline?**
- Check `.env` file has correct URL
- Verify Python backend is running
- Check CORS settings in backend
- Look for errors in browser console

**WebSocket Not Connecting?**
- Ensure WebSocket support in backend
- Check firewall settings
- Verify URL format (ws:// or wss://)

**Training Not Starting?**
- Check backend logs
- Verify minimum 3 participants
- Ensure valid training parameters

## 📚 Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [WebSocket Guide](https://websockets.readthedocs.io/)
- [Render Deployment](https://render.com/docs)
- [Railway Deployment](https://docs.railway.app/)
