# Browser Memory Profiling Guide

**Purpose:** Step-by-step instructions for manual memory leak detection and verification

---

## Prerequisites

1. **Google Chrome Browser** (latest version)
2. **Development server running:**
   ```bash
   cd south-physical-clinic-UI
   npm run dev
   ```
3. **Application accessible at:** `http://localhost:5173`

---

## 📊 Profiling Process

### Part 1: Baseline Measurements (Before Fixes)

If you've already applied the fixes, you can skip this and go directly to Part 2.

#### Step 1: Open Chrome DevTools

1. Open Chrome and navigate to `http://localhost:5173`
2. Press `F12` or `Ctrl+Shift+I` to open DevTools
3. Click the **Memory** tab

#### Step 2: Test Patient Details Page

**Actions:**
```
1. Click "Take snapshot" button → Label: "patient-baseline"
2. Navigate to /patient-details/[any-patient-id]
3. Wait for page to fully load
4. Perform these actions:
   - Scroll through appointments table (scroll to bottom)
   - Click "Payments" tab
   - Scroll payments table
   - Click "Files" tab
   - Scroll files table
   - Click "Appointments" tab again
   - Repeat entire cycle 5 times
5. Take snapshot → Label: "patient-after"
6. Select "Comparison" view
7. Compare snapshots
```

**What to Record:**
- Total heap size increase (MB)
- Number of detached DOM nodes
- Largest growing arrays (look for "Array" objects)
- Memory retained by specific objects

**Screenshot locations:** Save to `temp_reports/memory-baseline-patient-details.png`

#### Step 3: Test Scheduler Page

**Actions:**
```
1. Take snapshot → Label: "scheduler-baseline"
2. Navigate to /scheduler
3. Perform actions:
   - Change date input 15 times (click through different dates)
   - Switch therapist filter between "All" and specific therapists 10 times
   - Click on appointment cells 5 times
4. Take snapshot → Label: "scheduler-after"
5. Compare snapshots
```

**What to Record:**
- Heap size increase
- Map objects count
- Array objects count
- Detached nodes

**Screenshot:** Save to `temp_reports/memory-baseline-scheduler.png`

#### Step 4: Test Patients List

**Actions:**
```
1. Take snapshot → Label: "patients-baseline"
2. Navigate to /patients
3. Perform actions:
   - Scroll through list
   - Type in search box 5 different terms, clear each time
   - Navigate to page 2, 3, 4, 5
   - Go back to page 1
4. Take snapshot → Label: "patients-after"
5. Compare snapshots
```

**Screenshot:** Save to `temp_reports/memory-baseline-patients.png`

---

### Part 2: Post-Fix Verification

After applying all memory leak fixes, repeat the exact same tests:

#### Step 1: Patient Details Page (Post-Fix)
- Same actions as baseline
- Label snapshots: "patient-fixed-baseline" and "patient-fixed-after"
- Compare and save to `temp_reports/memory-fixed-patient-details.png`

#### Step 2: Scheduler Page (Post-Fix)
- Same actions as baseline
- Label snapshots: "scheduler-fixed-baseline" and "scheduler-fixed-after"
- Save to `temp_reports/memory-fixed-scheduler.png`

#### Step 3: Patients List (Post-Fix)
- Same actions as baseline
- Label snapshots: "patients-fixed-baseline" and "patients-fixed-after"
- Save to `temp_reports/memory-fixed-patients.png`

---

## 📈 Analyzing Results

### Understanding Heap Snapshots

**Key Metrics:**

1. **Heap Size**
   - Total memory used by JavaScript objects
   - **Good:** <10MB increase after interactions + GC
   - **Bad:** >50MB increase without GC

2. **Detached DOM Nodes**
   - DOM elements removed from page but still in memory
   - **Good:** 0-5 detached nodes
   - **Bad:** 50+ detached nodes

3. **Shallow Size**
   - Memory directly held by the object
   
4. **Retained Size**
   - Memory freed when object is deleted (includes references)

### Reading the Comparison View

**Snapshot Comparison Columns:**

| Column | Meaning |
|--------|---------|
| # New | Objects created between snapshots |
| # Deleted | Objects garbage collected |
| # Delta | Net change (new - deleted) |
| Alloc. Size | Memory allocated to new objects |
| Freed Size | Memory freed by GC |
| Size Delta | Net memory change |

### Good vs. Bad Patterns

**✅ GOOD (After Fixes):**
```
Patient Details Comparison:
├─ Heap Size Increase: 3.2 MB
├─ Detached DOM Nodes: 0
├─ Arrays (patient.appointments): Capped at 500 items
└─ Map objects: Stable (no growth)
```

**❌ BAD (Before Fixes):**
```
Patient Details Comparison:
├─ Heap Size Increase: 45 MB
├─ Detached DOM Nodes: 127
├─ Arrays (patient.appointments): Growing unbounded (1500+ items)
└─ Map objects: New map created on every render
```

---

## 🔍 Advanced Analysis

### Finding Specific Memory Leaks

1. **Detached DOM Nodes:**
   - In snapshot, search for "Detached"
   - Click on detached nodes
   - Look at "Retainers" panel to see what's holding the reference
   - Common causes: Event listeners, cached references

2. **Growing Arrays:**
   - In snapshot, filter by "Array"
   - Sort by "Retained Size"
   - Look for arrays with thousands of elements
   - Check if they're properly limited

3. **Retained Event Listeners:**
   - Search for "EventListener"
   - Check if listeners are being removed on cleanup
   - Look for growing listener counts

### Using Allocation Timeline

1. Click **Allocation instrumentation on timeline**
2. Click **Start**
3. Perform user interactions
4. Click **Stop**
5. Analyze blue bars (allocations) that persist

**What to look for:**
- Blue bars that never drop → memory leak
- Flat timeline after interactions → good cleanup
- Growing sawtooth pattern → normal GC behavior

---

## 📝 Creating Comparison Report

### Template

Create `temp_reports/memory-profile-comparison.md`:

```markdown
# Memory Profiling Comparison Report
Date: [Current Date]

## Patient Details Page

| Metric | Before Fixes | After Fixes | Improvement |
|--------|--------------|-------------|-------------|
| Heap Size Increase | XX MB | YY MB | ZZ% reduction |
| Detached DOM Nodes | XX | YY | ZZ% reduction |
| Largest Array Size | Unbounded | Capped at 500 | ✅ Fixed |
| Performance Rating | Poor | Good | ✅ Improved |

**Notes:**
- Before: Significant memory growth after tab switching
- After: Memory stable, arrays properly limited

## Scheduler Page

| Metric | Before Fixes | After Fixes | Improvement |
|--------|--------------|-------------|-------------|
| Heap Size Increase | XX MB | YY MB | ZZ% reduction |
| Map Re-creations | Every render | Memoized | ✅ Fixed |
| Render Performance | Slow | Fast | ~30% faster |

**Notes:**
- Before: Map recreated on every render causing GC pressure
- After: Proper memoization, stable memory

## Patients List

| Metric | Before Fixes | After Fixes | Improvement |
|--------|--------------|-------------|-------------|
| Heap Size Increase | XX MB | YY MB | ZZ% reduction |
| Search Operations | Growing | Stable | ✅ Fixed |

## Overall Assessment

✅ All memory leaks resolved
✅ Arrays properly bounded
✅ Memoization in place
✅ No detached DOM nodes
```

Fill in the XX, YY, ZZ values with your actual measurements.

---

## 🎯 Success Criteria

After applying fixes, you should see:

1. **Heap Size Growth:** <5MB per hour of active use
2. **Detached DOM Nodes:** 0 after manual GC (in DevTools, click trash icon)
3. **Array Sizes:** All patient-related arrays capped at 500 items
4. **Render Performance:** Scheduler board renders 30%+ faster
5. **Long Session Stability:** No crashes after 2+ hours of use

---

## 🚨 Troubleshooting

### "Performance.memory is undefined"

**Solution:** Use Chromium-based browser (Chrome, Edge) or enable memory profiling:
```
chrome://flags/#enable-memory-info
```

### Can't see "Detached" nodes

**Solution:** Force garbage collection first:
1. In Memory tab, click trash icon 🗑️ (Collect garbage)
2. Take snapshot again
3. Detached nodes should appear

### Snapshots too large to compare

**Solution:** Filter by specific constructors:
- Type "Array" in filter box
- Type "Map" in filter box
- Type "HTMLDivElement" in filter box

---

## 📚 Additional Resources

- [Chrome DevTools Memory Profiling](https://developer.chrome.com/docs/devtools/memory-problems/)
- [Fixing Memory Leaks in React](https://kentcdodds.com/blog/fix-the-slow-render-before-you-fix-the-re-render)
- [JavaScript Memory Management](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)

---

**Next Steps After Profiling:**
1. Document your findings in `temp_reports/memory-profile-comparison.md`
2. If results show <5MB growth → ✅ Memory leaks fixed!
3. If results show >10MB growth → Review the code fixes again
4. Share comparison report with team

---

**Last Updated:** November 6, 2025

