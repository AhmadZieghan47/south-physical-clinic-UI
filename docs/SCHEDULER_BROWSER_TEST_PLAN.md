# Scheduler Browser Test Plan

**Purpose**: Comprehensive end-to-end testing of the Scheduler UI using automated browser tools.

---

## 🎯 Test Objectives

1. Verify scheduler page loads correctly
2. Test all UI interactions (clicks, inputs, filters)
3. Validate appointment creation workflow
4. Test overbooking queue management
5. Verify data display and state changes
6. Check error handling and edge cases

---

## 🛠️ Test Setup

### Prerequisites
- Backend server running on `http://localhost:3000`
- Frontend running on `http://localhost:5173`
- At least one therapist in database with role='THERAPIST'
- At least one patient with an active treatment plan

### Test Data Required
```javascript
// Update these based on your actual database data
const TEST_DATA = {
  validPatientId: "1",        // Patient with active plan
  invalidPatientId: "99999",  // Non-existent patient
  therapistId: "1",           // Valid therapist ID
  testDate: "2025-10-28",     // Tomorrow
};
```

---

## 📋 Test Suite

### Test 1: Page Load and Initial State

**Steps:**
1. Navigate to scheduler page
2. Take snapshot of page structure
3. Verify all main elements are present

**Expected Results:**
- ✅ Page loads without errors
- ✅ Header with "Appointments" title visible
- ✅ Date picker present
- ✅ Therapist filter dropdown present
- ✅ Daily/All Appointments tabs visible
- ✅ Grid board visible
- ✅ Overbooking queue sidebar visible

---

### Test 2: Date Picker Interaction

**Steps:**
1. Take snapshot of current state
2. Click date picker
3. Select a different date
4. Verify grid updates

**Expected Results:**
- ✅ Date picker opens
- ✅ Can select date
- ✅ Grid refreshes with new date data
- ✅ URL or state reflects selected date

---

### Test 3: Therapist Filter

**Steps:**
1. Take snapshot showing all therapists
2. Open therapist dropdown
3. Select specific therapist
4. Verify grid filters

**Expected Results:**
- ✅ Dropdown shows therapist list
- ✅ Can select therapist
- ✅ Grid shows only selected therapist's row
- ✅ Other therapists hidden

---

### Test 4: Grid Display and Structure

**Steps:**
1. Take snapshot of grid
2. Count visible hours (should be 9 AM - 5 PM)
3. Count therapist rows
4. Verify cell structure

**Expected Results:**
- ✅ 8 hour columns (9-17)
- ✅ One row per therapist
- ✅ Each cell has capacity badge
- ✅ Cell states show correct colors
- ✅ Hour labels formatted correctly

---

### Test 5: Open Appointment Modal

**Steps:**
1. Click on an empty grid cell
2. Verify modal opens
3. Check pre-filled values

**Expected Results:**
- ✅ Modal appears
- ✅ Modal title: "Add Appointment"
- ✅ Therapist pre-selected (matches cell)
- ✅ Hour pre-selected (matches cell)
- ✅ Patient ID field empty
- ✅ Kind selector shows STANDARD/EXTRA_CARE
- ✅ Submit button present

---

### Test 6: Create Appointment - Success Path

**Steps:**
1. Click empty cell (e.g., 2 PM)
2. Fill Patient ID with valid ID
3. Select "STANDARD" type
4. Add optional note
5. Click "Create Appointment"
6. Wait for response
7. Take snapshot of updated grid

**Expected Results:**
- ✅ Modal closes
- ✅ Success message/toast appears
- ✅ Grid refreshes
- ✅ New appointment appears in correct cell
- ✅ Capacity badge updates (e.g., 0/2 → 1/2)
- ✅ Cell color changes to "partial" state

---

### Test 7: Create Appointment - Error Handling

**Steps:**
1. Click empty cell
2. Fill Patient ID with **invalid** ID (99999)
3. Click "Create Appointment"
4. Take screenshot of error

**Expected Results:**
- ✅ Error message appears
- ✅ Message mentions "no active plan" or "not found"
- ✅ Modal stays open
- ✅ No appointment created
- ✅ Grid unchanged

---

### Test 8: Create Extra-Care Appointment

**Steps:**
1. Click empty cell
2. Fill valid Patient ID
3. Select "EXTRA_CARE" type
4. Submit
5. Verify cell state

**Expected Results:**
- ✅ Appointment created
- ✅ Cell capacity shows 1/1
- ✅ Cell turns orange (extra-care color)
- ✅ Cell has extra-care indicator/tag

---

### Test 9: Capacity Enforcement

**Steps:**
1. Create 1st appointment in a cell (STANDARD)
2. Create 2nd appointment in same cell (STANDARD)
3. Try to create 3rd appointment (should fail)

**Expected Results:**
- ✅ First appointment succeeds (0/2 → 1/2)
- ✅ Second appointment succeeds (1/2 → 2/2)
- ✅ Cell turns "full" color (purple)
- ✅ Third attempt shows error or capacity warning

---

### Test 10: Overbooking Queue - Add Patient

**Steps:**
1. Scroll to sidebar
2. Click "Add Patient to Queue" button
3. Fill modal with patient details
4. Check "Extra Care" checkbox
5. Add reason text
6. Submit
7. Take snapshot

**Expected Results:**
- ✅ Modal opens with queue form
- ✅ Can fill all fields
- ✅ Modal closes on submit
- ✅ New item appears in queue list
- ✅ Priority shows "HIGH" (from extra-care)
- ✅ Patient ID displayed
- ✅ Action buttons (Place, Remove) visible

---

### Test 11: Overbooking Queue - Remove Patient

**Steps:**
1. Find patient in queue
2. Click "Remove" button
3. Confirm if needed
4. Verify removal

**Expected Results:**
- ✅ Confirmation dialog appears (if implemented)
- ✅ Item removed from queue list
- ✅ Queue count decreases
- ✅ Empty state shows if queue becomes empty

---

### Test 12: Auto-Assign Button

**Steps:**
1. Click "Auto-assign" button
2. Take screenshot of result

**Expected Results:**
- ✅ Button is clickable
- ✅ Shows error/info message
- ✅ Message says "not yet implemented" or similar
- ✅ No crashes or unexpected behavior

---

### Test 13: Responsive Behavior

**Steps:**
1. Resize browser to mobile width (375px)
2. Take screenshot
3. Resize to tablet (768px)
4. Take screenshot
5. Resize to desktop (1280px)
6. Take screenshot

**Expected Results:**
- ✅ Layout adapts to screen size
- ✅ No horizontal scroll
- ✅ All elements accessible
- ✅ Grid remains functional
- ✅ Sidebar stacks on mobile

---

### Test 14: Network Error Handling

**Steps:**
1. Use browser tools to simulate offline/slow network
2. Try to load scheduler
3. Take screenshot of error state

**Expected Results:**
- ✅ Error boundary catches failures
- ✅ Friendly error message shown
- ✅ Retry button available
- ✅ No white screen of death

---

### Test 15: Console Errors Check

**Steps:**
1. Open browser console
2. Navigate scheduler and interact
3. List all console errors/warnings

**Expected Results:**
- ✅ No critical errors
- ✅ No React warnings
- ✅ No 404 network errors
- ✅ Only expected logs present

---

## 🤖 Automated Test Script

Here's the automated browser test sequence:

```javascript
// Test Script Outline
async function runSchedulerTests() {
  const results = [];
  
  // Test 1: Navigate and Load
  await navigateToScheduler();
  results.push(await verifyPageLoad());
  
  // Test 2: Test Grid Interaction
  results.push(await testGridCellClick());
  
  // Test 3: Create Appointment
  results.push(await testCreateAppointment());
  
  // Test 4: Test Filters
  results.push(await testTherapistFilter());
  results.push(await testDatePicker());
  
  // Test 5: Test Queue
  results.push(await testAddToQueue());
  results.push(await testRemoveFromQueue());
  
  // Test 6: Edge Cases
  results.push(await testInvalidPatient());
  results.push(await testCapacityLimit());
  
  return generateReport(results);
}
```

---

## 📊 Test Report Template

After running tests, generate a report:

```markdown
# Scheduler Test Report

**Date**: [DATE]
**Duration**: [TIME]
**Browser**: Chrome/Firefox/Safari
**Tests Run**: 15
**Tests Passed**: X
**Tests Failed**: Y

## Summary
- ✅ Core functionality working
- ✅ UI responsive and accessible
- ❌ [Any failures]

## Failed Tests
1. Test X: [Description]
   - Expected: ...
   - Actual: ...
   - Screenshot: [link]

## Performance
- Page load: Xs
- Grid render: Xs
- Modal open: Xs

## Recommendations
- [Any improvements needed]
```

---

## 🎯 Success Criteria

**All tests pass if:**
- No JavaScript errors in console
- All UI interactions work as expected
- Data displays correctly
- Error handling is graceful
- No visual regressions
- Responsive design works
- Network errors handled properly

---

## 📸 Screenshots to Capture

1. Initial page load
2. Grid with appointments
3. Modal open
4. Success state
5. Error state
6. Queue with items
7. Empty queue state
8. Mobile view
9. Tablet view
10. Desktop view

---

## 🔄 Running the Tests

### Manual Execution
1. Follow each test step manually
2. Take screenshots at each step
3. Document results
4. Note any failures

### Automated Execution
1. Use Browser MCP tools
2. Run test script
3. Capture all interactions
4. Generate report automatically

---

## 🐛 Known Issues to Watch For

1. **Race conditions** - Rapid clicks might cause issues
2. **Cache issues** - Old data might show initially
3. **Timezone problems** - Time conversion edge cases
4. **Network timeouts** - Slow APIs might timeout
5. **Modal focus** - Focus might not trap correctly

---

## ✅ Pre-Test Checklist

Before starting tests:
- [ ] Backend is running and accessible
- [ ] Frontend is running and accessible
- [ ] Database has test data
- [ ] At least 1 therapist exists
- [ ] At least 1 patient with active plan exists
- [ ] Browser console is clear
- [ ] Network tab is recording
- [ ] Screenshots directory is ready

---

## 🚀 Next Steps After Testing

If all tests pass:
1. Deploy to staging environment
2. Request stakeholder review
3. Create user documentation
4. Plan training session

If tests fail:
1. Document failures
2. Create bug tickets
3. Fix critical issues
4. Re-run failed tests
5. Full regression test

---

**Ready to run?** Let me know and I'll execute the automated test suite using the Browser tools!

