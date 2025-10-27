# Scheduler Backend Integration Plan

## Executive Summary

This document outlines the plan to integrate the Scheduler frontend module with the existing South Physical Clinic backend APIs. Most of the required APIs exist, but we need to create adapters to bridge the differences between the scheduler's data model and the backend's existing schema.

---

## 1. Current Backend API Status

### ✅ Available APIs

#### 1.1 Appointments API (`/api/appointments`)
- **GET** `/` - List appointments (with filters)
- **GET** `/:id` - Get appointment by ID
- **GET** `/:id/details` - Get appointment with related data
- **POST** `/` - Create appointment
- **PATCH** `/:id` - Update appointment
- **PATCH** `/:id/cancel` - Cancel appointment
- **PATCH** `/:id/complete` - Complete appointment

#### 1.2 Overbooking Queue API (`/api/overbooking-queue`)
- **GET** `/` - List queue items
- **GET** `/:id` - Get queue item by ID
- **POST** `/` - Add to queue
- **PATCH** `/:id` - Update queue item
- **DELETE** `/:id` - Remove from queue

#### 1.3 App Users API (`/api/app-users`)
- **GET** `/` - List users (therapists)
- **GET** `/:id` - Get user by ID

---

## 2. Schema Mapping & Gaps

### 2.1 Appointments Schema Differences

| Scheduler Frontend | Backend API | Mapping Strategy |
|-------------------|-------------|------------------|
| `date: string` (YYYY-MM-DD) | `startsAt: ISODateTime` | **Convert**: Combine date + hour → ISO datetime |
| `hour: number` (9-17) | `startsAt: ISODateTime` | **Convert**: Extract hour from datetime |
| `kind: "STANDARD" \| "EXTRA_CARE"` | `sessionType: SessionTypeT` | **Map**: REGULAR → STANDARD, ELDER → EXTRA_CARE |
| `preferredTherapistId?: string` | ❌ Not in schema | **Store in**: `noteEn` as JSON metadata (temp solution) |
| `patientId: string` | `planId: string` | **Adapter**: Lookup active plan for patient first |

### 2.2 Overbooking Queue Schema Differences

| Scheduler Frontend | Backend API | Mapping Strategy |
|-------------------|-------------|------------------|
| `reason?: string` | ❌ Not in schema | **Ignore** or add to backend later |
| `extraCare: boolean` | `priority: PriorityT` | **Map**: extraCare=true → HIGH, extraCare=false → MEDIUM |
| `preferredTherapistId?: string` | ❌ Not in schema | **Ignore** for now (queue doesn't need it) |
| `createdAt: string` | `addedAt: ISODateTime` | **Map**: Direct mapping |

---

## 3. Missing APIs to Create

### 3.1 Auto-Assign Endpoint ⚠️ REQUIRED

**Endpoint**: `POST /api/appointments/auto-assign`

**Query Params**:
- `date` (YYYY-MM-DD): The date to auto-assign for

**Response**:
```typescript
{
  placed: Appointment[];      // Successfully placed appointments
  unplaced: OverbookItem[];  // Items that couldn't be placed
}
```

**Logic**:
1. Fetch all active overbooking queue items
2. For each item:
   - Get patient's active plan
   - Attempt placement starting with preferred therapist (if stored)
   - Try each hour slot (9-17) until finding capacity
   - Respect capacity rules (2 standard, 1 extra-care)
   - Create appointment if slot found
   - Remove from queue if placed
3. Return results

**Estimated Effort**: 3-4 hours

---

## 4. Frontend Adapter Layer

### 4.1 Create Scheduler API Adapter

**File**: `south-physical-clinic-UI/src/api/schedulerAdapter.ts`

**Purpose**: Bridge between scheduler types and backend schema

```typescript
// Date/Hour → DateTime conversion
function toISODateTime(date: string, hour: number): string {
  return `${date}T${hour.toString().padStart(2, '0')}:00:00.000Z`;
}

function fromISODateTime(datetime: string): { date: string; hour: number } {
  const dt = new Date(datetime);
  return {
    date: dt.toISOString().slice(0, 10),
    hour: dt.getHours(),
  };
}

// Kind → SessionType mapping
function kindToSessionType(kind: "STANDARD" | "EXTRA_CARE"): SessionTypeT {
  return kind === "EXTRA_CARE" ? "ELDER" : "REGULAR";
}

function sessionTypeToKind(sessionType: SessionTypeT): "STANDARD" | "EXTRA_CARE" {
  return sessionType === "ELDER" ? "EXTRA_CARE" : "STANDARD";
}

// ExtraCare → Priority mapping
function extraCareToPriority(extraCare: boolean): PriorityT {
  return extraCare ? "HIGH" : "MEDIUM";
}

function priorityToExtraCare(priority: PriorityT): boolean {
  return priority === "HIGH";
}

// PatientId → PlanId lookup (requires API call)
async function getActivePlanForPatient(patientId: string): Promise<string> {
  // Call /api/plans?patientId=X&status=ONGOING
  // Return the planId
}
```

**Estimated Effort**: 2 hours

---

## 5. Step-by-Step Implementation Tasks

### Phase 1: Setup & Adapters (Day 1, 4 hours)

- [ ] **Task 1.1**: Create `schedulerAdapter.ts` with conversion functions
  - Date/hour converters
  - Kind/sessionType mappers
  - ExtraCare/priority mappers
  - Patient → Plan lookup function
  - **Files**: `src/api/schedulerAdapter.ts`
  - **Effort**: 2 hours

- [ ] **Task 1.2**: Update scheduler API client to use adapter
  - Replace direct API calls with adapted calls
  - Add error handling for conversion failures
  - **Files**: `src/feature-module/.../scheduler/api.ts`
  - **Effort**: 1 hour

- [ ] **Task 1.3**: Create temporary patient-plan lookup cache
  - Cache active plans by patientId
  - Refresh on appointment create/update
  - **Files**: `src/feature-module/.../scheduler/hooks/useScheduler.ts`
  - **Effort**: 1 hour

### Phase 2: Wire Existing Endpoints (Day 1-2, 6 hours)

- [ ] **Task 2.1**: Wire therapists list
  - Call `/api/app-users?role=THERAPIST`
  - Map to Therapist type
  - **API**: `GET /api/app-users`
  - **Effort**: 30 min

- [ ] **Task 2.2**: Wire appointments list by date
  - Call `/api/appointments?from=DATE&to=DATE`
  - Convert response to scheduler Appointment[]
  - **API**: `GET /api/appointments`
  - **Effort**: 1 hour

- [ ] **Task 2.3**: Wire create appointment
  - Lookup patient's active plan
  - Convert date+hour → startsAt/endsAt
  - Map kind → sessionType
  - Call `/api/appointments` POST
  - **API**: `POST /api/appointments`
  - **Effort**: 2 hours

- [ ] **Task 2.4**: Wire overbooking queue
  - List: `/api/overbooking-queue`
  - Add: `/api/overbooking-queue` POST
  - Remove: `/api/overbooking-queue/:id` DELETE
  - Map extraCare ↔ priority
  - **API**: `GET/POST/DELETE /api/overbooking-queue`
  - **Effort**: 2 hours

- [ ] **Task 2.5**: Wire delete appointment
  - Call `/api/appointments/:id` DELETE (or PATCH cancel)
  - Refresh grid after deletion
  - **API**: `PATCH /api/appointments/:id/cancel`
  - **Effort**: 30 min

### Phase 3: Backend Auto-Assign Endpoint (Day 2, 4 hours)

- [ ] **Task 3.1**: Design auto-assign logic
  - Define algorithm (greedy placement)
  - Respect capacity rules
  - Prioritize preferred therapist
  - **Files**: Backend design doc
  - **Effort**: 1 hour

- [ ] **Task 3.2**: Implement backend endpoint
  - Create route: `POST /api/appointments/auto-assign`
  - Implement service logic
  - Add validators
  - Add tests
  - **Files**: `south-physical-clinic-be/src/modules/appointment/...`
  - **Effort**: 3 hours

### Phase 4: Frontend Auto-Assign Integration (Day 2, 1 hour)

- [ ] **Task 4.1**: Wire auto-assign button
  - Call new endpoint
  - Show results (placed/unplaced counts)
  - Refresh grid and queue
  - **Files**: `SchedulerPage.tsx`, `api.ts`
  - **Effort**: 1 hour

### Phase 5: Patient Data Enhancement (Day 3, 3 hours)

- [ ] **Task 5.1**: Fetch patient details for appointments
  - Enhance appointments response with patient data
  - Display patient names in grid cells
  - **API**: Use `/api/appointments/:id/details` or join query
  - **Effort**: 2 hours

- [ ] **Task 5.2**: Add patient search/lookup to modals
  - Integrate patient selector in AddAppointmentModal
  - Show patient info (name, extra care flag)
  - **Files**: `AddAppointmentModal.tsx`
  - **Effort**: 1 hour

### Phase 6: Error Handling & Polish (Day 3, 3 hours)

- [ ] **Task 6.1**: Add comprehensive error handling
  - Handle 409 conflicts (double booking)
  - Handle 404 (patient/plan not found)
  - Handle capacity errors
  - **Files**: All scheduler components
  - **Effort**: 1.5 hours

- [ ] **Task 6.2**: Add loading states
  - Skeleton loaders for grid
  - Loading spinners for modals
  - Optimistic UI updates
  - **Files**: `SchedulerBoard.tsx`, modals
  - **Effort**: 1 hour

- [ ] **Task 6.3**: Add success notifications
  - Toast on appointment created
  - Toast on queue item placed
  - Toast on auto-assign completion
  - **Files**: Use existing toast system
  - **Effort**: 30 min

### Phase 7: Testing & QA (Day 4, 4 hours)

- [ ] **Task 7.1**: Manual testing
  - Test all CRUD operations
  - Test capacity rules
  - Test auto-assign
  - Test error scenarios
  - **Effort**: 2 hours

- [ ] **Task 7.2**: Fix bugs found in testing
  - Address edge cases
  - Fix UI issues
  - **Effort**: 2 hours

---

## 6. Data Flow Diagrams

### 6.1 Create Appointment Flow

```
User Input (Scheduler Modal)
  ↓
  date: "2025-10-27"
  hour: 14
  patientId: "123"
  kind: "STANDARD"
  ↓
Adapter Layer
  ↓
  1. Lookup active plan for patient 123 → planId: "456"
  2. Convert: date+hour → startsAt: "2025-10-27T14:00:00Z"
  3. Map: kind → sessionType: "REGULAR"
  ↓
Backend Request
  POST /api/appointments
  {
    planId: "456",
    therapistId: "789",
    startsAt: "2025-10-27T14:00:00Z",
    endsAt: "2025-10-27T15:00:00Z",
    sessionType: "REGULAR",
    location: "CLINIC",
    status: "BOOKED"
  }
  ↓
Backend Response (Appointment)
  ↓
Adapter Layer (reverse conversion)
  ↓
Update Scheduler State
```

### 6.2 List Appointments Flow

```
User selects date: "2025-10-27"
  ↓
Backend Request
  GET /api/appointments?from=2025-10-27T00:00:00Z&to=2025-10-27T23:59:59Z
  ↓
Backend Response (Appointment[])
  ↓
Adapter Layer
  ↓
  For each appointment:
    1. Extract date + hour from startsAt
    2. Map sessionType → kind
    3. Extract patientId from plan relation
  ↓
Scheduler State (Appointment[])
  ↓
Render Grid
```

---

## 7. Backend Schema Enhancements (Future)

### Recommended Changes (Post-MVP)

1. **Add preferredTherapistId to Appointment table**
   ```sql
   ALTER TABLE appointment
   ADD COLUMN preferred_therapist_id BIGINT REFERENCES app_user(id);
   ```

2. **Add reason field to OverbookingQueue table**
   ```sql
   ALTER TABLE overbooking_queue
   ADD COLUMN reason TEXT;
   ```

3. **Add extraCare flag to OverbookingQueue**
   ```sql
   ALTER TABLE overbooking_queue
   ADD COLUMN extra_care BOOLEAN DEFAULT FALSE;
   ```

4. **Create appointments_by_date view** (performance optimization)
   ```sql
   CREATE INDEX idx_appointment_date ON appointment(DATE(starts_at));
   ```

---

## 8. Testing Strategy

### 8.1 Unit Tests
- Adapter conversion functions
- Capacity calculation logic
- Cell state determination

### 8.2 Integration Tests
- API call flows (with MSW mocks)
- Error handling paths
- Data transformation accuracy

### 8.3 E2E Tests
- Create appointment workflow
- Auto-assign workflow
- Conflict handling
- Capacity enforcement

---

## 9. Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Patient has no active plan | High | Medium | Pre-validate in modal; show error |
| Date/time conversion timezone issues | High | Medium | Use UTC consistently; test thoroughly |
| Capacity conflicts in concurrent requests | Medium | Low | Backend locking/transactions |
| Backend auto-assign performance | Medium | Low | Add timeout; limit queue size |
| SessionType mapping ambiguity | Low | Low | Document mapping clearly |

---

## 10. Timeline Summary

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| Phase 1: Setup & Adapters | 4 hours | None |
| Phase 2: Wire Existing APIs | 6 hours | Phase 1 |
| Phase 3: Backend Auto-Assign | 4 hours | None (parallel) |
| Phase 4: Frontend Auto-Assign | 1 hour | Phase 3 |
| Phase 5: Patient Enhancement | 3 hours | Phase 2 |
| Phase 6: Error Handling | 3 hours | Phase 2, 4 |
| Phase 7: Testing & QA | 4 hours | All above |
| **Total** | **25 hours (~3-4 days)** | |

---

## 11. Next Immediate Steps

1. **Create the adapter layer** (Task 1.1)
2. **Wire therapists list** (Task 2.1) - Quick win to test API connectivity
3. **Wire appointments list** (Task 2.2) - Core functionality
4. **Start backend auto-assign** (Task 3.2) - Parallel track

---

## 12. Success Criteria

- [ ] All scheduler CRUD operations work with real backend
- [ ] Grid displays appointments correctly
- [ ] Overbooking queue functional
- [ ] Auto-assign places patients successfully
- [ ] No data loss in conversions
- [ ] Error handling graceful and informative
- [ ] Performance acceptable (<2s for most operations)
- [ ] Passes all manual test scenarios

---

## 13. Resources & Links

- **Backend API Docs**: `south-physical-clinic-be/src/routes.ts`
- **Backend Types**: `south-physical-clinic-be/src/types/typedefs.ts`
- **Frontend API Client**: `south-physical-clinic-UI/src/api/enhancedAppointments.ts`
- **Scheduler Frontend**: `south-physical-clinic-UI/src/feature-module/components/pages/clinic-modules/scheduler/`

