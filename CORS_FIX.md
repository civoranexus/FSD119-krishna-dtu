# CORS Error Fix ✅

## Problem
The backend was rejecting requests from the frontend with "Not allowed by CORS" errors.

## Root Cause
The `FRONTEND_URL` environment variable was missing from `backend/.env`, so the CORS middleware didn't know to allow requests from `http://localhost:5173`.

## Solution Applied

### 1. Updated `backend/.env`
Added the missing environment variables:
```env
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### 2. CORS Configuration (already correct in server.js)
The CORS middleware allows:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (alternative port)
- `process.env.FRONTEND_URL` (from .env)
- Requests with no origin (Postman, mobile apps)

## How to Fix

### Step 1: Stop the Backend Server
Press `Ctrl+C` in the terminal running the backend.

### Step 2: Restart the Backend
```bash
cd backend
npm run dev
```

The server will now pick up the new environment variables and allow CORS requests from the frontend.

### Step 3: Verify
You should see:
```
✅ Connected to MongoDB
✅ Server running on http://localhost:5000
✅ Environment: development
```

And NO MORE "Not allowed by CORS" errors!

## Testing

### Test 1: Health Check
Open browser to: http://localhost:5000/health

Should return:
```json
{
  "status": "ok",
  "timestamp": "..."
}
```

### Test 2: Frontend Login
1. Start frontend: `cd frontend && npm run dev`
2. Open: http://localhost:5173
3. Try to login
4. Should work without CORS errors

## Environment Variables Reference

### Backend `.env` (Complete)
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=krishna
DB_NAME=healthvillage
MONGO_URI=mongodb://127.0.0.1:27017/healthvillage
JWT_SECRET=healthvillage_dev_secret_2026
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend `.env` (Complete)
```env
VITE_API_URL=http://localhost:5000/api
```

## Production Deployment

For production, update `backend/.env`:
```env
FRONTEND_URL=https://your-production-domain.com
NODE_ENV=production
```

## Troubleshooting

### Still Getting CORS Errors?

1. **Check if backend restarted**: Make sure you stopped and restarted the backend after updating .env

2. **Check frontend URL**: Make sure frontend is running on http://localhost:5173
   ```bash
   # In frontend terminal, you should see:
   VITE v... ready in ...ms
   ➜  Local:   http://localhost:5173/
   ```

3. **Check browser console**: Open DevTools (F12) and check for the actual origin being sent

4. **Clear browser cache**: Sometimes browsers cache CORS responses
   - Press Ctrl+Shift+Delete
   - Clear cached images and files
   - Reload page

5. **Check .env is loaded**: Add this temporarily to server.js after dotenv.config():
   ```javascript
   console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
   console.log('Allowed origins:', allowedOrigins);
   ```

### Alternative: Development Mode CORS (Less Secure)

If you're still having issues in development, you can temporarily use a more permissive CORS configuration:

**⚠️ ONLY FOR DEVELOPMENT - DO NOT USE IN PRODUCTION**

Replace the CORS configuration in `server.js` with:
```javascript
if (process.env.NODE_ENV === 'development') {
  // Development: Allow all origins
  app.use(cors({
    origin: true,
    credentials: true,
  }));
} else {
  // Production: Strict CORS
  const allowedOrigins = [process.env.FRONTEND_URL].filter(Boolean);
  app.use(cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }));
}
```

## Summary

✅ Added `FRONTEND_URL=http://localhost:5173` to backend/.env
✅ Added `NODE_ENV=development` to backend/.env
✅ CORS configuration is correct
✅ Just restart the backend server to apply changes

**Next Step**: Stop and restart the backend server!
