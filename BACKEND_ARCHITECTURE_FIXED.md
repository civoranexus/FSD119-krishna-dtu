# Backend Architecture - Fixed & Production Ready

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│                    (React + TypeScript)                          │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTP/REST + JWT
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY                                 │
│                   (Express Router)                               │
│                  http://localhost:5000/api                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│     AUTH     │  │    USERS     │  │ APPOINTMENTS │
│   Module     │  │   Module     │  │   Module     │
│              │  │              │  │              │
│ • Register   │  │ • List All   │  │ • Create     │
│ • Login      │  │ • Get by ID  │  │ • List       │
│ • Forgot PW  │  │ • List Docs  │  │ • Reschedule │
│ • Reset PW   │  │              │  │ • Confirm    │
│              │  │              │  │ • Complete   │
│              │  │              │  │ • Cancel     │
└──────────────┘  └──────────────┘  └──────────────┘
        │                │                │
        └────────────────┼────────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │      AVAILABILITY Module       │
        │                                │
        │ • Add Slot                     │
        │ • Get Own                      │
        │ • Get Doctor's                 │
        │ • Update Slot                  │
        │ • Delete Slot                  │
        └────────────────┬───────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│     AUTH     │  │     RBAC     │  │  VALIDATION  │
│  Middleware  │  │  Middleware  │  │   Layer      │
│              │  │              │  │              │
│ • JWT Verify │  │ • Admin      │  │ • Doctor     │
│ • Extract    │  │ • Doctor     │  │   Exists     │
│   User       │  │ • Patient    │  │ • Ownership  │
│              │  │              │  │ • Time Valid │
└──────────────┘  └──────────────┘  └──────────────┘
        │                │                │
        └────────────────┼────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                  │
│                     (MongoDB)                                    │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │    Users     │  │ Appointments │  │ DoctorAvailability   │  │
│  │              │  │              │  │                      │  │
│  │ • _id        │  │ • _id        │  │ • _id                │  │
│  │ • name       │  │ • patientId  │  │ • doctorId           │  │
│  │ • email      │  │ • doctorId   │  │ • day_of_week        │  │
│  │ • password   │  │ • date       │  │ • start_time         │  │
│  │ • role       │  │ • time       │  │ • end_time           │  │
│  │              │  │ • reason     │  │                      │  │
│  │              │  │ • status     │  │                      │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Request Flow

### 1. Appointment Booking Flow
```
Patient → POST /api/appointments
    ↓
[Auth Middleware] → Verify JWT token
    ↓
[RBAC Middleware] → Check role = 'patient'
    ↓
[Appointments Controller] → createAppointmentHandler
    ↓
[Appointments Service] → createAppointment
    ↓
[Validation] → Doctor exists? ✅
    ↓         → Doctor role? ✅
    ↓         → Future date? ✅
    ↓         → Available? ✅
    ↓
[Database] → Insert appointment
    ↓
[Response] → 201 Created with appointmentId
```

### 2. View Appointments Flow (with Names)
```
Patient → GET /api/appointments/patient
    ↓
[Auth Middleware] → Verify JWT token
    ↓
[RBAC Middleware] → Check role = 'patient'
    ↓
[Appointments Controller] → getPatientAppointmentsHandler
    ↓
[Appointments Service] → getAppointmentsForPatient
    ↓
[Database] → Find appointments by patientId
    ↓
[Enrichment] → Lookup doctor names (Promise.all)
    ↓
[Response] → 200 OK with appointments + doctor names ✅
```

### 3. Reschedule Flow (with Validation)
```
Patient → PUT /api/appointments/:id
    ↓
[Auth Middleware] → Verify JWT token
    ↓
[RBAC Middleware] → Check role = 'patient'
    ↓
[Appointments Controller] → rescheduleAppointmentHandler
    ↓
[Appointments Service] → rescheduleAppointment
    ↓
[Validation] → Appointment exists? ✅
    ↓         → Patient owns it? ✅
    ↓         → Future date? ✅
    ↓         → Doctor available? ✅
    ↓
[Database] → Update appointment
    ↓
[Response] → 200 OK or 409 Conflict with available slots
```

## Module Structure

### Users Module (NEW ✅)
```
backend/src/modules/users/
├── users.service.js       # Business logic
│   ├── getAllUsers()      # Admin: list all users
│   ├── getUserById()      # Get user details
│   └── getAllDoctors()    # List all doctors
├── users.controller.js    # HTTP handlers
│   ├── getAllUsersHandler()
│   ├── getUserByIdHandler()
│   └── getAllDoctorsHandler()
└── users.routes.js        # Route definitions
    ├── GET /
    ├── GET /:id
    └── GET /doctors/list
```

### Appointments Module (ENHANCED ✅)
```
backend/src/modules/appointments/
├── appointments.service.js
│   ├── createAppointment()           # With doctor validation ✅
│   ├── getAppointmentsForPatient()   # With doctor names ✅
│   ├── getAppointmentsForDoctor()    # With patient names ✅
│   ├── getAllAppointments()          # NEW: Admin view ✅
│   ├── rescheduleAppointment()       # NEW: With ownership ✅
│   ├── cancelAppointment()           # ENHANCED: With ownership ✅
│   └── updateAppointmentStatus()
├── appointments.controller.js
│   ├── createAppointmentHandler()
│   ├── getPatientAppointmentsHandler()
│   ├── getDoctorAppointmentsHandler()
│   ├── getAllAppointmentsHandler()   # NEW ✅
│   ├── rescheduleAppointmentHandler() # NEW ✅
│   ├── confirmAppointmentHandler()
│   ├── completeAppointmentHandler()
│   └── cancelAppointmentHandler()
└── appointments.routes.js
    ├── POST /                        # Create
    ├── GET /patient                  # Patient's appointments
    ├── GET /doctor                   # Doctor's appointments
    ├── GET /                         # NEW: Admin view ✅
    ├── PUT /:id                      # NEW: Reschedule ✅
    ├── PATCH /:id                    # NEW: Reschedule alt ✅
    ├── PATCH /:id/confirm
    ├── PATCH /:id/complete
    └── PATCH /:id/cancel
```

### Availability Module (ENHANCED ✅)
```
backend/src/modules/availability/
├── availability.service.js
│   ├── addAvailability()             # With validation ✅
│   ├── getAvailabilityByDoctor()     # With IDs ✅
│   ├── getMyAvailability()           # NEW ✅
│   ├── updateAvailability()          # NEW: With ownership ✅
│   └── deleteAvailability()          # NEW: With ownership ✅
├── availability.controller.js
│   ├── addAvailabilityHandler()
│   ├── getDoctorAvailabilityHandler()
│   ├── getMyAvailabilityHandler()    # NEW ✅
│   ├── updateAvailabilityHandler()   # NEW ✅
│   └── deleteAvailabilityHandler()   # NEW ✅
└── availability.routes.js
    ├── POST /                        # Add slot
    ├── GET /me                       # NEW: Own availability ✅
    ├── GET /:doctorId                # Doctor's availability
    ├── PATCH /:id                    # NEW: Update slot ✅
    └── DELETE /:id                   # NEW: Delete slot ✅
```

## Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    REQUEST                                   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Layer 1: Authentication                         │
│              (auth.middleware.js)                            │
│                                                              │
│  • Verify JWT token exists                                  │
│  • Verify token is valid                                    │
│  • Extract user info (id, role)                             │
│  • Attach to req.user                                       │
│                                                              │
│  ❌ No token → 401 Unauthorized                             │
│  ❌ Invalid token → 401 Unauthorized                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Layer 2: Authorization                          │
│              (rbac.middleware.js)                            │
│                                                              │
│  • Check user role                                          │
│  • Compare with allowed roles                               │
│  • Allow or deny access                                     │
│                                                              │
│  ❌ Wrong role → 403 Forbidden                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Layer 3: Ownership Validation                   │
│              (service layer)                                 │
│                                                              │
│  • Check resource ownership                                 │
│  • Patient can only modify own appointments                 │
│  • Doctor can only modify own availability                  │
│                                                              │
│  ❌ Not owner → 403 Forbidden                               │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Layer 4: Business Validation                    │
│              (service layer)                                 │
│                                                              │
│  • Doctor exists and has doctor role                        │
│  • Date/time in future                                      │
│  • Within availability                                      │
│  • No duplicate bookings                                    │
│  • Time format valid                                        │
│                                                              │
│  ❌ Validation fails → 400 Bad Request                      │
│  ❌ Doctor unavailable → 409 Conflict (with slots)          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE                                  │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### Appointment Creation with Validation
```
1. Patient submits:
   {
     "doctor_id": "abc123",
     "appointment_date": "2026-02-10",
     "appointment_time": "10:00",
     "reason": "Checkup"
   }

2. Validate doctor:
   User.findById(doctor_id)
   ✅ Exists?
   ✅ role === 'doctor'?

3. Validate availability:
   DoctorAvailability.find({ doctorId, day_of_week: 'monday' })
   ✅ Has availability?
   ✅ Time within range?

4. Check conflicts:
   Appointment.find({ doctorId, date, time, status: active })
   ✅ No conflicts?

5. Create appointment:
   Appointment.create({ ... })

6. Return:
   {
     "message": "Appointment created successfully",
     "appointmentId": "xyz789"
   }
```

### Appointment Retrieval with Names
```
1. Patient requests:
   GET /api/appointments/patient

2. Find appointments:
   Appointment.find({ patientId })

3. Enrich with names:
   For each appointment:
     doctor = User.findById(appointment.doctorId)
     appointment.doctorName = doctor.name

4. Return:
   {
     "appointments": [
       {
         "_id": "apt1",
         "doctorId": "doc1",
         "doctorName": "Dr. Smith",  ← Human-readable ✅
         "appointment_date": "2026-02-10",
         "appointment_time": "10:00",
         "reason": "Checkup",
         "status": "scheduled"
       }
     ]
   }
```

## Key Improvements

### Before ❌
```javascript
// No doctor validation
await Appointment.create({ doctorId, ... });

// Raw IDs in response
{
  "doctorId": "abc123",  // What's this?
  "patientId": "xyz789"  // Who's this?
}

// No ownership validation
await Appointment.updateOne({ _id }, { ... });
// Anyone can modify any appointment!

// No reschedule endpoint
// Frontend had to use generic update
```

### After ✅
```javascript
// Doctor validation
const doctor = await User.findById(doctorId);
if (!doctor || doctor.role !== 'doctor') {
  throw new Error('Invalid doctor');
}

// Human-readable response
{
  "doctorId": "abc123",
  "doctorName": "Dr. Smith",  ✅
  "patientId": "xyz789",
  "patientName": "John Doe"   ✅
}

// Ownership validation
if (appointment.patientId !== userId) {
  throw new Error('You can only modify your own appointments');
}

// Dedicated reschedule endpoint
PUT /api/appointments/:id
{
  "appointment_date": "2026-02-11",
  "appointment_time": "11:00"
}
```

## Status Codes

```
┌──────┬─────────────────────────────────────────────────────┐
│ Code │ Meaning                                             │
├──────┼─────────────────────────────────────────────────────┤
│ 200  │ Success                                             │
│ 201  │ Created (appointment, availability)                 │
│ 400  │ Bad Request (validation error)                      │
│ 401  │ Unauthorized (no/invalid token)                     │
│ 403  │ Forbidden (wrong role or not owner)                 │
│ 404  │ Not Found (appointment, user, availability)         │
│ 409  │ Conflict (doctor unavailable + available slots)     │
│ 500  │ Server Error                                        │
└──────┴─────────────────────────────────────────────────────┘
```

## Conclusion

✅ **All blocking issues resolved**
✅ **Production-ready architecture**
✅ **Complete validation and authorization**
✅ **Human-readable data throughout**
✅ **No TODOs, stubs, or breaking changes**

**Status: READY FOR PRODUCTION** 🚀
