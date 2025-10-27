# Scheduler Backend Integration - Quick Start Guide

## TL;DR

Most backend APIs exist! We need to:
1. Create an **adapter layer** to bridge schema differences
2. Implement **auto-assign endpoint** on backend
3. Wire up the frontend to use real APIs

**Estimated Time**: 3-4 days

---

## What's Ready on Backend

✅ **Appointments API** - `/api/appointments`
- List, create, update, cancel appointments
- Get appointment details with patient/therapist data

✅ **Overbooking Queue API** - `/api/overbooking-queue`
- List, create, update, delete queue items

✅ **Therapists API** - `/api/app-users`
- List users (filter by role=THERAPIST)

---

## What's Missing

❌ **Auto-assign endpoint** - Need to create `POST /api/appointments/auto-assign`

⚠️ **Schema differences** - Need adapter layer:
- Backend uses `startsAt/endsAt` (datetime), frontend uses `date + hour`
- Backend uses `planId`, frontend uses `patientId`
- Backend uses `sessionType` enum, frontend uses `kind` (STANDARD/EXTRA_CARE)

---

## Start Here

### Option 1: Frontend-First Approach (Recommended)

**Start with mock data, gradually replace with real APIs**

```bash
# 1. Keep using mock APIs initially
# Already done - scheduler works with mock data

# 2. Create adapter layer
npm run dev
# Create: src/api/schedulerAdapter.ts

# 3. Wire one API at a time
# Start with: GET /api/app-users (therapists list)
# Then: GET /api/appointments (appointments list)
# Then: POST /api/appointments (create appointment)
```

### Option 2: Backend-First Approach

**Implement missing backend endpoints first**

```bash
cd south-physical-clinic-be

# 1. Create auto-assign endpoint
# File: src/modules/appointment/appointments.controller.ts
# Add: autoAssign() function

# 2. Add route
# File: src/modules/appointment/appointments.routes.ts
# Add: POST /auto-assign route

# 3. Test backend endpoint
npm run dev
# Use Postman/curl to test
```

---

## Quick Adapter Example

```typescript
// src/api/schedulerAdapter.ts

import type { Appointment as BackendAppointment } from "@/types/typedefs";
import type { Appointment as SchedulerAppointment } from "@/feature-module/.../scheduler/types";

export function toSchedulerAppointment(be: BackendAppointment): SchedulerAppointment {
  const dt = new Date(be.startsAt);
  return {
    id: be.id,
    date: dt.toISOString().slice(0, 10),
    hour: dt.getHours(),
    therapistId: be.therapistId,
    patientId: be.plan?.patientId || "",
    kind: be.sessionType === "ELDER" ? "EXTRA_CARE" : "STANDARD",
    preferredTherapistId: null, // TODO: Extract from noteEn if stored
    status: be.status as any,
    note: be.noteEn || undefined,
  };
}

export function toBackendAppointment(
  sch: CreateAppointmentPayload,
  planId: string
): InsertAppointment {
  const startsAt = `${sch.date}T${sch.hour.toString().padStart(2, '0')}:00:00Z`;
  const endsAt = `${sch.date}T${(sch.hour + 1).toString().padStart(2, '0')}:00:00Z`;
  
  return {
    planId,
    therapistId: sch.therapistId,
    startsAt,
    endsAt,
    sessionType: sch.kind === "EXTRA_CARE" ? "ELDER" : "REGULAR",
    location: "CLINIC",
    status: "BOOKED",
    noteEn: sch.note,
  };
}
```

---

## Testing Strategy

### 1. Test Adapter Functions First
```typescript
// Test in browser console or create test file
import { toSchedulerAppointment, toBackendAppointment } from './schedulerAdapter';

const backendAppt = {
  id: "1",
  startsAt: "2025-10-27T14:00:00Z",
  sessionType: "REGULAR",
  // ... other fields
};

const schedulerAppt = toSchedulerAppointment(backendAppt);
console.log(schedulerAppt.date); // "2025-10-27"
console.log(schedulerAppt.hour); // 14
console.log(schedulerAppt.kind); // "STANDARD"
```

### 2. Test One API at a Time
```typescript
// In browser DevTools or test file
import { SchedulerAPI } from './scheduler/api';

// Test therapists list
const therapists = await SchedulerAPI.listTherapists();
console.log('Therapists:', therapists);

// Test appointments list
const appts = await SchedulerAPI.listAppointmentsByDate('2025-10-27');
console.log('Appointments:', appts);
```

---

## Common Issues & Solutions

### Issue 1: Patient has no active plan

**Error**: Can't create appointment - patient has no active plan

**Solution**:
```typescript
// Before creating appointment, check for active plan
const plan = await getActivePlanForPatient(patientId);
if (!plan) {
  throw new Error("Patient must have an active treatment plan");
}
```

### Issue 2: Timezone conversion problems

**Error**: Appointments show wrong hours

**Solution**:
```typescript
// Always use UTC for backend, display local time in UI
const dt = new Date(backendDateTime);
const localHour = dt.getHours(); // Browser handles timezone
```

### Issue 3: SessionType doesn't match "kind"

**Error**: Don't know how to map sessionType "SHOCK_WAVE"

**Solution**:
```typescript
function sessionTypeToKind(sessionType: SessionTypeT): "STANDARD" | "EXTRA_CARE" {
  // Map all non-ELDER types to STANDARD
  return sessionType === "ELDER" ? "EXTRA_CARE" : "STANDARD";
}
```

---

## API Endpoint Reference

### Therapists
```http
GET /api/app-users?role=THERAPIST
Authorization: Bearer {token}

Response: {
  data: [
    { id: "1", username: "ahmed_hassan", role: "THERAPIST" }
  ]
}
```

### Appointments by Date
```http
GET /api/appointments?from=2025-10-27T00:00:00Z&to=2025-10-27T23:59:59Z
Authorization: Bearer {token}

Response: {
  data: [
    {
      id: "1",
      planId: "123",
      therapistId: "456",
      startsAt: "2025-10-27T14:00:00Z",
      endsAt: "2025-10-27T15:00:00Z",
      sessionType: "REGULAR",
      status: "BOOKED"
    }
  ],
  total: 1,
  page: 1,
  pageSize: 20
}
```

### Create Appointment
```http
POST /api/appointments
Authorization: Bearer {token}
Content-Type: application/json

Body: {
  "planId": "123",
  "therapistId": "456",
  "startsAt": "2025-10-27T14:00:00Z",
  "endsAt": "2025-10-27T15:00:00Z",
  "sessionType": "REGULAR",
  "location": "CLINIC",
  "status": "BOOKED"
}

Response: { /* Appointment */ }
```

### Overbooking Queue
```http
GET /api/overbooking-queue
Authorization: Bearer {token}

Response: {
  data: [
    {
      id: "1",
      patientId: "789",
      priority: "HIGH",
      isActive: true,
      addedBy: "101",
      addedAt: "2025-10-27T10:00:00Z"
    }
  ]
}
```

---

## Checklist for First Integration

- [ ] Create `schedulerAdapter.ts` with conversion functions
- [ ] Test adapter functions in isolation
- [ ] Update `SchedulerAPI.listTherapists()` to call real API
- [ ] Update `SchedulerAPI.listAppointmentsByDate()` to call real API
- [ ] Test grid renders with real data
- [ ] Implement patient → plan lookup
- [ ] Update `SchedulerAPI.createAppointment()` to call real API
- [ ] Test creating appointments
- [ ] Wire overbooking queue APIs
- [ ] Implement auto-assign (backend + frontend)
- [ ] Full integration testing

---

## Need Help?

1. **Schema questions**: Check `south-physical-clinic-be/src/types/typedefs.ts`
2. **API questions**: Check `south-physical-clinic-be/src/routes.ts`
3. **Error handling**: Use existing `enhancedApi.ts` patterns
4. **Type issues**: See existing API files in `src/api/`

**Full plan**: See `SCHEDULER_BACKEND_INTEGRATION_PLAN.md`

