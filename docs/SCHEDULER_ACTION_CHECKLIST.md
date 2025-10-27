# ✅ Scheduler - Action Checklist

**What to do next**: 3 simple steps to get the scheduler fully working!

---

## Step 1: Seed Database with Therapists (5 minutes)

### Option A: Use SQL Script (Recommended)

```bash
# Navigate to backend
cd south-physical-clinic-be

# Run the seeder SQL script
psql -U your_db_user -d your_db_name -f scripts/seed-therapists.sql

# OR if using npm script:
npm run seed:therapists
```

### Option B: Manual SQL

```sql
-- Connect to your database and run:
INSERT INTO app_user (username, email, password_hash, role, is_active)
VALUES
  ('ahmed_hassan', 'ahmed@clinic.com', '$2b$10$rKvK5u0gGV8HL6nHE9Y3k.5Qx9MvN8ZLwY5z3qB7xK1eF4nE2yH3m', 'THERAPIST', true),
  ('lena_ali', 'lena@clinic.com', '$2b$10$rKvK5u0gGV8HL6nHE9Y3k.5Qx9MvN8ZLwY5z3qB7xK1eF4nE2yH3m', 'THERAPIST', true),
  ('rania_mansouri', 'rania@clinic.com', '$2b$10$rKvK5u0gGV8HL6nHE9Y3k.5Qx9MvN8ZLwY5z3qB7xK1eF4nE2yH3m', 'THERAPIST', true);

-- Verify
SELECT id, username, role FROM app_user WHERE role = 'THERAPIST';
```

### Option C: Use Backend API (if available)

```bash
# Create therapist users via POST /api/app-users
curl -X POST http://localhost:3000/api/v1/app-users \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "ahmed_hassan",
    "email": "ahmed@clinic.com", 
    "password": "password123",
    "role": "THERAPIST"
  }'
```

---

## Step 2: Test the Scheduler (5 minutes)

### Reload Scheduler Page

```bash
# Make sure backend is running
cd south-physical-clinic-be
npm run dev

# In new terminal, make sure frontend is running
cd south-physical-clinic-UI  
npm run dev

# Open browser
http://localhost:5173/appointments/scheduler
```

### Login
- Email: `admin@clinic.com`
- Password: `password123`

### Verify Grid Shows Therapists

You should now see:
- ✅ Therapist rows in the grid (one per therapist)
- ✅ 8 hour columns for each therapist (9 AM - 4 PM)
- ✅ Empty cells (0/2) in available state (light blue)
- ✅ Therapist names in dropdown filter

---

## Step 3: Test Full Workflow (10 minutes)

### Test 1: Create Appointment

1. **Click any empty cell** in the grid
2. **Modal opens** - "Add Appointment"
3. **Fill fields:**
   - Patient ID: `1` (or any valid patient ID)
   - Therapist: (pre-selected)
   - Hour: (pre-selected)
   - Kind: `STANDARD`
   - Note: Optional
4. **Click "Create Appointment"**
5. **Verify:**
   - Modal closes
   - Grid refreshes
   - Appointment appears in clicked cell
   - Capacity updates (0/2 → 1/2)
   - Cell color changes to "partial"

### Test 2: Add to Overbooking Queue

1. **Click "Add Patient to Queue"** button (sidebar)
2. **Fill fields:**
   - Patient ID: `2`
   - Extra Care: unchecked
   - Reason: "Needs urgent appointment"
3. **Click "Add to Queue"**
4. **Verify:**
   - Patient appears in queue list
   - Shows "Standard" tag
   - Place/Remove buttons present

### Test 3: Test Filters

1. **Change date** using date picker
2. **Verify:** Grid refreshes with new date's data
3. **Select specific therapist** from dropdown
4. **Verify:** Grid shows only that therapist's row

### Test 4: Test Capacity Rules

1. **Create 1st appointment** in a cell (STANDARD)
   - Verify: 1/2 displayed
2. **Create 2nd appointment** in same cell (STANDARD)
   - Verify: 2/2 displayed, cell turns "full" (purple)
3. **Try 3rd appointment** in same cell
   - Should show error about capacity
4. **Create EXTRA_CARE** in new cell
   - Verify: 1/1 displayed, cell turns orange
   - Try 2nd appointment → should fail

---

## ✅ Success Criteria

After completing above steps, you should have:

- [ ] Therapists visible in grid (rows)
- [ ] Can create appointments by clicking cells
- [ ] Appointments display in correct cells
- [ ] Capacity badges update correctly
- [ ] Cell colors change based on state
- [ ] Can add patients to overbooking queue
- [ ] Queue items display correctly
- [ ] Filters work (date & therapist)
- [ ] No JavaScript errors in console

---

## 🐛 Troubleshooting

### "No active treatment plan found"

**Error**: When trying to create appointment

**Solution**: Patient must have an ONGOING treatment plan

```sql
-- Check if patient has active plan
SELECT * FROM treatment_plan 
WHERE patient_id = '1' AND plan_status = 'ONGOING';

-- If not, create one
INSERT INTO treatment_plan (patient_id, plan_type, plan_status, remaining_sessions, total_sessions)
VALUES ('1', 'PAY_PER_VISIT', 'ONGOING', 10, 10);
```

### Grid Still Empty

**Check**:
1. Are therapists created? `SELECT * FROM app_user WHERE role='THERAPIST'`
2. Is backend running? Check http://localhost:3000/api/v1/app-users?role=THERAPIST
3. Any console errors? Open browser DevTools
4. API returning data? Check Network tab

### API Calls Failing

**Check**:
1. Backend server running on port 3000?
2. Frontend `VITE_API_BASE_URL` configured?
3. CORS enabled on backend?
4. Auth token valid?

---

## 📞 Need Help?

### Quick Debugging

**Open browser console** (F12) and run:
```javascript
// Check if APIs work
testSchedulerAPIs()

// Check therapists data
testTherapistsAPI()

// Check appointments data  
testAppointmentsAPI()

// Check queue data
testOverbookingAPI()
```

### Check Backend Response

```bash
# Test therapists endpoint directly
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/v1/app-users?role=THERAPIST
```

---

## 🎯 Definition of Done

✅ **Code Complete**
- [x] All components implemented
- [x] Backend APIs integrated
- [x] Type-safe adapters created
- [x] Error handling in place
- [x] Documentation written

✅ **Quality Assured**
- [x] No TypeScript errors
- [x] No linting errors
- [x] Browser tests passing
- [x] Code reviewed

🟡 **Ready for Production** (pending database seed)
- [ ] Database seeded with therapists
- [ ] Full manual QA testing complete
- [ ] Stakeholder approval obtained

---

## 🎉 You're Almost There!

**Just run the seeder script** and you'll have a fully functional scheduler ready for production!

```bash
# Quick command to get started:
cd south-physical-clinic-be
psql -U postgres -d clinic_db -f scripts/seed-therapists.sql
```

Then refresh the scheduler page and start testing! 🚀

---

## 📸 Expected Result

After seeding, your scheduler should look like this:

```
┌────────────────┬──────────┬──────────┬──────────┬──────────┐
│ Therapist      │ 9:00 AM  │ 10:00 AM │ 11:00 AM │ ...      │
├────────────────┼──────────┼──────────┼──────────┼──────────┤
│ ahmed_hassan   │ [0/2]    │ [0/2]    │ [0/2]    │ ...      │
│ lena_ali       │ [0/2]    │ [0/2]    │ [0/2]    │ ...      │
│ rania_mansouri │ [0/2]    │ [0/2]    │ [0/2]    │ ...      │
└────────────────┴──────────┴──────────┴──────────┴──────────┘
```

All cells clickable and ready for appointment creation!

---

**Questions?** Check the documentation in `docs/` folder or review test results in `SCHEDULER_BROWSER_TEST_RESULTS.md`.

