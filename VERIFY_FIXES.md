# Verification Checklist - Backend Fixes

## 🎯 Quick Verification (5 minutes)

### 1. Start Backend
```bash
cd backend
npm start
```

Expected output:
```
✅ Connected to MongoDB
✅ Server running on http://localhost:5000
```

### 2. Health Check
```bash
curl http://localhost:5000/health
```

Expected: `{"status":"ok"}`

### 3. Test New Endpoints

#### A. List Doctors (NEW ✅)
```bash
# Register and login first to get token
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"password123","role":"patient"}'

curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'

# Use token from login response
curl -X GET http://localhost:5000/api/users/doctors/list \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Expected: List of doctors with names ✅

#### B. Appointment with Doctor Name (FIXED ✅)
```bash
curl -X GET http://localhost:5000/api/appointments/patient \
  -H "Authorization: Bearer PATIENT_TOKEN"
```

Expected: Appointments with `doctorName` field ✅

#### C. Reschedule Endpoint (NEW ✅)
```bash
curl -X PUT http://localhost:5000/api/appointments/APPOINTMENT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer PATIENT_TOKEN" \
  -d '{"appointment_date":"2026-02-11","appointment_time":"11:00"}'
```

Expected: Success or ownership error ✅

## 📋 Complete Verification

### A. Appointments (MANDATORY)

#### ✅ GET /api/users/doctors
```bash
# Test endpoint exists
curl -X GET http://localhost:5000/api/users/doctors/list \
  -H "Authorization: Bearer TOKEN"

# Expected: 200 OK with list of doctors
```

#### ✅ Doctor Validation
```bash
# Try to book with invalid doctor ID
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer PATIENT_TOKEN" \
  -d '{"doctor_id":"invalid","appointment_date":"2026-02-10","appointment_time":"10:00","reason":"Test"}'

# Expected: 400 "Doctor not found" or "Invalid doctor"
```

#### ✅ Correct HTTP Methods
```bash
# Test PUT for reschedule
curl -X PUT http://localhost:5000/api/appointments/ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer PATIENT_TOKEN" \
  -d '{"appointment_date":"2026-02-11","appointment_time":"11:00"}'

# Expected: 200 OK or 403 if not owner

# Test PATCH for reschedule (alternative)
curl -X PATCH http://localhost:5000/api/appointments/ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer PATIENT_TOKEN" \
  -d '{"appointment_date":"2026-02-11","appointment_time":"11:00"}'

# Expected: 200 OK or 403 if not owner
```

#### ✅ Reschedule Support
```bash
# Book appointment
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer PATIENT_TOKEN" \
  -d '{"doctor_id":"DOCTOR_ID","appointment_date":"2026-02-10","appointment_time":"10:00","reason":"Test"}'

# Reschedule it
curl -X PUT http://localhost:5000/api/appointments/APPOINTMENT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer PATIENT_TOKEN" \
  -d '{"appointment_date":"2026-02-11","appointment_time":"11:00"}'

# Expected: 200 OK with success message
```

#### ✅ Ownership Authorization
```bash
# Try to reschedule another patient's appointment
curl -X PUT http://localhost:5000/api/appointments/OTHER_PATIENT_APPOINTMENT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer PATIENT_TOKEN" \
  -d '{"appointment_date":"2026-02-11","appointment_time":"11:00"}'

# Expected: 403 "You can only reschedule your own appointments"
```

#### ✅ Human-Readable Data
```bash
# Get patient appointments
curl -X GET http://localhost:5000/api/appointments/patient \
  -H "Authorization: Bearer PATIENT_TOKEN"

# Expected: Response includes "doctorName" field, not just "doctorId"

# Get doctor appointments
curl -X GET http://localhost:5000/api/appointments/doctor \
  -H "Authorization: Bearer DOCTOR_TOKEN"

# Expected: Response includes "patientName" field, not just "patientId"
```

### B. Availability (REALISTIC)

#### ✅ Multiple Time Slots Per Day
```bash
# Add first slot for Monday
curl -X POST http://localhost:5000/api/availability \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer DOCTOR_TOKEN" \
  -d '{"day_of_week":"monday","start_time":"09:00","end_time":"12:00"}'

# Add second slot for Monday
curl -X POST http://localhost:5000/api/availability \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer DOCTOR_TOKEN" \
  -d '{"day_of_week":"monday","start_time":"14:00","end_time":"17:00"}'

# Get availability
curl -X GET http://localhost:5000/api/availability/me \
  -H "Authorization: Bearer DOCTOR_TOKEN"

# Expected: Both slots returned
```

#### ✅ Per-Weekday Schedules
```bash
# Add different schedules for different days
curl -X POST http://localhost:5000/api/availability \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer DOCTOR_TOKEN" \
  -d '{"day_of_week":"monday","start_time":"09:00","end_time":"17:00"}'

curl -X POST http://localhost:5000/api/availability \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer DOCTOR_TOKEN" \
  -d '{"day_of_week":"tuesday","start_time":"10:00","end_time":"16:00"}'

# Expected: Both created successfully
```

#### ✅ Missing Availability APIs
```bash
# GET /me
curl -X GET http://localhost:5000/api/availability/me \
  -H "Authorization: Bearer DOCTOR_TOKEN"
# Expected: 200 OK with own availability

# PATCH /:id
curl -X PATCH http://localhost:5000/api/availability/AVAILABILITY_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer DOCTOR_TOKEN" \
  -d '{"start_time":"08:00","end_time":"16:00"}'
# Expected: 200 OK

# DELETE /:id
curl -X DELETE http://localhost:5000/api/availability/AVAILABILITY_ID \
  -H "Authorization: Bearer DOCTOR_TOKEN"
# Expected: 200 OK
```

#### ✅ Appointment Booking Validates Availability
```bash
# Try to book outside availability
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer PATIENT_TOKEN" \
  -d '{"doctor_id":"DOCTOR_ID","appointment_date":"2026-02-10","appointment_time":"20:00","reason":"Test"}'

# Expected: 409 Conflict with "available_slots" array
```

### C. Users & Dashboards

#### ✅ List Users (Admin)
```bash
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer ADMIN_TOKEN"

# Expected: 200 OK with list of all users
```

#### ✅ Get User by ID
```bash
curl -X GET http://localhost:5000/api/users/USER_ID \
  -H "Authorization: Bearer TOKEN"

# Expected: 200 OK with user details
```

#### ✅ List Doctors
```bash
curl -X GET http://localhost:5000/api/users/doctors/list \
  -H "Authorization: Bearer TOKEN"

# Expected: 200 OK with list of doctors only
```

#### ✅ Admin Dashboard Data
```bash
curl -X GET http://localhost:5000/api/appointments \
  -H "Authorization: Bearer ADMIN_TOKEN"

# Expected: 200 OK with all appointments including doctorName and patientName
```

## 🔍 Code Quality Checks

### ✅ No TODOs
```bash
cd backend/src
grep -r "TODO" .
# Expected: No results
```

### ✅ No Stubs
```bash
cd backend/src
grep -r "stub\|placeholder\|FIXME" .
# Expected: No results
```

### ✅ All Imports Valid
```bash
cd backend
npm start
# Expected: No import errors
```

## 🔐 Security Checks

### ✅ Authentication Required
```bash
# Try without token
curl -X GET http://localhost:5000/api/users/doctors/list

# Expected: 401 Unauthorized
```

### ✅ Role-Based Access
```bash
# Try admin endpoint as patient
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer PATIENT_TOKEN"

# Expected: 403 Forbidden
```

### ✅ Ownership Validation
```bash
# Try to modify another user's data
curl -X PUT http://localhost:5000/api/appointments/OTHER_USER_APPOINTMENT \
  -H "Authorization: Bearer PATIENT_TOKEN" \
  -d '{"appointment_date":"2026-02-11","appointment_time":"11:00"}'

# Expected: 403 "You can only reschedule your own appointments"
```

## 📊 Response Format Checks

### ✅ Correct Status Codes
- 200: Success ✅
- 201: Created ✅
- 400: Bad request ✅
- 401: Unauthorized ✅
- 403: Forbidden ✅
- 404: Not found ✅
- 409: Conflict ✅
- 500: Server error ✅

### ✅ Human-Readable Data
All responses should include names, not just IDs:
- Appointments include `doctorName` and `patientName`
- No raw IDs displayed to users
- Proper date/time formatting

## 🎯 End-to-End Workflow Test

### Complete Flow (15 minutes)
```bash
# 1. Register patient
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Patient","email":"patient@test.com","password":"password123","role":"patient"}'

# 2. Register doctor
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Dr. Smith","email":"doctor@test.com","password":"password123","role":"doctor"}'

# 3. Login both
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"patient@test.com","password":"password123"}'
# Save PATIENT_TOKEN

curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"doctor@test.com","password":"password123"}'
# Save DOCTOR_TOKEN

# 4. Doctor sets availability
curl -X POST http://localhost:5000/api/availability \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer DOCTOR_TOKEN" \
  -d '{"day_of_week":"monday","start_time":"09:00","end_time":"17:00"}'

# 5. Patient lists doctors
curl -X GET http://localhost:5000/api/users/doctors/list \
  -H "Authorization: Bearer PATIENT_TOKEN"
# Save DOCTOR_ID

# 6. Patient books appointment
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer PATIENT_TOKEN" \
  -d '{"doctor_id":"DOCTOR_ID","appointment_date":"2026-02-10","appointment_time":"10:00","reason":"Checkup"}'
# Save APPOINTMENT_ID

# 7. Patient views appointments (should see doctor name)
curl -X GET http://localhost:5000/api/appointments/patient \
  -H "Authorization: Bearer PATIENT_TOKEN"
# Verify: doctorName is present ✅

# 8. Doctor views appointments (should see patient name)
curl -X GET http://localhost:5000/api/appointments/doctor \
  -H "Authorization: Bearer DOCTOR_TOKEN"
# Verify: patientName is present ✅

# 9. Patient reschedules
curl -X PUT http://localhost:5000/api/appointments/APPOINTMENT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer PATIENT_TOKEN" \
  -d '{"appointment_date":"2026-02-11","appointment_time":"11:00"}'
# Verify: 200 OK ✅

# 10. Doctor confirms
curl -X PATCH http://localhost:5000/api/appointments/APPOINTMENT_ID/confirm \
  -H "Authorization: Bearer DOCTOR_TOKEN"
# Verify: 200 OK ✅

# 11. Patient cancels
curl -X PATCH http://localhost:5000/api/appointments/APPOINTMENT_ID/cancel \
  -H "Authorization: Bearer PATIENT_TOKEN"
# Verify: 200 OK ✅
```

## ✅ Final Checklist

- [ ] Backend starts without errors
- [ ] Health check responds
- [ ] GET /api/users/doctors/list works
- [ ] Doctor validation during appointment creation
- [ ] Both PUT and PATCH work for reschedule
- [ ] Reschedule validates ownership
- [ ] Appointments return doctor/patient names
- [ ] Multiple availability slots per day work
- [ ] Availability CRUD endpoints work
- [ ] Admin can view all users
- [ ] Admin can view all appointments
- [ ] No TODOs in code
- [ ] No stubs in code
- [ ] Correct HTTP status codes
- [ ] Security validation works
- [ ] Complete workflow works end-to-end

## 🎉 Success Criteria

All items above should be ✅ checked.

If any item fails, check:
1. `backend/API_TEST_GUIDE.md` for detailed testing
2. `backend/FINAL_VERIFICATION.md` for troubleshooting
3. Console logs for error messages

## 📞 Support

- **Quick Start:** `backend/QUICKSTART_DEVELOPER.md`
- **API Docs:** `backend/API_QUICK_REFERENCE.md`
- **Full Details:** `BACKEND_FIXES_COMPLETE.md`

---

**Status:** Ready for verification ✅
