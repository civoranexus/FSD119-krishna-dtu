# HealthVillage – Rural Telemedicine Platform

Context: Built under the CivoraX Internship Program. HealthVillage is a secure, low-bandwidth‑friendly telemedicine web application serving Patients, Doctors, and Admins in rural settings.

## 1. System Overview

HealthVillage connects patients in rural areas with healthcare professionals through secure consultations, asynchronous messaging, and light-weight teleconsultation (video/audio) using WebRTC. The platform prioritizes privacy, low-bandwidth operation, progressive enhancement, and an extendable architecture for future scale.

Key goals:
- Deliver reliable consultations over constrained networks.
- Protect patient health data and audit access.
- Provide simple UX for low‑digital‑literacy users.
- Allow future expansion (analytics, AI triage, mobile apps).

## 2. User Roles and Responsibilities

- Patient: register/login, view and book appointments, join consultations, exchange messages, view prescriptions and records. Primary focus: low friction and offline/slow-network support.
- Doctor: manage availability, accept/perform consultations, write prescriptions and notes, review patient history, follow-up via messages.
- Admin: manage users and content, moderate platform usage, review logs and metrics, manage deployments and system configuration.

## 3. High-Level Architecture Diagram (textual description)

Client (Next.js App Router + Tailwind CSS) ↔ HTTPS ↔ API Gateway / Express Server ↔ Relational DB (Postgres/MySQL)
														 ↘
															Signaling Service (WebRTC) ↔ STUN/TURN ↔ Peer-to-peer media
														 ↘
															Background Workers (jobs: notifications, media processing) ↔ Object Storage (S3-compatible)
														 ↘
															Redis (cache / session / pubsub) ↔ Message Broker

Notes: Static assets and client bundles served via CDN; monitoring/logging/observability exports metrics to the monitoring system.

## 4. Frontend Architecture

- Framework: Next.js (App Router) with Tailwind CSS for fast, accessible UI.
- Structure: feature-oriented folders (auth, appointments, consultations, messaging, records). Use server components for data-heavy views and client components for interactive parts (calls, live chat).
- State: local component state + lightweight global store (React Context or Zustand) for session and connectivity state.
- Low-bandwidth strategies:
	- Adaptive media: negotiate lower resolution and audio-only fallback by default for constrained networks.
	- Progressive enhancement: core features (scheduling, messaging, prescriptions) work on HTTP and minimal JS.
	- Client-side caching and offline support: cache critical assets and last-known patient data; show offline indicators and retry queues.
	- Minimal bundle sizes: tree-shaking, route-based code-splitting, and CDN delivery.
- Accessibility & localization: simple language, large touch targets, and multi-language support for rural users.

## 5. Backend Architecture

- Framework: Node.js + Express as primary HTTP API server. Keep server stateless where possible.
- API design: RESTful endpoints for core CRUD flows; a lightweight WebSocket or HTTP-based signaling endpoint for WebRTC session setup.
- Authentication & authorization: token-based (JWT) or session cookies with secure, HttpOnly flags. Role-based access control (RBAC) enforced in middleware.
- Data layer: relational DB (Postgres or MySQL) for user profiles, appointments, clinical records, and audit logs. Use an ORM (Prisma/TypeORM) to simplify migrations and queries.
- Media & signaling:
	- Signaling server (could be part of Express or a separate microservice) for exchanging WebRTC SDP and ICE candidates.
	- STUN/TURN for NAT traversal and to support call reliability over constrained networks.
	- Optional media server for recording or multi-party routing (only if required); otherwise prefer peer-to-peer to reduce costs and latency.
- Background processing: job queue (BullMQ/Worker or similar) for sending notifications, scheduled reminders, media transcoding, and report generation. Store large files in object storage (S3-compatible).
- Observability: structured logging, request tracing, and metrics (Prometheus/Grafana) for uptime and performance monitoring.

## 6. Data Flow Overview

1. Registration / Authentication: User registers → server validates and stores user → issues auth token and minimal profile.
2. Booking Flow: Patient fetches doctor availability → creates appointment → server persists appointment and enqueues reminders.
3. Consultation (live): Patient clicks Join → frontend requests signaling token → client exchanges SDP via signaling server → direct WebRTC peer connection established (media flows P2P/STUN/TURN) → session metadata recorded in DB/audit log.
4. Messaging & Records: Messages and prescriptions are persisted in the DB; attachments are stored in object storage with secure, time-limited download URLs.
5. Background: Reminder/notification jobs are dispatched via job queue; async tasks update appointment statuses and deliver messages when recipients are online.

## 7. Security Considerations (high-level)

- Transport: enforce TLS (HTTPS/WSS) everywhere; HSTS for web clients.
- Authentication & Authorization: strong password policies, multi-factor (optional), short-lived tokens, RBAC, and least-privilege access for services.
- Data protection: encrypt sensitive fields at rest where required; use encrypted object storage for attachments.
- WebRTC specifics: protect signaling endpoints, validate session tokens, and avoid leaking ICE candidates in logs.
- Audit & compliance: store immutable audit logs for access to clinical data; implement role-based audit review capabilities.
- Input validation & rate limiting: sanitize all inputs, protect endpoints with rate limits and bot detection to reduce abuse.
- Secrets & configuration: use a secrets manager for DB credentials, API keys, and TURN credentials; never commit secrets to repo.
- Incident preparedness: define breach response, regular backups, and secure recovery processes.

## 8. Scalability and Future Enhancements

- Scalability:
	- Keep API stateless and scale horizontally behind a load balancer.
	- Use a managed relational DB with read replicas and partitioning strategies for growth.
	- Cache frequently-read data in Redis to reduce DB load.
	- Offload heavy or long-running tasks to background workers.
	- Use edge/CDN for static assets and to reduce latency.
- Future features:
	- Mobile-first native clients (React Native) with offline-first sync.
	- AI-assisted triage and symptom-checking (deployed as separate microservice).
	- Enhanced analytics and dashboards for admins and public-health reporting.
	- Multi-tenant support for NGO/hospital partners.
	- Integration with national health registries and pharmacy chains for e-prescriptions.

## Appendix: Non-functional requirements (summary)
- Availability: 99.8% for core scheduling and messaging; degrade gracefully for media in low-bandwidth.
- Latency: prioritize low-latency signaling and lightweight page loads.
- Privacy: design for regulatory compliance and minimal data exposure.

---

This document is designed to guide interns and initial engineering work. If you want, I can now scaffold a minimal Next.js + Tailwind frontend and a basic Express API skeleton wired to PostgreSQL to start implementation priorities described above.

