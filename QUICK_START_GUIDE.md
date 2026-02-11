# Quick Start Guide - Healthcare System

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ installed
- MongoDB running locally or connection string ready
- Git installed

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Environment Setup

**Backend** (`backend/.env`):
```env
MONGODB_URI=mongodb://localhost:27017/healthcare
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start Development Servers

**Terminal 1 - Backend**:
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
```

### 4. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/health

---

## 📚 Key Features

### For Patients
- ✅ Book appointments with doctors
- ✅ Reschedule existing appointments
- ✅ Cancel appointments
- ✅ View appointment history
- ✅ Search and filter appointments

### For Doctors
- ✅ View patient appointments
- ✅ Manage weekly availability
- ✅ Add/edit/delete time slots
- ✅ Enable/disable specific days
- ✅ View patient information

### For Admins
- ✅ View system statistics
- ✅ Manage users
- ✅ View all appointments
- ✅ Monitor system health
- ✅ View recent activity

---

## 🔐 Test Accounts

Create test accounts using the registration page or use these sample credentials:

**Patient**:
```
Email: patient@test.com
Password: Patient123
```

**Doctor**:
```
Email: doctor@test.com
Password: Doctor123
```

**Admin**:
```
Email: admin@test.com
Password: Admin123
```

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Users
- `GET /api/users` - List all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/doctors/list` - List all doctors

### Appointments
- `GET /api/appointments/patient` - Get patient's appointments
- `GET /api/appointments/doctor` - Get doctor's appointments
- `POST /api/appointments` - Book new appointment
- `PUT /api/appointments/:id` - Reschedule appointment
- `PATCH /api/appointments/:id/cancel` - Cancel appointment

### Availability
- `GET /api/availability/me` - Get own availability
- `GET /api/availability/doctor` - Get doctor availability
- `PUT /api/availability/doctor` - Update availability
- `PATCH /api/availability/:id` - Update specific slot
- `DELETE /api/availability/:id` - Delete specific slot

---

## 🛠️ Development Tips

### Frontend Structure
```
frontend/src/
├── components/
│   ├── layout/          # Layout components
│   ├── shared/          # Reusable components
│   └── ui/              # UI primitives
├── pages/
│   ├── patient/         # Patient pages
│   ├── doctor/          # Doctor pages
│   └── admin/           # Admin pages
├── lib/
│   ├── api.ts           # API client
│   ├── constants.ts     # App constants
│   └── helpers.ts       # Utility functions
└── hooks/               # Custom React hooks
```

### Backend Structure
```
backend/src/
├── modules/
│   ├── auth/            # Authentication
│   ├── users/           # User management
│   ├── appointments/    # Appointments
│   └── availability/    # Doctor availability
├── middleware/
│   ├── auth.middleware.js
│   ├── rbac.middleware.js
│   ├── validation.middleware.js
│   ├── rateLimiter.middleware.js
│   └── errorHandler.middleware.js
├── models/              # Mongoose models
└── utils/               # Utilities
```

### Key Files to Know

**Constants** (`frontend/src/lib/constants.ts`):
- TIME_SLOTS - Available appointment times
- APPOINTMENT_STATUS - Status values
- VALIDATION - Input validation rules
- TOAST_MESSAGES - User feedback messages

**Helpers** (`frontend/src/lib/helpers.ts`):
- formatDate(), formatTime() - Date formatting
- validateReason() - Input validation
- parseErrorMessage() - Error handling

**API Client** (`frontend/src/lib/api.ts`):
- Handles all HTTP requests
- Auto-attaches JWT token
- Auto-redirects on 401

---

## 🐛 Common Issues

### Issue: "Cannot connect to MongoDB"
**Solution**: Make sure MongoDB is running:
```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
```

### Issue: "CORS error"
**Solution**: Check that CORS_ORIGIN in backend .env matches frontend URL

### Issue: "JWT token invalid"
**Solution**: Clear localStorage and login again:
```javascript
localStorage.clear()
```

### Issue: "Port already in use"
**Solution**: Kill the process or change port:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

---

## 📝 Making Changes

### Adding a New Constant
1. Add to `frontend/src/lib/constants.ts`
2. Export as const
3. Use throughout the app

### Adding a New Helper Function
1. Add to `frontend/src/lib/helpers.ts`
2. Add TypeScript types
3. Export the function

### Adding a New API Endpoint
1. Create route in `backend/src/modules/[module]/[module].routes.js`
2. Add controller in `[module].controller.js`
3. Add service logic in `[module].service.js`
4. Add validation in `backend/src/middleware/validation.middleware.js`

### Adding a New Page
1. Create component in `frontend/src/pages/[role]/`
2. Add route in `frontend/src/App.tsx`
3. Use DashboardLayout wrapper
4. Add loading/empty/error states

---

## 🧪 Testing

### Manual Testing Checklist

**Patient Flow**:
1. Register as patient
2. Login
3. Book appointment
4. Reschedule appointment
5. Cancel appointment

**Doctor Flow**:
1. Register as doctor
2. Login
3. Set availability
4. View appointments
5. Update availability

**Admin Flow**:
1. Login as admin
2. View dashboard
3. View users
4. View appointments

---

## 📦 Production Deployment

### 1. Build Frontend
```bash
cd frontend
npm run build
# Output in frontend/dist/
```

### 2. Set Production Environment Variables
```env
NODE_ENV=production
MONGODB_URI=<production-mongodb-uri>
JWT_SECRET=<strong-random-secret>
CORS_ORIGIN=<production-frontend-url>
```

### 3. Start Backend
```bash
cd backend
npm start
```

### 4. Deploy Frontend
- Upload `frontend/dist/` to hosting (Vercel, Netlify, etc.)
- Set VITE_API_URL to production backend URL

---

## 📖 Documentation

- `TASK_3_COMPLETE.md` - Frontend polish details
- `FRONTEND_POLISH_COMPLETE.md` - Frontend improvements
- `ALL_TASKS_SUMMARY.md` - Complete overview
- `SECURITY_HARDENING_COMPLETE.md` - Security details
- `backend/API_QUICK_REFERENCE.md` - API documentation

---

## 🆘 Need Help?

1. Check the documentation files
2. Review the code comments
3. Check console for errors
4. Verify environment variables
5. Check MongoDB connection

---

## ✅ System Status

- ✅ Backend: Functional & Secure
- ✅ Frontend: Polished & Responsive
- ✅ API: Complete & Documented
- ✅ Security: Production-grade
- ✅ UX: Professional quality

**Ready for production deployment!**
