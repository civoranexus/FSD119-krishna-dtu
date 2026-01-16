# HealthVillage — Database Schema Design

Purpose: conceptual schema for a rural telemedicine platform. This document describes the core entities and relationships (realistic, not exhaustive) and highlights integrity and security considerations.

## 1. Overview of Data Model

The data model centers on a `Users` table with role-based profiles (`DoctorProfile`, `PatientProfile`). Core clinical flows use `Appointments`, `ElectronicHealthRecords` (EHR), and `Prescriptions`. A relational database (Postgres/MySQL) provides strong ACID guarantees for clinical and scheduling data; Redis or similar can be used for ephemeral/session data.

Guiding principles:
- Keep PII/PHI minimal and separate sensitive fields for targeted encryption.
- Use referential integrity (FKs) and audit fields for compliance and traceability.
- Design for role-based access at the application layer; enforce DB constraints for integrity.

## 2. Core Tables

Note: types are conceptual (string, uuid/int, datetime, json, boolean). Indicate primary key (PK) and foreign key (FK) relationships conceptually.

- Users
  - Purpose: Authentication and global identity for all platform users.
  - Fields: `id` (PK, uuid), `email` (unique), `password_hash`, `role` (enum: patient|doctor|admin), `is_active` (boolean), `created_at`, `updated_at`.
  - Notes: store minimal profile info here; sensitive profile fields live in profile tables.

- DoctorProfile
  - Purpose: Doctor-specific metadata and credentials.
  - Fields: `id` (PK, uuid), `user_id` (FK → Users.id, unique), `full_name`, `qualification`, `registration_number` (nullable), `specialties` (json or array), `clinic_hours` (json), `location` (text), `verified` (boolean), `created_at`, `updated_at`.
  - Notes: `user_id` is a FK and has a one-to-one relationship with `Users` for role=doctor.

- PatientProfile
  - Purpose: Patient demographics and baseline health metadata.
  - Fields: `id` (PK, uuid), `user_id` (FK → Users.id, unique), `full_name`, `dob` (date), `gender`, `contact_number` (encrypted as needed), `address` (text), `medical_summary` (text or encrypted), `created_at`, `updated_at`.
  - Notes: keep sensitive clinical history minimal here; store full EHR entries in `ElectronicHealthRecords`.

- Appointments
  - Purpose: Scheduling and status for consultations.
  - Fields: `id` (PK, uuid), `patient_id` (FK → PatientProfile.id), `doctor_id` (FK → DoctorProfile.id), `scheduled_start` (datetime), `scheduled_end` (datetime), `status` (enum: requested|confirmed|cancelled|completed|no_show), `mode` (enum: video|audio|phone|in_person), `notes` (text), `created_by` (FK → Users.id), `created_at`, `updated_at`.
  - Notes: include a soft-delete or cancelled flag rather than hard delete for audit.

- ElectronicHealthRecords
  - Purpose: store clinical notes, visit summaries, lab links, and structured observations.
  - Fields: `id` (PK, uuid), `patient_id` (FK → PatientProfile.id), `author_id` (FK → DoctorProfile.id or Users.id), `appointment_id` (FK → Appointments.id, nullable), `record_type` (enum: note|lab|imaging|vital), `content` (text or json; encrypted if PHI), `attachments` (array of storage URLs/IDs), `visibility` (enum or ACL reference), `created_at`, `updated_at`.
  - Notes: favor append-only records or versioning for traceability.

- Prescriptions
  - Purpose: electronic prescriptions tied to a consultation.
  - Fields: `id` (PK, uuid), `ehr_id` (FK → ElectronicHealthRecords.id, nullable), `appointment_id` (FK → Appointments.id, nullable), `patient_id` (FK → PatientProfile.id), `doctor_id` (FK → DoctorProfile.id), `medications` (structured json: drug name, dose, frequency, duration), `notes` (text), `issued_at` (datetime), `expires_at` (datetime, optional), `signed_by` (FK → Users.id), `created_at`, `updated_at`.
  - Notes: store medication data as structured JSON to support pharmacy integrations; provide audit trail for signature.

Optional/supporting tables (brief):
- AuditLogs (`id`, `actor_user_id` FK, `action`, `target_table`, `target_id`, `timestamp`, `metadata`)
- Attachments/Files (`id`, `owner_id` FK, `storage_key`, `content_type`, `size`, `encrypted` boolean, `created_at`)
- Notifications, Sessions, and TURN_Credentials (for WebRTC) as auxiliary tables.

## 3. Relationships between tables

- `Users` 1 — 1 `DoctorProfile` (for users with role=doctor)
- `Users` 1 — 1 `PatientProfile` (for users with role=patient)
- `PatientProfile` 1 — * `Appointments` (a patient can have many appointments)
- `DoctorProfile` 1 — * `Appointments` (a doctor can have many appointments)
- `Appointments` 1 — 0..1 `ElectronicHealthRecords` (an appointment may generate an EHR entry)
- `PatientProfile` 1 — * `ElectronicHealthRecords` (patient has many records)
- `DoctorProfile` 1 — * `ElectronicHealthRecords` (doctor authors many records)
- `ElectronicHealthRecords` 1 — * `Prescriptions` (a record can include multiple prescriptions)

Conceptual FK examples: `Appointments.patient_id` → `PatientProfile.id`; `Prescriptions.patient_id` → `PatientProfile.id`; `ElectronicHealthRecords.author_id` → `DoctorProfile.id`.

## 4. Role-based data access explanation

- Patients:
  - Access: their own `PatientProfile`, their appointments, their EHR entries, and prescriptions. Read-only access to doctor profiles (public-facing fields) and ability to message and join consultations.
  - Restrictions: cannot view other patients' PHI; limited metadata for doctors only as needed.

- Doctors:
  - Access: their `DoctorProfile`, assigned patient appointments, EHR entries they authored or assigned to them, and prescriptions they issued. Access to patient basic demographics for treatment purposes.
  - Restrictions: only access patient PHI when assigned to the care relationship or with explicit consent/audit trail.

- Admins:
  - Access: user management, system-level metrics, and support operations. Admins should not have unrestricted clinical read access by default—use scoped admin roles for audit and support and log all access.

Enforcement: RBAC should be implemented in application middleware; database grants should be restrictive (app connects with least-privilege DB user). Use row-level security (RLS) where supported to enforce per-row access policies for PHI.

## 5. Data integrity and constraints

- Primary keys: every core table uses a stable PK (uuid recommended for distributed systems).
- Foreign keys: enforce FK constraints for `patient_id`, `doctor_id`, `user_id`, `appointment_id` to guarantee referential integrity.
- Uniqueness: `Users.email` unique; `DoctorProfile.user_id` and `PatientProfile.user_id` unique to enforce one-to-one mapping.
- Not-null constraints: required audit fields (`created_at`, `created_by` on sensitive operations) and essential foreign keys should be NOT NULL.
- Enum constraints: use database or application-level enums for `status`, `role`, `record_type`, `mode` to avoid invalid states.
- Soft deletes & immutability: prefer soft deletes (`is_deleted`, `deleted_at`) for clinical data; use append-only or versioning for EHRs where legal/regulatory compliance requires it.
- Transactions: wrap multi-step operations (create appointment + send notification; complete consultation + create EHR + issue prescription) in DB transactions to maintain consistency.

## 6. Notes on encryption and sensitive fields

- In transit: enforce TLS for all client-server and service-to-service connections (HTTPS/WSS).
- At rest: encrypt full-disk volumes and use database-level/encryption-at-rest features; for highly sensitive columns (e.g., `medical_summary`, `content` in EHR, `contact_number`), apply field-level encryption or tokenization.
- Key management: use a dedicated secrets/key management service (KMS) with strict access controls and key rotation policies. Never store plaintext keys in the repository.
- Attachments: store files in S3-compatible object storage with server-side encryption and serve temporary signed URLs; optionally encrypt file blobs with application keys before upload for extra protection.
- Access logging & audit: log access to PHI and EHR entries in `AuditLogs` with immutable timestamps; restrict access to logs and monitor for anomalous access.
- Minimization: store only the minimum PHI necessary for care. Purge or archive data according to retention policies and local regulations.

---

This schema is intended as a solid, internship-ready starting point; I can expand it into an ER diagram or generate example migration/ORM models (Prisma/TypeORM) if you want to proceed to implementation.