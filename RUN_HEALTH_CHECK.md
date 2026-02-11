# 🏥 Run Health Check - Quick Start

## 🚀 Run This Now!

### Option 1: Node.js Script (Recommended)

```bash
node health-check.js
```

### Option 2: PowerShell (Windows)

```powershell
.\health-check.ps1
```

---

## ⚡ What to Expect

The script will check:
1. ✅ Environment configuration
2. ✅ Backend API (port 5000)
3. ✅ Frontend app (port 5173)
4. ✅ MongoDB connection
5. ✅ Security settings

**Time**: 10-30 seconds

---

## 📊 Reading the Results

### ✅ All Green - You're Ready!
```
🎉 ALL SYSTEMS GO! Ready for deployment.
```
**Action**: Proceed with deployment

### ⚠️ Yellow Warnings - Review Needed
```
⚠️ MOSTLY READY - Review warnings before deployment.
```
**Action**: Check warnings, fix if critical

### ❌ Red Errors - Fix Required
```
❌ NOT READY - Fix critical issues before deployment.
```
**Action**: Fix errors, re-run health check

---

## 🔧 Quick Fixes

### Backend Not Running?
```bash
cd backend
npm run dev
```

### Frontend Not Running?
```bash
cd frontend
npm run dev
```

### MongoDB Not Running?
```bash
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

---

## 📖 Need More Help?

- **Detailed Guide**: `PRE_FLIGHT_CHECK.md`
- **Quick Reference**: `DEPLOYMENT_CHECKLIST.md`
- **Full Summary**: `HEALTH_CHECK_SUMMARY.md`

---

## ✅ Success Looks Like This

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
✅ Environment Mode: Production mode

📋 Backend API Health
----------------------------------------------------------------------
✅ Port 5000: In use (backend likely running)
✅ Health Endpoint: /health returns 200
✅ Health Status: Server reports OK

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
✅ JWT Secret: Strong secret configured
✅ CORS Origin: Configured
✅ Production Mode: NODE_ENV=production

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

**Ready? Run the health check now!**

```bash
node health-check.js
```
