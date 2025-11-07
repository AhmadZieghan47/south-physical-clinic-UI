# Memory Leak Prevention Guide

**For:** South Physical Clinic UI Development Team  
**Purpose:** Best practices and patterns to prevent memory leaks in React applications

---

## 🎯 Core Principles

1. **Always limit unbounded growth** - Arrays, Maps, Sets should have maximum sizes
2. **Clean up side effects** - Every `useEffect` should have a cleanup return
3. **Memoize expensive operations** - Use `useMemo` and `useCallback` appropriately
4. **Clear references** - Set state to `null` when data is no longer needed
5. **Validate API responses** - Never assume response structure

---

## 🔧 Common Patterns & Fixes

### Pattern 1: Array Operations

#### ❌ BAD: Unbounded Array Growth
```typescript
const allAppointments = useMemo(() => {
  const rows: AppointmentRow[] = [];
  plans.forEach(plan => {
    plan.appointments?.forEach(apt => {
      rows.push({ ...apt }); // Could be thousands!
    });
  });
  return rows;
}, [plans]);
```

#### ✅ GOOD: Limited Array Growth
```typescript
const MAX_VISIBLE_APPOINTMENTS = 500;

const allAppointments = useMemo(() => {
  const rows: AppointmentRow[] = [];
  
  for (const plan of plans) {
    if (rows.length >= MAX_VISIBLE_APPOINTMENTS) break;
    
    for (const apt of plan.appointments || []) {
      if (rows.length >= MAX_VISIBLE_APPOINTMENTS) break;
      rows.push({ ...apt });
    }
  }
  
  return rows;
}, [plans]);
```

**Why:** Prevents memory growth with patients who have extensive history.

---

### Pattern 2: Effect Cleanup

#### ❌ BAD: Missing Cleanup
```typescript
useEffect(() => {
  window.addEventListener('resize', handleResize);
  const timer = setInterval(fetchData, 30000);
  // No cleanup!
}, []);
```

#### ✅ GOOD: Proper Cleanup
```typescript
useEffect(() => {
  window.addEventListener('resize', handleResize);
  const timer = setInterval(fetchData, 30000);
  
  return () => {
    window.removeEventListener('resize', handleResize);
    clearInterval(timer);
  };
}, [handleResize, fetchData]);
```

**Why:** Prevents listener accumulation and timer leaks on component unmount.

---

### Pattern 3: Memoization

#### ❌ BAD: Re-creating on Every Render
```typescript
function SchedulerBoard({ appointments, therapists }) {
  // Creates new Map every render!
  const appointmentMap = new Map();
  appointments.forEach(apt => {
    // populate map
  });
  
  // Creates new array every render!
  const filteredTherapists = therapists.filter(t => t.active);
  
  return <Board map={appointmentMap} therapists={filteredTherapists} />;
}
```

#### ✅ GOOD: Memoized Computation
```typescript
function SchedulerBoard({ appointments, therapists }) {
  const appointmentMap = useMemo(() => {
    const map = new Map();
    appointments.forEach(apt => {
      // populate map
    });
    return map;
  }, [appointments]);
  
  const filteredTherapists = useMemo(
    () => therapists.filter(t => t.active),
    [therapists]
  );
  
  return <Board map={appointmentMap} therapists={filteredTherapists} />;
}
```

**Why:** Reduces GC pressure and improves render performance.

---

### Pattern 4: Modal State Management

#### ❌ BAD: Retained References
```typescript
const [isOpen, setIsOpen] = useState(false);
const [selectedData, setSelectedData] = useState(null);

const handleClose = () => {
  setIsOpen(false);
  // selectedData still holds reference!
};
```

#### ✅ GOOD: Cleared References
```typescript
const [isOpen, setIsOpen] = useState(false);
const [selectedData, setSelectedData] = useState(null);

const handleClose = () => {
  setIsOpen(false);
  setSelectedData(null); // Clear reference
};
```

**Why:** Allows garbage collector to free the data object.

---

### Pattern 5: API Response Validation

#### ❌ BAD: Assuming Response Type
```typescript
const fetchItems = async () => {
  const response = await api.get('/items');
  setItems(response.data); // What if data is not an array?
};
```

#### ✅ GOOD: Validated Response
```typescript
import { ensureArray } from '@/api/helpers';

const fetchItems = async () => {
  const response = await api.get('/items');
  setItems(ensureArray<Item>(response.data));
};

// Or inline validation
const fetchItems = async () => {
  const response = await api.get('/items');
  setItems(Array.isArray(response.data) ? response.data : []);
};
```

**Why:** Prevents storing wrong data type which causes crashes and memory issues.

---

### Pattern 6: Large Datasets - Pagination

#### ❌ BAD: Loading Everything
```typescript
const fetchAllData = async () => {
  const response = await api.get('/data'); // Could be 10,000+ records
  setData(response.data);
};
```

#### ✅ GOOD: Paginated Loading
```typescript
const MAX_PAGE_SIZE = 100;

const fetchData = async (page: number, pageSize: number) => {
  const cappedPageSize = Math.min(pageSize, MAX_PAGE_SIZE);
  const response = await api.get('/data', {
    params: { page, pageSize: cappedPageSize }
  });
  setData(response.data);
};
```

**Why:** Prevents loading excessive data into memory.

---

### Pattern 7: Long Lists - Virtualization

#### ❌ BAD: Rendering All Rows
```typescript
<table>
  <tbody>
    {appointments.map(apt => (
      <AppointmentRow key={apt.id} data={apt} />
    ))}
  </tbody>
</table>
```

#### ✅ GOOD: Virtualized List (for 500+ rows)
```typescript
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={appointments.length}
  itemSize={60}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <AppointmentRow data={appointments[index]} />
    </div>
  )}
</FixedSizeList>
```

**Why:** Only renders visible rows, significantly reduces DOM nodes.

---

### Pattern 8: Chart Cleanup

#### ❌ BAD: No Cleanup
```typescript
useEffect(() => {
  const chart = new ApexCharts(chartRef.current, options);
  chart.render();
  // No cleanup!
}, [options]);
```

#### ✅ GOOD: Destroy on Unmount
```typescript
useEffect(() => {
  const chart = new ApexCharts(chartRef.current, options);
  chart.render();
  
  return () => {
    chart.destroy();
  };
}, [options]);
```

**Why:** Prevents chart instances from accumulating in memory.

---

## 🧪 Testing for Memory Leaks

### Manual Testing Checklist

Before submitting PR, manually verify:

1. **Tab Switching Test**
   - Open page
   - Switch between tabs 10 times
   - Check DevTools Memory tab
   - ✅ No growing heap size

2. **Modal Test**
   - Open and close modal 20 times
   - ✅ No detached DOM nodes

3. **Filter/Search Test**
   - Apply and clear filters 10 times
   - ✅ Memory returns to baseline

4. **Pagination Test**
   - Navigate through pages forward and backward
   - ✅ No accumulating data

### Automated Testing

Run memory regression tests:
```bash
npm run test:memory
```

See `tests/memory-leaks.spec.ts` for test examples.

---

## 📋 Code Review Checklist

When reviewing PRs, check for:

### Arrays & Collections
- [ ] All arrays have max size limits (or use pagination)
- [ ] Maps and Sets are cleared when no longer needed
- [ ] No unbounded `.push()` or `.concat()` operations

### Effects & Listeners
- [ ] All `useEffect` hooks have cleanup returns
- [ ] Event listeners are removed
- [ ] Timers (setTimeout/setInterval) are cleared
- [ ] Subscriptions are unsubscribed

### Memoization
- [ ] Expensive computations use `useMemo`
- [ ] Callback functions use `useCallback` when passed as props
- [ ] Dependencies arrays are correct and complete

### State Management
- [ ] Modal state is cleared on close
- [ ] Form data is reset after submit
- [ ] Selections are cleared when navigating away

### API Calls
- [ ] Responses are validated before storing in state
- [ ] Error objects are not accumulated
- [ ] Requests can be cancelled (AbortController)

### Rendering
- [ ] Large lists use virtualization (>500 items)
- [ ] Tables have pagination
- [ ] Images are lazy-loaded

---

## 🚨 Red Flags - Signs of Memory Leaks

Watch for these warning signs:

1. **Growing Heap Size**
   - Normal: ↗️↘️ (sawtooth pattern from GC)
   - Leak: ↗️↗️↗️ (continuous growth)

2. **Slow Performance Over Time**
   - App starts fast, gets slower after 30 minutes
   - Indicates accumulating objects

3. **Detached DOM Nodes**
   - More than 10-20 detached nodes
   - Check with Chrome DevTools Memory profiler

4. **Tab Crashes**
   - "Out of Memory" errors
   - Browser tab becomes unresponsive

5. **Growing Arrays in Snapshots**
   - Arrays with 1000+ items that keep growing
   - Check heap snapshots for large arrays

---

## 🛠️ Debugging Tools

### Chrome DevTools Memory Profiler

1. **Heap Snapshot**
   - Shows current memory state
   - Compare before/after interactions
   - Find detached DOM nodes

2. **Allocation Timeline**
   - Shows allocations over time
   - Identify what's not being freed
   - Blue bars = allocations

3. **Allocation Sampling**
   - Lower overhead than timeline
   - Good for production debugging

### React DevTools Profiler

1. Shows component render counts
2. Identifies unnecessary re-renders
3. Highlights expensive components

### Performance Monitor

1. Press `Ctrl+Shift+P` → "Show Performance Monitor"
2. Watch:
   - JS heap size (should stabilize)
   - DOM nodes (should not grow unbounded)
   - Event listeners (should not accumulate)

---

## 📚 Learning Resources

### Essential Reading
- [MDN: Memory Management](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)
- [Chrome DevTools: Fix Memory Problems](https://developer.chrome.com/docs/devtools/memory-problems/)
- [React: Cleaning Up Effects](https://react.dev/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

### Advanced Topics
- [JavaScript Garbage Collection](https://javascript.info/garbage-collection)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [Web Performance Best Practices](https://web.dev/vitals/)

---

## 🎓 Training Exercises

### Exercise 1: Identify the Leak

```typescript
function BadComponent() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    const ws = new WebSocket('ws://api.example.com');
    ws.onmessage = (event) => {
      setData(prev => [...prev, event.data]);
    };
  }, []);
  
  return <div>{data.map(item => <p>{item}</p>)}</div>;
}
```

**Question:** What are the memory leaks? How to fix?

<details>
<summary>Answer</summary>

**Leaks:**
1. WebSocket never closed
2. Array grows unbounded
3. No cleanup function

**Fix:**
```typescript
function GoodComponent() {
  const [data, setData] = useState([]);
  const MAX_ITEMS = 100;
  
  useEffect(() => {
    const ws = new WebSocket('ws://api.example.com');
    
    ws.onmessage = (event) => {
      setData(prev => {
        const newData = [...prev, event.data];
        return newData.slice(-MAX_ITEMS); // Keep only last 100
      });
    };
    
    return () => {
      ws.close(); // Cleanup
    };
  }, []);
  
  return <div>{data.map(item => <p key={item.id}>{item}</p>)}</div>;
}
```
</details>

---

## ✅ Quick Reference

### Do's
✅ Limit array sizes  
✅ Clean up effects  
✅ Memoize expensive computations  
✅ Clear references when done  
✅ Validate API responses  
✅ Use pagination for large datasets  
✅ Virtualize long lists  
✅ Profile memory regularly  

### Don'ts
❌ Unbounded array growth  
❌ Missing effect cleanup  
❌ Re-creating objects every render  
❌ Keeping stale references  
❌ Assuming API response types  
❌ Loading all data at once  
❌ Rendering 1000+ DOM nodes  
❌ Ignoring memory warnings  

---

**Remember:** Prevention is easier than debugging! 🚀

Apply these patterns consistently, and you'll avoid 90% of memory issues.

---

**Last Updated:** November 6, 2025  
**Maintained by:** South Physical Clinic Development Team

