Here’s a clean, implementable breakdown of the Scheduler (Appointments) business logic based on the uploaded SRS.

1. Scope & Views
   Views: Day/Week calendar with multi-therapist columns, drag-and-drop reschedule, quick filters (therapist, session type, insured/cash), color-coded statuses.
   Working time: Clinic runs Sat–Thu, 08:00–17:00, fixed 60-minute slots.
   Roles using the scheduler: Reception (primary), Manager/Admin (full visibility), Therapist (read, own notes).
2. Core Entities & Required Links
   Every Appointment must link to a Treatment Plan (plan status Ongoing/Discharged).
   Appointment fields (at creation/edit): date/time, therapist, session type, linked plan, location (Clinic/Home), status, note (opt), premium rule used (if any), cancel/reschedule reason (required when applicable).
   Patient “Extra-Care” flag comes from the Patient profile and is read-only inside appointments.
3. Status Machine
   Booked (Reception)
   → Checked-in (Reception)
   → Completed (auto when Therapist submits Session Notes)
   OR → Cancelled (Reception)
   No “No-show” status in v1 (explicitly out of scope).
   Session completion auto-decrements plan Remaining sessions by 1.
4. Capacity & Slot Validation (hard rules)
   Slot length: 60 minutes for all sessions.
   Per-therapist capacity per slot:
   Default: max 2 concurrent patients.
   If any patient in the slot is Extra-Care ⇒ max 1 (i.e., block any second booking).
   Validation point: On save/confirm (and on drag-drop reschedule), block violations with a clear error.
   Extra-Care change (outside scheduler): If someone toggles a patient’s Extra-Care flag, the system re-validates all future appointments for that patient and blocks save until any conflicts are resolved.
5. Booking Rules
   Plan linkage mandatory. If plan Remaining sessions = 0, warn and allow extend or discharge before booking.
   Session type & package pricing: If the booked session’s price > package rate, system prompts Reception to add a surcharge (difference only).
   (SRS notes both a surcharge and “consume 2 sessions” option appear; final rule set in the SRS “Highlights” specifies surcharge only—no consume-2 in v1. Keep UI consistent with that.)
   Same-therapist preference: Prefer the plan’s Primary therapist; allow manual override by Reception.
   Home sessions: Fixed 30 JD, use patient saved address; timing is manual but still occupies a 60-min slot for allocation.
6. Reschedule & Cancel
   Reception only.
   Reason pick-list required (Patient request, Therapist unavailable, Insurance issue, Weather/transport, Duplicate booking, Created in error, Doctor advised hold).
   Never delete appointments; keep for audit.
   Triggers/alerts:
   Any cancel/reschedule → Manager gets in-app + Email + WhatsApp alert.
   Two consecutive cancellations on the same plan → High-priority alert to Admin & Manager via Email + WhatsApp (+ in-app banner for Reception).
7. Check-in & Completion
   Checked-in at front desk (Reception).
   Completed happens automatically when Therapist submits Session Notes (Session Summary is mandatory; procedures checklist managed in Master Data).
   On completion:
   Appointment → Completed
   Treatment plan Remaining sessions −= 1
   Payments/Outstanding flags show at check-in and on patient/plan pages for collection.
8. Overbooking Queue Integration
   Clinic-wide Overbooking Queue (Reception/Manager/Therapist can add entries with High/Medium/Low priority).
   Auto-remove queue entry when patient gets a booking.
   Warn on duplicate if patient already has a booking today.
   When a slot is freed (cancel/reschedule), scheduler can prompt: “Fill with Overbooking Queue?”
9. Notifications & Reminders (scheduler-driven)
   Patients (WhatsApp): Automated Arabic reminders at 24h and 2h before the appointment (include address for Home).
   Therapists (WhatsApp): Day-before schedule (24h) with list of times + patient names.
   Inactivity alerts for plans:
   SRS contains two thresholds: 14 days under Scheduler (§4.5) vs 7 days in Notifications/Highlights (§4.13/§9). Decide one at configuration; default to 7 days to align with global alerts, or expose as Admin setting.
10. Filters & Color Coding
    Quick filters: therapist, session type, insured/cash.
    Color coding: reflect status (Booked/Checked-in/Completed/Cancelled), location (Clinic/Home), insurance (optional badge), Extra-Care (icon/badge).
11. Pricing, Insurance & Discounts (touchpoints)
    Methods: Cash, Card (POS), Insurance; partial payments allowed.
    Insurance split: insurer_share = price × coverage%; patient_share = price − insurer_share. Discounts apply only to patient_share; insurer share unaffected.
    Plan-level vs appointment-level discounts:
    Plan-level affects future visits;
    Single-appointment discount applies at checkout for that visit;
    If both exist, single-appointment discount takes precedence for that visit.
    Approvals: Reception requests, Admin approves/denies; all logged.
12. Permissions (summary for scheduler actions)
    Reception: CRUD on appointments (book, check-in, reschedule, cancel), payments, export reports.
    Manager: CRUD on appointments; manage Overbooking Queue; view audit log; receive alerts.
    Admin: Full control + master data + approvals.
    Therapist: Read all appointments; edit Session Notes; extend plans.
13. Audit & Logging
    Log all actions (create/edit/delete, status changes, logins) across Appointments, Plans, Payments, Discounts, Master Data, Users; retain 1 year.
14. Acceptance Criteria (key tests to codify)
    Capacity pass: Book standard patient when therapist has 1 booking in slot → Allowed; when 2 → Blocked.
    Extra-Care guard: Book Extra-Care when therapist already has any other booking in the slot → Blocked (limit 1).
    Complete session: On Therapist submits notes with at least one procedure or details → Appointment Completed, plan Remaining sessions −= 1.
    Extra-Care toggle ripple: Toggle Extra-Care for a patient with future overlapping double bookings → Flag & block save until conflicts resolved.
    Premium vs package: If session price > package rate → Auto-surcharge equal to difference.
    Two cancellations in a row (same plan): Fire high-priority alert to Admin & Manager.
    Implementation Notes (practical)
    Data-level guardrails:
    Unique (Therapist, Slot) + capacity counter with Extra-Care rule.
    Foreign keys: Appointment → TreatmentPlan → Patient; derive Extra-Care at booking time and store snapshot for audit.
    Drag-and-drop: Re-run capacity validation + reason modal for reschedules.
    Config surface: Admin settings for inactivity threshold (7/14 days), WhatsApp provider/number, SMTP.
    No deletions: Use soft-delete / cancelled status only.
