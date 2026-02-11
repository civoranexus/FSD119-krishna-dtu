# ✅ Production Deployment Checklist

## Quick Reference Card

---

## 🎯 Audit Results

| Component | Status | Notes |
|-----------|--------|-------|
| CORS Configuration | ✅ READY | Dynamic via `FRONTEND_URL` |
| Package.json Scripts | ✅ READY | Uses `node` (not nodemon) |
| Build Scripts | ✅ READY | Frontend has `build` script |
| Console Logs | ✅ SAFE | Guarded by `NODE_ENV` |
| Error Handling | ✅ EXCELLENT | Stack traces suppressed |
| Environment Variables | ✅ DOCUMENTED | See below |

**Overall**: ✅ **PRODUCTION READY - NO CODE CHANGES NEEDED**

---

## 🔑 Environment Variables to Set

### Backend (5 Required)

```bash
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/healthvillage
JWT_SECRET=<generate-32-char-secret>
FRONTEND_URL=https://your-frontend-url.com
NODE_ENV=production
PORT=5000  # Optional
```

### Frontend (1 Required)

```bash
VITE_API_URL=https://your-backend-url.com/api
```

---

## 🚀 Deployment Steps

### 1. Setup MongoDB Atlas (10 min)
- [ ] Create free cluster at mongodb.com/cloud/atlas
- [ ] Create database user
- [ ] Whitelist IP: `0.0.0.0/0`
- [ ] Copy connection string

### 2. Generate JWT Secret (1 min)
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Deploy Backend (15 min)

**Render.com**:
- [ ] New Web Service → Connect repo
- [ ] Root Directory: `backend`
- [ ] Build: `npm install`
- [ ] Start: `npm start`
- [ ] Add 5 environment variables (see above)
- [ ] Deploy
- [ ] Copy backend URL

**Railway.app**:
- [ ] New Project → Deploy from GitHub
- [ ] Add Service → Select `backend` folder
- [ ] Add 5 environment variables
- [ ] Generate domain
- [ ] Copy backend URL

### 4. Deploy Frontend (10 min)

**Vercel.com**:
- [ ] New Project → Import repo
- [ ] Root Directory: `frontend`
- [ ] Framework: Vite
- [ ] Build: `npm run build`
- [ ] Output: `dist`
- [ ] Add `VITE_API_URL` (use backend URL + `/api`)
- [ ] Deploy
- [ ] Copy frontend URL

**Railway.app**:
- [ ] Add Service → Select `frontend` folder
- [ ] Build: `npm run build`
- [ ] Start: `npm run preview`
- [ ] Add `VITE_API_URL`
- [ ] Generate domain
- [ ] Copy frontend URL

### 5. Update CORS (5 min)
- [ ] Go to backend hosting dashboard
- [ ] Update `FRONTEND_URL` with frontend URL
- [ ] Redeploy backend

### 6. Test (5 min)
- [ ] Visit frontend URL
- [ ] Open browser console (F12)
- [ ] Test registration
- [ ] Test login
- [ ] Check for errors

---

## 🔍 Quick Verification

### Test Backend Health
```bash
curl https://your-backend-url.com/health
# Expected: {"status":"ok","timestamp":"..."}
```

### Test Frontend
```bash
curl https://your-frontend-url.com
# Expected: HTML with "HealthVillage"
```

### Check CORS
1. Open frontend in browser
2. Press F12 (DevTools)
3. Go to Console tab
4. Should see NO CORS errors

---

## 🐛 Common Issues & Fixes

### CORS Errors
**Fix**: Update `FRONTEND_URL` in backend, redeploy

### "Cannot GET /"
**Fix**: Normal! Test `/health` endpoint instead

### Network Error
**Fix**: Check `VITE_API_URL` in frontend env vars

### MongoDB Connection Failed
**Fix**: Check `MONGO_URI`, verify IP whitelist

---

## 📊 Hosting Provider Dashboard Steps

### Vercel (Frontend)
1. Environment Variables → Add Variable
2. Name: `VITE_API_URL`
3. Value: `https://your-backend-url.com/api`
4. Save → Redeploy

### Render (Backend)
1. Environment → Add Environment Variable
2. Add all 5 variables (see above)
3. Save Changes → Auto redeploys

### Railway (Both)
1. Variables tab
2. Add variables
3. Save → Auto redeploys

---

## ✅ Success Checklist

- [ ] MongoDB Atlas cluster created
- [ ] JWT secret generated (32+ chars)
- [ ] Backend deployed with 5 env vars
- [ ] Frontend deployed with 1 env var
- [ ] CORS configured (FRONTEND_URL set)
- [ ] Health endpoint responds
- [ ] Frontend loads without errors
- [ ] No CORS errors in console
- [ ] User registration works
- [ ] User login works
- [ ] Appointments work

---

## 🎯 Expected Results

### Backend URL
```
https://healthvillage-api.onrender.com
```

### Frontend URL
```
https://healthvillage.vercel.app
```

### Health Check
```json
{
  "status": "ok",
  "timestamp": "2026-02-11T..."
}
```

---

## 📞 Quick Links

- **Full Guide**: `PRODUCTION_DEPLOYMENT_GUIDE.md`
- **MongoDB Atlas**: https://mongodb.com/cloud/atlas
- **Vercel**: https://vercel.com
- **Render**: https://render.com
- **Railway**: https://railway.app

---

**Deployment Time**: ~45 minutes
**Difficulty**: Easy
**Status**: ✅ Ready to Deploy
