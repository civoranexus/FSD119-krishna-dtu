# 🚀 Pre-Flight Check - Production Deployment Readiness

## Overview

This document provides a comprehensive health check system to verify your HealthVillage application is ready for production deployment. The diagnostic scripts test all critical components without modifying any code.

---

## 🎯 What Gets Checked

### 1. Environment Configuration ✅
- Backend `.env` file existence and readability
- Frontend `.env` file existence (optional)
- Required environment variables presence
- JWT secret strength validation
- NODE_ENV setting verification

### 2. Backend API Health ✅
- Port 5000 availability
- Backend server running status
- `/health` endpoint responsiveness
- CORS headers configuration
- API response validation

### 3. Frontend Application ✅
- Port 5173 availability
- Frontend server running status
- Application accessibility
- HealthVillage app detection

### 4. Database Connectivity ✅
- MongoDB URI configuration
- Database connection testing
- Connection string parsing
- MongoDB service status

### 5. Security Settings ✅
- Hardcoded secrets detection
- JWT secret strength
- CORS origin configuration
- Production mode verification

---

## 🛠️ Running the Health Check

### Option 1: Node.js Script (Recommended)

**Prerequisites**: Node.js 16+ installed

```bash
# Run from project root
node health-check.js
```

**Features**:
- Comprehensive MongoDB connection testing
- Detailed error diagnostics
- Color-coded output
- Timeout handling

### Option 2: PowerShell Script (Windows)

**Prerequisites**: PowerShell 5.1+ (built into Windows)

```powershell
# Run from project root
.\health-check.ps1
```

**Features**:
- Windows-native execution
- No additional dependencies
- Quick port and HTTP checks
- Color-coded output

### Option 3: Manual Checks

If scripts fail, perform manual checks:

```bash
# 1. Check backend
curl http://localhost:5000/health

# 2. Check frontend
curl http://localhost:5173

# 3. Check MongoDB
mongosh --eval "db.adminCommand('ping')"

# 4. Check ports
netstat -ano | findstr :5000
netstat -ano | findstr :5173
```

---

## 📊 Understanding the Output

### Status Indicators

- ✅ **PASS** (Green) - Component is healthy and ready
- ⚠️ **WARN** (Yellow) - Component works but has warnings
- ❌ **FAIL** (Red) - Component has critical issues

### Sample Output

```
========================================================================
🏥 HealthVillage System Health Check
Pre-Flight Diagnostic for Production Deployment
========================================================================

📋 Environment Configuration
----------------------------------------------------------------------
✅ Backend .env: File exists and readable
✅ Required Variables: All present
✅ JWT_SECRET Strength: Adequate length
⚠️  Environment Mode: Currently: development

📋 Backend API Health
----------------------------------------------------------------------
✅ Port 5000: In use (backend likely running)
✅ Health Endpoint: /health returns 200
✅ Health Status: Server reports OK
✅ CORS Headers: Configured: http://localhost:5173

📋 Frontend Application
----------------------------------------------------------------------
✅ Port 5173: In use (frontend likely running)
✅ Frontend Server: Responding on port 5173
✅ Application: HealthVillage app detected

📋 Database Connectivity
----------------------------------------------------------------------
✅ MongoDB URI: Configured in .env
✅ Database Host: 127.0.0.1:27017
✅ Database Name: healthvillage
✅ MongoDB Connection: Successfully connected

📋 Security Configuration
----------------------------------------------------------------------
✅ Hardcoded Secrets: No hardcoded secrets detected
✅ JWT Secret: Strong secret configured
✅ CORS Origin: Configured: http://localhost:5173
⚠️  Production Mode: NODE_ENV=development (should be "production" for deployment)

========================================================================
📊 Health Check Summary
========================================================================

✅ Environment Configuration: PASS
✅ Backend API: PASS
✅ Frontend Application: PASS
✅ Database Connection: PASS
✅ Security Settings: PASS

========================================================================
🎉 ALL SYSTEMS GO! Ready for deployment.
========================================================================
```

---

## 🔧 Fixing Common Issues

### Issue: Backend Not Running

**Symptoms**:
```
❌ Backend Server: Not running on port 5000
```

**Solution**:
```bash
cd backend
npm install  # If first time
npm run dev
```

**Verify**: Check for "✅ Server running on http://localhost:5000"

---

### Issue: Frontend Not Running

**Symptoms**:
```
❌ Frontend Server: Not running on port 5173
```

**Solution**:
```bash
cd frontend
npm install  # If first time
npm run dev
```

**Verify**: Check for "Local: http://localhost:5173/"

---

### Issue: MongoDB Not Connected

**Symptoms**:
```
❌ MongoDB Connection: Connection failed
```

**Solutions**:

**Windows**:
```bash
# Start MongoDB service
net start MongoDB

# Or install MongoDB if not installed
# Download from: https://www.mongodb.com/try/download/community
```

**Mac**:
```bash
# Start MongoDB
brew services start mongodb-community

# Or
mongod --config /usr/local/etc/mongod.conf
```

**Linux**:
```bash
# Start MongoDB
sudo systemctl start mongod

# Enable on boot
sudo systemctl enable mongod
```

**Verify**:
```bash
mongosh --eval "db.adminCommand('ping')"
# Should return: { ok: 1 }
```

---

### Issue: Missing Environment Variables

**Symptoms**:
```
⚠️  Required Variables: Missing: JWT_SECRET, FRONTEND_URL
```

**Solution**:

Edit `backend/.env`:
```env
MONGO_URI=mongodb://127.0.0.1:27017/healthvillage
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

**Verify**: Re-run health check

---

### Issue: Port Already in Use

**Symptoms**:
```
Error: Port 5000 is already in use
```

**Solution**:

**Windows**:
```bash
# Find process using port
netstat -ano | findstr :5000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

**Mac/Linux**:
```bash
# Find and kill process
lsof -ti:5000 | xargs kill -9
```

---

### Issue: CORS Errors

**Symptoms**:
```
❌ CORS Headers: Not present in response
```

**Solution**:

1. Check `backend/.env` has:
   ```env
   FRONTEND_URL=http://localhost:5173
   ```

2. Restart backend:
   ```bash
   cd backend
   # Press Ctrl+C to stop
   npm run dev
   ```

**Verify**: Check browser console for CORS errors

---

### Issue: Weak JWT Secret

**Symptoms**:
```
⚠️  JWT Secret: Secret could be stronger
```

**Solution**:

Generate a strong secret:
```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

Update `backend/.env`:
```env
JWT_SECRET=<generated-secret-here>
```

---

## 📋 Pre-Deployment Checklist

Before deploying to production, ensure:

### Environment
- [ ] `NODE_ENV=production` in backend `.env`
- [ ] Strong JWT_SECRET (32+ characters)
- [ ] Production MongoDB URI configured
- [ ] Production FRONTEND_URL configured
- [ ] No hardcoded secrets in code

### Backend
- [ ] Backend starts without errors
- [ ] `/health` endpoint returns 200
- [ ] All API endpoints tested
- [ ] Database migrations run
- [ ] CORS configured for production domain

### Frontend
- [ ] Frontend builds successfully (`npm run build`)
- [ ] `VITE_API_URL` points to production API
- [ ] No console errors in production build
- [ ] All routes accessible

### Database
- [ ] MongoDB accessible from production server
- [ ] Database backups configured
- [ ] Indexes created
- [ ] Connection pooling configured

### Security
- [ ] HTTPS enabled
- [ ] Rate limiting active
- [ ] Input validation working
- [ ] Authentication tested
- [ ] Authorization tested
- [ ] Helmet.js security headers active

---

## 🚀 Production Deployment Steps

### 1. Update Environment Variables

**Backend** (`backend/.env`):
```env
MONGO_URI=mongodb://<production-host>:<port>/healthvillage
JWT_SECRET=<strong-random-secret-32-chars-minimum>
FRONTEND_URL=https://your-production-domain.com
NODE_ENV=production
PORT=5000
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=https://api.your-production-domain.com/api
```

### 2. Build Frontend

```bash
cd frontend
npm run build
# Output in frontend/dist/
```

### 3. Deploy Backend

```bash
cd backend
npm install --production
npm start
```

### 4. Deploy Frontend

Upload `frontend/dist/` to your hosting provider:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Your own server

### 5. Run Health Check

```bash
# Update health check URLs to production
node health-check.js
```

### 6. Monitor

- Check application logs
- Monitor error rates
- Test critical user flows
- Verify database connections

---

## 📞 Support

If health checks continue to fail:

1. **Check Logs**:
   - Backend: Terminal output
   - Frontend: Browser console (F12)
   - MongoDB: MongoDB logs

2. **Verify Prerequisites**:
   - Node.js 16+ installed
   - MongoDB running
   - Ports 5000 and 5173 available

3. **Review Documentation**:
   - `QUICK_START_GUIDE.md`
   - `ALL_TASKS_SUMMARY.md`
   - `CORS_FIX.md`

4. **Common Commands**:
   ```bash
   # Check Node version
   node --version
   
   # Check MongoDB status
   mongosh --eval "db.version()"
   
   # Check running processes
   netstat -ano | findstr :5000
   netstat -ano | findstr :5173
   ```

---

## 🎯 Success Criteria

Your system is ready for deployment when:

✅ All health checks return **PASS**
✅ No **FAIL** status in any component
✅ Warnings addressed or documented
✅ Manual testing completed
✅ Production environment variables set
✅ Database backups configured
✅ Monitoring in place

---

## 📝 Notes

- **Non-Intrusive**: Scripts only read and test, never modify code
- **Safe to Run**: Can be run multiple times without side effects
- **Quick**: Completes in 10-30 seconds
- **Comprehensive**: Tests all critical components
- **Production-Ready**: Validates deployment readiness

---

**Last Updated**: 2026-02-11
**Version**: 1.0.0
**Status**: Production Ready ✅
