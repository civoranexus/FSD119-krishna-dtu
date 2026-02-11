# How to Start the Healthcare System

## Quick Start (2 Terminals)

### Terminal 1: Backend
```bash
cd backend
npm run dev
```

Wait for:
```
✅ Connected to MongoDB
✅ Server running on http://localhost:5000
✅ Environment: development
```

### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```

Wait for:
```
VITE v... ready in ...ms
➜  Local:   http://localhost:5173/
```

Then open your browser to: **http://localhost:5173**

---

## Troubleshooting

### Backend Won't Start

**Error: "Cannot find module"**
```bash
cd backend
npm install
npm run dev
```

**Error: "MongoDB connection failed"**
- Make sure MongoDB is running
- Windows: `net start MongoDB`
- Mac/Linux: `sudo systemctl start mongod`

**Error: "Port 5000 already in use"**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### Frontend Won't Start

**Error: "Cannot find module"**
```bash
cd frontend
npm install
npm run dev
```

**Error: "Port 5173 already in use"**
- The frontend will automatically try the next available port
- Or kill the process using port 5173

### CORS Errors

If you see "Not allowed by CORS" in the browser console:

1. **Stop the backend** (Ctrl+C)
2. **Check backend/.env has**:
   ```env
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=development
   ```
3. **Restart the backend**: `npm run dev`

See `CORS_FIX.md` for detailed troubleshooting.

---

## Environment Setup (First Time Only)

### Backend Environment
Create `backend/.env`:
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

### Frontend Environment
Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Verify Everything Works

### 1. Backend Health Check
Open: http://localhost:5000/health

Should see:
```json
{
  "status": "ok",
  "timestamp": "2026-02-08T..."
}
```

### 2. Frontend Loads
Open: http://localhost:5173

Should see the healthcare system homepage.

### 3. Login Works
1. Go to http://localhost:5173/login
2. Try to login (or register first)
3. Should NOT see CORS errors in console (F12)

---

## Development Workflow

### Making Backend Changes
1. Edit files in `backend/src/`
2. Server auto-restarts (nodemon)
3. Refresh browser to see changes

### Making Frontend Changes
1. Edit files in `frontend/src/`
2. Browser auto-refreshes (Vite HMR)
3. Changes appear immediately

### Adding New Dependencies

**Backend**:
```bash
cd backend
npm install <package-name>
```

**Frontend**:
```bash
cd frontend
npm install <package-name>
```

---

## Stopping the Servers

Press `Ctrl+C` in each terminal to stop the servers.

---

## Production Build

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
# Output in frontend/dist/
```

---

## Common Commands

### Backend
- `npm run dev` - Start development server with auto-restart
- `npm start` - Start production server
- `npm test` - Run tests (if configured)

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

---

## Need Help?

1. Check `CORS_FIX.md` for CORS issues
2. Check `QUICK_START_GUIDE.md` for detailed setup
3. Check `ALL_TASKS_SUMMARY.md` for system overview
4. Check browser console (F12) for errors
5. Check terminal output for server errors
