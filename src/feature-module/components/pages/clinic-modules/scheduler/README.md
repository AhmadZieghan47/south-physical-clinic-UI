# Scheduler Module

## Overview

The Scheduler module provides a **Daily Appointments Board** with **Overbooking Queue** functionality for the South Physical Clinic reception system. This module allows staff to view, create, and manage appointments in a visual grid layout.

## Features

- **Daily Appointments Board**: Visual grid showing appointments by therapist and hour
- **Overbooking Queue**: Queue management for patients waiting for appointment slots
- **Auto-assign**: Automatic placement of overbooked patients into available slots
- **Filtering**: Filter by therapist and date
- **Capacity Management**: Cell capacity rules (2 appointments per hour, 1 if extra-care)
- **Preferred Therapist**: Support for patient preferences

## File Structure

```
scheduler/
├── README.md                           # This file
├── SchedulerPage.tsx                   # Main page component
├── index.ts                            # Module exports
├── api.ts                              # API client
├── types.ts                            # TypeScript types
├── utils.ts                            # Utility functions
├── components/
│   ├── SchedulerBoard.tsx              # Grid board component
│   └── OverbookingWidget.tsx          # Queue sidebar widget
├── modals/
│   ├── AddAppointmentModal.tsx         # Add appointment modal
│   └── AddToOverbookingModal.tsx       # Add to queue modal
├── hooks/
│   └── useScheduler.ts                 # Custom hook for data management
└── styles/
    └── scheduler.css                   # Component styles
```

## Usage

### Route

The scheduler is accessible at `/appointments/scheduler`.

### Basic Integration

```tsx
import { SchedulerPage } from '@/feature-module/components/pages/clinic-modules/scheduler';

// In your router configuration
{
  path: '/appointments/scheduler',
  element: <SchedulerPage />
}
```

### API Endpoints

The module expects the following backend endpoints:

- `GET /therapists` - List all therapists
- `GET /appointments?date=YYYY-MM-DD` - Get appointments for a date
- `POST /appointments` - Create new appointment
- `PUT /appointments/:id` - Update appointment
- `DELETE /appointments/:id` - Delete appointment
- `GET /overbook` - List overbooking queue
- `POST /overbook` - Add to overbooking queue
- `DELETE /overbook/:id` - Remove from queue
- `POST /appointments/auto-assign?date=YYYY-MM-DD` - Auto-assign patients

## Components

### SchedulerPage

Main page component that orchestrates the scheduler board and overbooking widget.

**Props**: None (uses internal state management)

### SchedulerBoard

Visual grid component displaying appointments by therapist and hour.

**Props**:
- `therapists: Therapist[]` - List of therapists
- `appointments: Appointment[]` - List of appointments
- `therapistFilter: string` - Current filter value
- `date: string` - Selected date
- `loading: boolean` - Loading state
- `onCellClick: (therapistId: string, hour: number) => void` - Cell click handler

### OverbookingWidget

Sidebar widget displaying the overbooking queue.

**Props**:
- `queue: OverbookItem[]` - Queue items
- `loading: boolean` - Loading state
- `onAddToQueue: () => void` - Add to queue handler
- `onRefresh: () => void` - Refresh handler

## Types

### Appointment

```typescript
interface Appointment {
  id: BigIntStr;
  date: string; // ISO date (yyyy-mm-dd)
  hour: number; // 9..17
  therapistId: BigIntStr;
  patientId: BigIntStr;
  kind: "STANDARD" | "EXTRA_CARE";
  preferredTherapistId?: BigIntStr | null;
  status: "BOOKED" | "CANCELLED" | "NO_SHOW" | "COMPLETED";
  note?: string;
}
```

### OverbookItem

```typescript
interface OverbookItem {
  id: BigIntStr;
  patientId: BigIntStr;
  reason?: string;
  extraCare: boolean;
  preferredTherapistId?: BigIntStr | null;
  createdAt: string;
}
```

## Business Rules

### Capacity Rules

- Default capacity: **2 appointments per hour** per therapist
- Extra-care appointments: **1 appointment per hour** (blocks the hour)

### Cell States

- `available`: Empty cell, can accept 2 appointments
- `partial`: Has some appointments but capacity remaining
- `full`: At capacity (2 standard appointments)
- `extracare`: Contains an extra-care appointment (blocks further appointments)

### Auto-assign Logic

1. For each patient in the overbooking queue:
   - Try preferred therapist first
   - If preferred therapist unavailable, try other therapists
   - Attempt to place in the earliest available slot
   - Respect capacity and extra-care rules

## Styling

The module uses CSS custom properties defined in `styles/scheduler.css`:

- `--scheduler-primary`: Primary blue color (#1e40af)
- `--scheduler-primary-50`: Light blue background (#eff6ff)
- `--scheduler-warn`: Warning color for extra-care (#d97706)
- `--scheduler-danger`: Danger color (#dc2626)
- `--scheduler-radius`: Border radius (10px)
- `--scheduler-gap`: Spacing between elements (14px)

## Responsive Design

The scheduler is responsive:
- Desktop: Side-by-side board and widget layout
- Mobile: Stacked layout

## Accessibility

- Semantic HTML elements
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus management in modals
- Screen reader friendly

## Testing

The module should be tested for:

1. **Unit Tests**: Utility functions, hooks
2. **Component Tests**: Rendering, interactions
3. **Integration Tests**: API calls, data flow
4. **E2E Tests**: Full user workflows

## Future Enhancements

- [ ] Patient name lookup and display
- [ ] Edit appointment functionality
- [ ] Drag-and-drop appointment placement
- [ ] Calendar view
- [ ] Export to CSV/PDF
- [ ] Print view
- [ ] Notifications for conflicts
- [ ] Bulk operations

## Notes

- All times are displayed in 12-hour format with AM/PM
- Date handling uses ISO date strings (YYYY-MM-DD)
- Hour range is configurable via `utils.ts` (default: 9 AM - 5 PM)
- The module integrates with the clinic's existing error handling and API patterns



