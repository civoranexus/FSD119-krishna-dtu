# 🚀 Deployment Checklist - HealthVillage

## Quick Reference for Production Deployment

---

## ⚡ Quick Health Check

```bash
# Run this first!
node health-check.js

# Or on Windows
.\health-check.ps1
```

**Expected Result**: All ✅ green checks

---

## 📋 Pre-Deployment Checklist

### Phase 1: Local Verification ✅

- [ ] Run health check script
- [ ] All tests pass (green ✅)
- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] MongoDB connected
- [ ] No CORS errors in browser console

### Phase 2: Environment Configuration ✅

**Backend `.env`**:
- [ ] `MONGO_URI` - Production MongoDB connection string
- [ ] `JWT_SECRET` - Strong secret (32+ characters)
- [ ] `FRONTEND_URL` - Production frontend URL
- [ ] `NODE_ENV=production`
- [ ] No hardcoded secrets in code

**Frontend `.env`**:
- [ ] `VITE_API_URL` - Production API URL

### Phase 3: Security Hardening ✅

- [ ] JWT_SECRET is strong and unique
- [ ] CORS configured for production domain only
- [ ] Rate limiting enabled
- [ ] Helmet.js security headers active
- [ ] Input validation working
- [ ] NoSQL injection protection active
- [ ] HTTPS enabled (production)

### Phase 4: Database Preparation ✅

- [ ] MongoDB accessible from production
- [ ] Database indexes created
- [ ] Connection pooling configured
- [ ] Backup strategy in place
- [ ] Test data removed (if any)

### Phase 5: Build & Test ✅

**Backend**:
- [ ] `npm install` completes without errors
- [ ] `npm start` runs successfully
- [ ] All API endpoints tested
- [ ] Authentication working
- [ ] Authorization working

**Frontend**:
- [ ] `npm install` completes without errors
- [ ] `npm run build` succeeds
- [ ] Build output in `frontend/dist/`
- [ ] No console errors in production build
- [ ] All routes accessible

### Phase 6: Deployment ✅

- [ ] Backend deployed and running
- [ ] Frontend deployed and accessible
- [ ] Database connected
- [ ] Health check endpoint responding
- [ ] SSL/TLS certificate installed
- [ ] DNS configured correctly

### Phase 7: Post-Deployment Verification ✅

- [ ] Application loads successfully
- [ ] User registration works
- [ ] User login works
- [ ] Patient can book appointment
- [ ] Doctor can set availability
- [ ] Admin dashboard accessible
- [ ] No errors in production logs
- [ ] Performance acceptable

---

## 🔥 Critical Issues - Must Fix Before Deploy

### ❌ Backend Not Running
```bash
cd backend
npm install
npm run dev
```

### ❌ Frontend Not Running
```bash
cd frontend
npm install
npm run dev
```

### ❌ MongoDB Not Connected
```bash
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### ❌ Missing Environment Variables
Create/update `backend/.env`:
```env
MONGO_URI=mongodb://127.0.0.1:27017/healthvillage
JWT_SECRET=<generate-strong-secret-32-chars>
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### ❌ CORS Errors
1. Add `FRONTEND_URL` to `backend/.env`
2. Restart backend server
3. Clear browser cache

---

## ⚠️ Warnings - Should Fix Before Deploy

### ⚠️ Weak JWT Secret
Generate strong secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### ⚠️ NODE_ENV Not Set to Production
Update `backend/.env`:
```env
NODE_ENV=production
```

### ⚠️ Development Dependencies in Production
```bash
cd backend
npm install --production
```

---

## 🎯 Deployment Commands

### Local Development
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

### Production Build
```bash
# Backend
cd backend
npm install --production
npm start

# Frontend
cd frontend
npm run build
# Deploy frontend/dist/ folder
```

---

## 🔍 Quick Diagnostics

### Check Backend Health
```bash
curl http://localhost:5000/health
# Expected: {"status":"ok","timestamp":"..."}
```

### Check Frontend
```bash
curl http://localhost:5173
# Expected: HTML content with "HealthVillage"
```

### Check MongoDB
```bash
mongosh --eval "db.adminCommand('ping')"
# Expected: { ok: 1 }
```

### Check Ports
```bash
# Windows
netstat -ano | findstr :5000
netstat -ano | findstr :5173

# Mac/Linux
lsof -ti:5000
lsof -ti:5173
```

---

## 📊 Health Check Status Guide

| Status | Meaning | Action |
|--------|---------|--------|
| ✅ PASS | Component healthy | No action needed |
| ⚠️ WARN | Works but has warnings | Review and fix if possible |
| ❌ FAIL | Critical issue | Must fix before deploy |

---

## 🚨 Emergency Rollback

If deployment fails:

1. **Stop Production Services**
2. **Restore Previous Version**
3. **Check Logs** for error details
4. **Fix Issues** in development
5. **Re-run Health Check**
6. **Re-deploy** when all checks pass

---

## 📞 Quick Reference

### Important Files
- `backend/.env` - Backend configuration
- `frontend/.env` - Frontend configuration
- `health-check.js` - Health check script
- `PRE_FLIGHT_CHECK.md` - Detailed documentation

### Important Ports
- `5000` - Backend API
- `5173` - Frontend (development)
- `27017` - MongoDB

### Important URLs
- Backend Health: `http://localhost:5000/health`
- Frontend: `http://localhost:5173`
- API Base: `http://localhost:5000/api`

### Important Commands
```bash
# Health check
node health-check.js

# Start backend
cd backend && npm run dev

# Start frontend
cd frontend && npm run dev

# Build frontend
cd frontend && npm run build

# Check MongoDB
mongosh --eval "db.adminCommand('ping')"
```

---

## ✅ Ready to Deploy?

Run this final check:

```bash
node health-check.js
```

If you see:
```
🎉 ALL SYSTEMS GO! Ready for deployment.
```

**You're ready to deploy!** 🚀

---

**Quick Links**:
- Full Documentation: `PRE_FLIGHT_CHECK.md`
- Troubleshooting: `CORS_FIX.md`
- Getting Started: `QUICK_START_GUIDE.md`
- System Overview: `ALL_TASKS_SUMMARY.md`

---

**Last Updated**: 2026-02-11
**Version**: 1.0.0
