# 🚀 Production Deployment Guide - HealthVillage

## Production Readiness Audit - Complete ✅

---

## 📊 Audit Summary

### ✅ CORS Configuration - READY
**Status**: Dynamic and production-ready

**Current Configuration** (`backend/src/server.js`):
```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,  // ✅ Dynamic production URL
].filter(Boolean);
```

**Verdict**: ✅ **PRODUCTION READY**
- CORS reads from `FRONTEND_URL` environment variable
- Will automatically accept your production frontend URL
- No code changes needed

---

### ✅ Package.json Scripts - READY

**Backend** (`backend/package.json`):
```json
{
  "scripts": {
    "start": "node src/server.js",  // ✅ Uses node (not nodemon)
    "dev": "node src/server.js"
  }
}
```
**Verdict**: ✅ **PRODUCTION READY** - Uses `node` for production

**Frontend** (`frontend/package.json`):
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",  // ✅ Build script present
    "preview": "vite preview"
  }
}
```
**Verdict**: ✅ **PRODUCTION READY** - Build script configured

---

### ⚠️ Console Logs - NEEDS ATTENTION

**Found Console Statements**:

1. **Server Startup** (`backend/src/server.js`):
   ```javascript
   console.log('✅ Connected to MongoDB');
   console.log(`✅ Server running on http://localhost:${PORT}`);
   console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
   ```
   **Verdict**: ✅ **ACCEPTABLE** - Startup logs are useful for debugging

2. **Error Handlers** (`backend/src/server.js`):
   ```javascript
   console.error('❌ Server startup failed:', error.message);
   console.error('UNHANDLED REJECTION! Shutting down...');
   console.error('UNCAUGHT EXCEPTION! Shutting down...');
   ```
   **Verdict**: ✅ **ACCEPTABLE** - Critical error logs needed for monitoring

3. **Development-Only Logs** (`backend/src/modules/auth/auth.service.js`):
   ```javascript
   if (process.env.NODE_ENV === 'development') {
     console.log(`[DEV ONLY] Password reset token for ${email}: ${resetToken}`);
   }
   ```
   **Verdict**: ✅ **SAFE** - Already guarded by NODE_ENV check

4. **Error Handler** (`backend/src/middleware/errorHandler.middleware.js`):
   ```javascript
   if (statusCode >= 500) {
     console.error('ERROR:', {
       message: err.message,
       stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
     });
   }
   ```
   **Verdict**: ✅ **SAFE** - Stack traces only in development

**Overall Verdict**: ✅ **PRODUCTION SAFE**
- All sensitive logs are guarded by `NODE_ENV` checks
- Error logs are appropriate for production monitoring
- No security-sensitive information exposed

---

### ✅ Error Handling - EXCELLENT

**Stack Trace Protection**:
```javascript
// Only include stack trace in development mode
if (process.env.NODE_ENV === 'development' && statusCode >= 500) {
  response.stack = err.stack;
}
```

**Verdict**: ✅ **PRODUCTION READY**
- Stack traces suppressed in production
- Generic error messages for clients
- Detailed logs server-side only

---

## 🔑 Environment Variables Mapping

### Backend Environment Variables

**Required for Production**:

| Variable Name | Purpose | Example Value | Required |
|--------------|---------|---------------|----------|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/healthvillage` | ✅ YES |
| `JWT_SECRET` | JWT signing secret | `<generate-strong-32-char-secret>` | ✅ YES |
| `FRONTEND_URL` | Production frontend URL | `https://healthvillage.vercel.app` | ✅ YES |
| `NODE_ENV` | Environment mode | `production` | ✅ YES |
| `PORT` | Server port | `5000` (auto-assigned by host) | ⚠️ Optional |

**Optional (Legacy - Not Used)**:
| Variable Name | Purpose | Status |
|--------------|---------|--------|
| `DB_HOST` | MySQL host | ❌ Not used (using MongoDB) |
| `DB_USER` | MySQL user | ❌ Not used (using MongoDB) |
| `DB_PASSWORD` | MySQL password | ❌ Not used (using MongoDB) |
| `DB_NAME` | MySQL database | ❌ Not used (using MongoDB) |

### Frontend Environment Variables

**Required for Production**:

| Variable Name | Purpose | Example Value | Required |
|--------------|---------|---------------|----------|
| `VITE_API_URL` | Backend API URL | `https://healthvillage-api.onrender.com/api` | ✅ YES |

---

## 📋 Hosting Provider Setup Checklist

### Option 1: Vercel (Frontend) + Render (Backend)

#### Frontend Deployment (Vercel)

**Step 1: Connect Repository**
- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Click "New Project"
- [ ] Import your Git repository
- [ ] Select `frontend` as root directory

**Step 2: Configure Build Settings**
- [ ] Framework Preset: `Vite`
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Install Command: `npm install`

**Step 3: Add Environment Variables**
```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

**Step 4: Deploy**
- [ ] Click "Deploy"
- [ ] Wait for build to complete
- [ ] Note your frontend URL (e.g., `https://healthvillage.vercel.app`)

---

#### Backend Deployment (Render)

**Step 1: Create Web Service**
- [ ] Go to [render.com](https://render.com)
- [ ] Click "New +" → "Web Service"
- [ ] Connect your Git repository
- [ ] Select `backend` as root directory

**Step 2: Configure Service**
- [ ] Name: `healthvillage-backend`
- [ ] Environment: `Node`
- [ ] Region: Choose closest to your users
- [ ] Branch: `main` (or your default branch)
- [ ] Root Directory: `backend`
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`

**Step 3: Add Environment Variables**

Click "Environment" tab and add:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/healthvillage
JWT_SECRET=<generate-strong-secret-see-below>
FRONTEND_URL=https://healthvillage.vercel.app
NODE_ENV=production
```

**Step 4: Deploy**
- [ ] Click "Create Web Service"
- [ ] Wait for deployment
- [ ] Note your backend URL (e.g., `https://healthvillage-api.onrender.com`)

**Step 5: Update Frontend**
- [ ] Go back to Vercel
- [ ] Update `VITE_API_URL` with your Render backend URL
- [ ] Redeploy frontend

---

### Option 2: Railway (Full Stack)

#### Backend Deployment

**Step 1: Create New Project**
- [ ] Go to [railway.app](https://railway.app)
- [ ] Click "New Project"
- [ ] Select "Deploy from GitHub repo"
- [ ] Choose your repository

**Step 2: Configure Backend Service**
- [ ] Click "Add Service" → "GitHub Repo"
- [ ] Root Directory: `backend`
- [ ] Start Command: `npm start`

**Step 3: Add Environment Variables**

In Railway dashboard, add:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/healthvillage
JWT_SECRET=<generate-strong-secret>
FRONTEND_URL=https://healthvillage.up.railway.app
NODE_ENV=production
```

**Step 4: Generate Domain**
- [ ] Click "Settings" → "Generate Domain"
- [ ] Note your backend URL

---

#### Frontend Deployment

**Step 1: Add Frontend Service**
- [ ] Click "New Service" → "GitHub Repo"
- [ ] Root Directory: `frontend`
- [ ] Build Command: `npm run build`
- [ ] Start Command: `npm run preview`

**Step 2: Add Environment Variables**

```
VITE_API_URL=https://your-backend-url.railway.app/api
```

**Step 3: Generate Domain**
- [ ] Click "Settings" → "Generate Domain"
- [ ] Note your frontend URL

**Step 4: Update Backend CORS**
- [ ] Go to backend service
- [ ] Update `FRONTEND_URL` with your frontend Railway URL
- [ ] Redeploy backend

---

### Option 3: Heroku (Full Stack)

#### Backend Deployment

**Step 1: Create App**
```bash
heroku create healthvillage-backend
```

**Step 2: Set Environment Variables**
```bash
heroku config:set MONGO_URI="mongodb+srv://..." -a healthvillage-backend
heroku config:set JWT_SECRET="<strong-secret>" -a healthvillage-backend
heroku config:set FRONTEND_URL="https://healthvillage-frontend.herokuapp.com" -a healthvillage-backend
heroku config:set NODE_ENV="production" -a healthvillage-backend
```

**Step 3: Deploy**
```bash
git subtree push --prefix backend heroku main
```

---

#### Frontend Deployment

**Step 1: Create App**
```bash
heroku create healthvillage-frontend
```

**Step 2: Add Buildpack**
```bash
heroku buildpacks:set heroku/nodejs -a healthvillage-frontend
```

**Step 3: Set Environment Variables**
```bash
heroku config:set VITE_API_URL="https://healthvillage-backend.herokuapp.com/api" -a healthvillage-frontend
```

**Step 4: Deploy**
```bash
git subtree push --prefix frontend heroku main
```

---

## 🔐 Generate Strong JWT Secret

**Method 1: Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Method 2: OpenSSL**
```bash
openssl rand -hex 32
```

**Method 3: PowerShell**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**Method 4: Online Generator**
- Visit: https://randomkeygen.com/
- Use "CodeIgniter Encryption Keys" (256-bit)

---

## 🗄️ MongoDB Atlas Setup

**Step 1: Create Cluster**
- [ ] Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- [ ] Create free cluster
- [ ] Choose region closest to your backend

**Step 2: Create Database User**
- [ ] Go to "Database Access"
- [ ] Add new database user
- [ ] Note username and password

**Step 3: Whitelist IP**
- [ ] Go to "Network Access"
- [ ] Add IP Address: `0.0.0.0/0` (allow from anywhere)
- [ ] Or add your hosting provider's IPs

**Step 4: Get Connection String**
- [ ] Click "Connect" on your cluster
- [ ] Choose "Connect your application"
- [ ] Copy connection string
- [ ] Replace `<password>` with your database password
- [ ] Replace `<dbname>` with `healthvillage`

**Example**:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/healthvillage?retryWrites=true&w=majority
```

---

## ✅ Pre-Deployment Checklist

### Code Preparation
- [ ] All code committed to Git
- [ ] `.env` files NOT committed (in `.gitignore`)
- [ ] `node_modules` NOT committed (in `.gitignore`)
- [ ] No hardcoded secrets in code
- [ ] All dependencies in `package.json`

### Environment Variables
- [ ] `MONGO_URI` - Production MongoDB connection string
- [ ] `JWT_SECRET` - Strong 32+ character secret
- [ ] `FRONTEND_URL` - Production frontend URL
- [ ] `NODE_ENV=production` - Set to production
- [ ] `VITE_API_URL` - Production backend API URL

### Database
- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] Network access configured
- [ ] Connection string tested

### Testing
- [ ] Local health check passed
- [ ] All features tested locally
- [ ] No console errors in browser
- [ ] API endpoints tested

---

## 🚀 Deployment Steps (Summary)

### Phase 1: Database Setup
1. Create MongoDB Atlas cluster
2. Create database user
3. Whitelist IPs
4. Get connection string

### Phase 2: Backend Deployment
1. Choose hosting provider (Render/Railway/Heroku)
2. Connect Git repository
3. Configure build settings
4. Add environment variables
5. Deploy
6. Note backend URL

### Phase 3: Frontend Deployment
1. Choose hosting provider (Vercel/Railway/Heroku)
2. Connect Git repository
3. Configure build settings
4. Add `VITE_API_URL` with backend URL
5. Deploy
6. Note frontend URL

### Phase 4: CORS Configuration
1. Update backend `FRONTEND_URL` with frontend URL
2. Redeploy backend
3. Test CORS (no errors in browser console)

### Phase 5: Verification
1. Visit frontend URL
2. Test user registration
3. Test user login
4. Test appointment booking
5. Check for errors in browser console
6. Check backend logs

---

## 🔍 Post-Deployment Verification

### Frontend Checks
- [ ] Application loads without errors
- [ ] All pages accessible
- [ ] No console errors (F12)
- [ ] Images and assets load
- [ ] Routing works correctly

### Backend Checks
- [ ] Health endpoint responds: `https://your-backend-url/health`
- [ ] API endpoints accessible
- [ ] Authentication works
- [ ] Database operations work
- [ ] No CORS errors

### Integration Checks
- [ ] User registration works
- [ ] User login works
- [ ] Patient can book appointment
- [ ] Doctor can set availability
- [ ] Admin dashboard loads
- [ ] Data persists correctly

---

## 🐛 Common Deployment Issues

### Issue: CORS Errors After Deployment

**Symptoms**: Browser console shows "CORS policy" errors

**Solution**:
1. Check `FRONTEND_URL` in backend environment variables
2. Ensure it matches your frontend URL exactly (including https://)
3. No trailing slash in URL
4. Redeploy backend after changing

---

### Issue: "Cannot GET /" on Backend

**Symptoms**: Backend URL shows "Cannot GET /"

**Solution**: This is normal! Backend has no root route.
- Test health endpoint: `https://your-backend-url/health`
- Should return: `{"status":"ok","timestamp":"..."}`

---

### Issue: Frontend Shows "Network Error"

**Symptoms**: API calls fail with network error

**Solution**:
1. Check `VITE_API_URL` in frontend environment variables
2. Ensure backend is deployed and running
3. Test backend health endpoint
4. Check backend logs for errors

---

### Issue: MongoDB Connection Failed

**Symptoms**: Backend logs show "MongoDB connection failed"

**Solution**:
1. Check `MONGO_URI` is correct
2. Verify database user credentials
3. Check network access whitelist (0.0.0.0/0)
4. Ensure connection string includes database name

---

### Issue: JWT Errors

**Symptoms**: "Invalid token" or "Token expired" errors

**Solution**:
1. Ensure `JWT_SECRET` is set in backend
2. Same secret must be used consistently
3. Clear browser localStorage and login again
4. Check token expiration time

---

## 📊 Environment Variables Quick Reference

### Backend (5 variables)
```bash
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/healthvillage
JWT_SECRET=<32-char-strong-secret>
FRONTEND_URL=https://your-frontend-url.com
NODE_ENV=production
PORT=5000  # Optional, auto-assigned by most hosts
```

### Frontend (1 variable)
```bash
VITE_API_URL=https://your-backend-url.com/api
```

---

## 🎯 Success Criteria

Your deployment is successful when:

✅ Frontend loads at production URL
✅ Backend health endpoint responds
✅ No CORS errors in browser console
✅ User can register and login
✅ All features work as in development
✅ Data persists in MongoDB
✅ No errors in production logs

---

## 📞 Support Resources

- **MongoDB Atlas**: https://docs.atlas.mongodb.com/
- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **Railway Docs**: https://docs.railway.app/
- **Heroku Docs**: https://devcenter.heroku.com/

---

**Last Updated**: 2026-02-11
**Status**: Production Ready ✅
**Deployment Time**: ~30-45 minutes
