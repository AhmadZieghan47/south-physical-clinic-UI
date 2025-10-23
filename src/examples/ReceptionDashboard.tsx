import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// ---------- Types (adapt/replace with your typedefs.ts) ----------
export type ISODateTime = string;
export type Money = string;

export type AppointmentStatus =
  | "BOOKED"
  | "CHECKED_IN"
  | "COMPLETED"
  | "CANCELLED"
  | "RESCHEDULED";
export type SessionType =
  | "STANDARD"
  | "EXTRA_CARE"
  | "NEAR"
  | "HOME_VISIT"
  | "OTHER";

interface Therapist {
  id: number;
  fullName: string;
}
interface Patient {
  id: number;
  fullName: string;
  isActive: boolean;
}

interface Appointment {
  id: number;
  startAt: ISODateTime; // ISO string
  patient: Patient;
  therapist: Therapist;
  sessionType: SessionType;
  status: AppointmentStatus;
}

interface QueueItem {
  id: number;
  patientName: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  notes?: string;
}
interface BalanceItem {
  id: number;
  patientName: string;
  outstanding: number;
  lastVisit?: string;
}

// ---------- Helpers ----------
// Format HH:mm from ISO
const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// Simple message function (replace with proper notification system)
const message = {
  info: (text: string) => {
    // Simple alert for now - replace with proper notification system
    alert(text);
  },
  error: (text: string) => {
    alert(text);
  }
};

// ---------- Mock data & data hook (replace with real API calls) ----------
const useReceptionData = () => {
  const [loading, setLoading] = useState(false);
  const [therapists] = useState<Therapist[]>([
    { id: 1, fullName: "Dr. Ahmed" },
    { id: 2, fullName: "Dr. Sara" },
    { id: 3, fullName: "Dr. Omar" },
  ]);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [queue, setQueue] = useState<QueueItem[]>([
    {
      id: 100,
      patientName: "John Doe",
      priority: "HIGH",
      notes: "Severe pain",
    },
    { id: 101, patientName: "Mariam Ali", priority: "MEDIUM" },
  ]);

  const [balances, setBalances] = useState<BalanceItem[]>([
    {
      id: 1,
      patientName: "Mohammad Yousef",
      outstanding: 25.0,
      lastVisit: new Date().toISOString(),
    },
    { id: 2, patientName: "Nour Hasan", outstanding: 60.0 },
  ]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // TODO: replace with real API fetch calls
      // Example endpoints (adjust):
      // GET /api/appointments/today?status=BOOKED,CHECKED_IN
      // GET /api/queue
      // GET /api/balances/outstanding
      const now = new Date();
      const baseDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
      const mkTime = (h: number, m: number) =>
        new Date(baseDay.getTime() + h * 3600000 + m * 60000).toISOString();

      const sample: Appointment[] = [
        {
          id: 11,
          startAt: mkTime(9, 0),
          patient: { id: 1, fullName: "Ali Saleh", isActive: true },
          therapist: { id: 1, fullName: "Dr. Ahmed" },
          sessionType: "STANDARD",
          status: "BOOKED",
        },
        {
          id: 12,
          startAt: mkTime(9, 30),
          patient: { id: 2, fullName: "Layla H.", isActive: true },
          therapist: { id: 2, fullName: "Dr. Sara" },
          sessionType: "EXTRA_CARE",
          status: "CHECKED_IN",
        },
        {
          id: 13,
          startAt: mkTime(10, 0),
          patient: { id: 3, fullName: "Omar T.", isActive: true },
          therapist: { id: 1, fullName: "Dr. Ahmed" },
          sessionType: "STANDARD",
          status: "BOOKED",
        },
        {
          id: 14,
          startAt: mkTime(10, 30),
          patient: { id: 4, fullName: "Heba S.", isActive: true },
          therapist: { id: 3, fullName: "Dr. Omar" },
          sessionType: "NEAR",
          status: "BOOKED",
        },
        {
          id: 15,
          startAt: mkTime(11, 0),
          patient: { id: 5, fullName: "Yousef A.", isActive: true },
          therapist: { id: 2, fullName: "Dr. Sara" },
          sessionType: "STANDARD",
          status: "CHECKED_IN",
        },
      ];
      setAppointments(sample);
    } catch (e) {
      console.error(e);
      message.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    loading,
    therapists,
    appointments,
    setAppointments,
    queue,
    setQueue,
    balances,
    setBalances,
    refresh: fetchData,
  };
};

// ---------- Main Component ----------
export default function ReceptionDashboard() {
  const navigate = useNavigate();
  const {
    loading,
    therapists,
    appointments,
    setAppointments,
    queue,
    setQueue,
    balances,
    refresh,
  } = useReceptionData();

  // Filters
  const [fTherapist, setFTherapist] = useState<number | "ALL">("ALL");
  const [fSessionType, setFSessionType] = useState<SessionType | "ALL">("ALL");
  const [fStatus, setFStatus] = useState<AppointmentStatus[] | "ALL">([
    "BOOKED",
    "CHECKED_IN",
  ]); // default from Q14
  const [fPayment, setFPayment] = useState<"ALL" | "CASH" | "INSURANCE">("ALL"); // placeholder for future use
  const [fTimeRange, setFTimeRange] = useState<
    "TODAY" | "MORNING" | "AFTERNOON"
  >("TODAY");

  // Derived / filtered appointments
  const filteredAppointments = useMemo(() => {
    const inRange = (iso: string) => {
      const d = new Date(iso);
      const h = d.getHours();
      if (fTimeRange === "MORNING") return h < 12;
      if (fTimeRange === "AFTERNOON") return h >= 12;
      return true;
    };
    return appointments.filter(
      (a) =>
        (fTherapist === "ALL" || a.therapist.id === fTherapist) &&
        (fSessionType === "ALL" || a.sessionType === fSessionType) &&
        (fStatus === "ALL" || fStatus.includes(a.status)) &&
        inRange(a.startAt)
    );
  }, [appointments, fTherapist, fSessionType, fStatus, fTimeRange]);

  // KPI computations (booked/check-in/completed/cancelled/queue/free slots/inactivity/balances/discounts)
  const kpis = useMemo(() => {
    const counts = appointments.reduce(
      (acc, a) => {
        acc[a.status]++;
        return acc;
      },
      { BOOKED: 0, CHECKED_IN: 0, COMPLETED: 0, CANCELLED: 0, RESCHEDULED: 0 } as Record<
        AppointmentStatus,
        number
      >
    );
    const queueCount = queue.length;
    const freeSlotsRemaining = Math.max(
      0,
      16 - (counts.BOOKED + counts.CHECKED_IN)
    ); // TODO: derive using real capacity rules
    const inactivityAlerts = 3; // TODO: get from API (plans without booking for 7 days)
    const outstandingPatients = balances.length;
    const discountPending = 0; // TODO: fetch
    return {
      counts,
      queueCount,
      freeSlotsRemaining,
      inactivityAlerts,
      outstandingPatients,
      discountPending,
    };
  }, [appointments, queue, balances]);

  // Payments Modal state
  const [paymentsOpen, setPaymentsOpen] = useState(false);

  // Queue add form
  const addQueueItem = (values: any) => {
    const newItem: QueueItem = {
      id: Date.now(),
      patientName: values.patientName,
      priority: values.priority,
      notes: values.notes,
    };
    setQueue((prev) => [newItem, ...prev]);
  };

  const onOpenScheduler = () => navigate("/appointments");

  return (
    <>
      {/* ========================
			Start Page Content
		========================= */}
    <div className="page-wrapper">
        {/* Start Content */}
        <div className="content pb-0">
          {/* Page Header */}
          <div className="d-flex align-items-sm-center justify-content-between flex-wrap gap-2 mb-4">
            <div>
              <h4 className="fw-bold mb-0">Reception Dashboard</h4>
            </div>
            <div className="d-flex align-items-center flex-wrap gap-2">
              <button
                className="btn btn-outline-white bg-white d-inline-flex align-items-center"
                onClick={refresh}
                disabled={loading}
              >
                <i className="ti ti-refresh me-1" />
                Refresh
              </button>
              <button
                className="btn btn-primary d-inline-flex align-items-center"
                onClick={onOpenScheduler}
              >
                <i className="ti ti-calendar-time me-1" />
                Open Scheduler
              </button>
          </div>
          </div>
          {/* End Page Header */}

          {/* Filters */}
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-2">
                  <label className="form-label text-muted">
                    <i className="ti ti-filter me-1" />
                    Therapist
                  </label>
                  <select
                    className="form-select"
                  value={fTherapist}
                    onChange={(e) => setFTherapist(e.target.value === "ALL" ? "ALL" : Number(e.target.value))}
                  >
                    <option value="ALL">All therapists</option>
                    {therapists.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.fullName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-2">
                  <label className="form-label text-muted">Session type</label>
                  <select
                    className="form-select"
                  value={fSessionType}
                    onChange={(e) => setFSessionType(e.target.value as SessionType | "ALL")}
                  >
                    <option value="ALL">All types</option>
                    <option value="STANDARD">Standard</option>
                    <option value="EXTRA_CARE">Extra-care</option>
                    <option value="NEAR">Near</option>
                    <option value="HOME_VISIT">Home visit</option>
                  </select>
                </div>

                <div className="col-md-2">
                  <label className="form-label text-muted">Status</label>
                  <select
                    className="form-select"
                    multiple
                  value={fStatus === "ALL" ? [] : fStatus}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions, option => option.value);
                      setFStatus(selected.length ? selected as AppointmentStatus[] : "ALL");
                    }}
                  >
                    <option value="BOOKED">Booked</option>
                    <option value="CHECKED_IN">Checked-in</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>

                <div className="col-md-2">
                  <label className="form-label text-muted">Payment</label>
                  <select
                    className="form-select"
                  value={fPayment}
                    onChange={(e) => setFPayment(e.target.value as "ALL" | "CASH" | "INSURANCE")}
                  >
                    <option value="ALL">All</option>
                    <option value="CASH">Cash</option>
                    <option value="INSURANCE">Insurance</option>
                  </select>
                </div>

                <div className="col-md-2">
                  <label className="form-label text-muted">Time range</label>
                  <select
                    className="form-select"
                  value={fTimeRange}
                    onChange={(e) => setFTimeRange(e.target.value as "TODAY" | "MORNING" | "AFTERNOON")}
                  >
                    <option value="TODAY">Today</option>
                    <option value="MORNING">Morning</option>
                    <option value="AFTERNOON">Afternoon</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* KPI Row */}
          <div className="row">
            <div className="col-xl-3 col-md-6">
              <div className="position-relative border card rounded-2 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-2 justify-content-between">
                    <span className="avatar bg-primary rounded-circle">
                      <i className="ti ti-calendar-heart fs-24" />
                    </span>
                    <div className="text-end">
                      <span className="badge px-2 py-1 fs-12 fw-medium d-inline-flex mb-1 bg-success">
                        +12%
                      </span>
                      <p className="fs-13 mb-0">vs yesterday</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <p className="mb-1">Booked today</p>
                      <h3 className="fw-bold mb-0">{kpis.counts.BOOKED}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6">
              <div className="position-relative border card rounded-2 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-2 justify-content-between">
                    <span className="avatar bg-success rounded-circle">
                      <i className="ti ti-check fs-24" />
                    </span>
                    <div className="text-end">
                      <span className="badge px-2 py-1 fs-12 fw-medium d-inline-flex mb-1 bg-success">
                        +8%
                      </span>
                      <p className="fs-13 mb-0">vs yesterday</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <p className="mb-1">Checked-in</p>
                      <h3 className="fw-bold mb-0">{kpis.counts.CHECKED_IN}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6">
              <div className="position-relative border card rounded-2 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-2 justify-content-between">
                    <span className="avatar bg-info rounded-circle">
                      <i className="ti ti-clipboard-check fs-24" />
                    </span>
                    <div className="text-end">
                      <span className="badge px-2 py-1 fs-12 fw-medium d-inline-flex mb-1 bg-success">
                        +15%
                      </span>
                      <p className="fs-13 mb-0">vs yesterday</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <p className="mb-1">Completed</p>
                      <h3 className="fw-bold mb-0">{kpis.counts.COMPLETED}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6">
              <div className="position-relative border card rounded-2 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-2 justify-content-between">
                    <span className="avatar bg-danger rounded-circle">
                      <i className="ti ti-x fs-24" />
                    </span>
                    <div className="text-end">
                      <span className="badge px-2 py-1 fs-12 fw-medium d-inline-flex mb-1 bg-danger">
                        -5%
                      </span>
                      <p className="fs-13 mb-0">vs yesterday</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <p className="mb-1">Cancellations</p>
                      <h3 className="fw-bold mb-0">{kpis.counts.CANCELLED}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6">
              <div className="position-relative border card rounded-2 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-2 justify-content-between">
                    <span className="avatar bg-warning rounded-circle">
                      <i className="ti ti-list-plus fs-24" />
                    </span>
                    <div className="text-end">
                      <span className="badge px-2 py-1 fs-12 fw-medium d-inline-flex mb-1 bg-warning">
                        +3
                      </span>
                      <p className="fs-13 mb-0">new today</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <p className="mb-1">Overbooking queue</p>
                      <h3 className="fw-bold mb-0">{kpis.queueCount}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6">
              <div className="position-relative border card rounded-2 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-2 justify-content-between">
                    <span className="avatar bg-secondary rounded-circle">
                      <i className="ti ti-clock fs-24" />
                    </span>
                    <div className="text-end">
                      <span className="badge px-2 py-1 fs-12 fw-medium d-inline-flex mb-1 bg-info">
                        Available
                      </span>
                      <p className="fs-13 mb-0">slots</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <p className="mb-1">Free slots remaining</p>
                      <h3 className="fw-bold mb-0">{kpis.freeSlotsRemaining}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6">
              <div className="position-relative border card rounded-2 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-2 justify-content-between">
                    <span className="avatar bg-warning rounded-circle">
                      <i className="ti ti-bell fs-24" />
                    </span>
                    <div className="text-end">
                      <span className="badge px-2 py-1 fs-12 fw-medium d-inline-flex mb-1 bg-warning">
                        ≥7d
                      </span>
                      <p className="fs-13 mb-0">inactive</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <p className="mb-1">Inactivity alerts</p>
                      <h3 className="fw-bold mb-0">{kpis.inactivityAlerts}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6">
              <div 
                className="position-relative border card rounded-2 shadow-sm"
                style={{ cursor: 'pointer' }}
                onClick={() => setPaymentsOpen(true)}
              >
                <div className="card-body">
                  <div className="d-flex align-items-center mb-2 justify-content-between">
                    <span className="avatar bg-primary rounded-circle">
                      <i className="ti ti-wallet fs-24" />
                    </span>
                    <div className="text-end">
                      <span className="badge px-2 py-1 fs-12 fw-medium d-inline-flex mb-1 bg-danger">
                        Outstanding
                      </span>
                      <p className="fs-13 mb-0">balances</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <p className="mb-1">Outstanding balances</p>
                      <h3 className="fw-bold mb-0">{kpis.outstandingPatients} <small className="fs-13 text-muted">patients</small></h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Appointments */}
          <div className="card shadow-sm">
            <div className="card-header d-flex align-items-center justify-content-between">
              <h5 className="fw-bold mb-0">Today's Appointments</h5>
              <div className="dropdown">
                <button
                  className="btn btn-sm px-2 border shadow-sm btn-outline-white d-inline-flex align-items-center"
                  data-bs-toggle="dropdown"
                >
                  All Status <i className="ti ti-chevron-down ms-1" />
                </button>
                <ul className="dropdown-menu">
                  <li><button className="dropdown-item">All Status</button></li>
                  <li><button className="dropdown-item">Booked</button></li>
                  <li><button className="dropdown-item">Checked-in</button></li>
                  <li><button className="dropdown-item">Completed</button></li>
                </ul>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive table-nowrap">
                <table className="table border">
                  <thead className="thead-light">
                    <tr>
                      <th>Time</th>
                      <th>Patient</th>
                      <th>Therapist</th>
                      <th>Session Type</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td>
                          <span className="fw-semibold">{fmtTime(appointment.startAt)}</span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div>
                              <h6 className="fs-14 mb-1 fw-semibold">{appointment.patient.fullName}</h6>
                              <p className="mb-0 fs-13 text-muted">#{appointment.patient.id}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="fw-medium">{appointment.therapist.fullName}</span>
                        </td>
                        <td>
                          <span className={`badge fs-13 py-1 ${
                            appointment.sessionType === 'STANDARD' ? 'badge-soft-primary border border-primary' :
                            appointment.sessionType === 'EXTRA_CARE' ? 'badge-soft-purple border border-purple' :
                            appointment.sessionType === 'NEAR' ? 'badge-soft-info border border-info' :
                            appointment.sessionType === 'HOME_VISIT' ? 'badge-soft-warning border border-warning' :
                            'badge-soft-secondary border border-secondary'
                          } rounded fw-medium`}>
                            {appointment.sessionType === 'STANDARD' ? 'Standard' :
                             appointment.sessionType === 'EXTRA_CARE' ? 'Extra-care' :
                             appointment.sessionType === 'NEAR' ? 'Near' :
                             appointment.sessionType === 'HOME_VISIT' ? 'Home visit' :
                             'Other'}
                          </span>
                        </td>
                        <td>
                          <span className={`badge fs-13 py-1 ${
                            appointment.status === 'BOOKED' ? 'badge-soft-info border border-info' :
                            appointment.status === 'CHECKED_IN' ? 'badge-soft-primary border border-primary' :
                            appointment.status === 'COMPLETED' ? 'badge-soft-success border border-success' :
                            'badge-soft-danger border border-danger'
                          } rounded fw-medium`}>
                            {appointment.status === 'BOOKED' ? 'Booked' :
                             appointment.status === 'CHECKED_IN' ? 'Checked-in' :
                             appointment.status === 'COMPLETED' ? 'Completed' :
                             'Cancelled'}
                          </span>
                        </td>
                        <td>
                          <div className="dropdown">
                            <button
                              className="btn btn-sm btn-outline-white"
                              data-bs-toggle="dropdown"
                            >
                              <i className="ti ti-dots-vertical" />
                            </button>
                            <ul className="dropdown-menu">
                              <li>
                                <button 
                                  className="dropdown-item"
                                  onClick={() => {
                                    setAppointments((prev) =>
                                      prev.map((x) =>
                                        x.id === appointment.id ? { ...x, status: "CHECKED_IN" } : x
                                      )
                                    );
                                  }}
                                >
                                  Mark as Checked-in
                                </button>
                              </li>
                              <li>
                                <button 
                                  className="dropdown-item"
                                  onClick={() => {
                                    setAppointments((prev) =>
                                      prev.map((x) =>
                                        x.id === appointment.id ? { ...x, status: "COMPLETED" } : x
                                      )
                                    );
                                  }}
                                >
                                  Mark as Completed
                                </button>
                              </li>
                              <li>
                                <button 
                                  className="dropdown-item"
                                  onClick={() => {
                                    setAppointments((prev) =>
                                      prev.map((x) =>
                                        x.id === appointment.id ? { ...x, status: "CANCELLED" } : x
                                      )
                                    );
                                  }}
                                >
                                  Cancel
                                </button>
                              </li>
                              <li><hr className="dropdown-divider" /></li>
                              <li><button className="dropdown-item">Open Patient</button></li>
                              <li><button className="dropdown-item">New Plan</button></li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Overbooking Queue and Alerts */}
          <div className="row">
            <div className="col-xl-6">
              <div className="card shadow-sm">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h5 className="fw-bold mb-0">
                    <i className="ti ti-list-plus me-2" />
                    Overbooking Queue
                  </h5>
                </div>
                <div className="card-body">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const values = {
                      patientName: formData.get('patientName'),
                      priority: formData.get('priority'),
                      notes: formData.get('notes')
                    };
                    if (values.patientName) {
                      addQueueItem(values);
                    }
                  }}>
                    <div className="row g-2 mb-3">
                      <div className="col-md-5">
                        <label className="form-label">Patient</label>
                        <input
                          type="text"
                          className="form-control"
                        name="patientName"
                          placeholder="Search or type patient name"
                          required
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Priority</label>
                        <select className="form-select" name="priority" defaultValue="MEDIUM">
                          <option value="HIGH">High</option>
                          <option value="MEDIUM">Medium</option>
                          <option value="LOW">Low</option>
                        </select>
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Notes</label>
                        <input
                          type="text"
                          className="form-control"
                          name="notes"
                          placeholder="Optional"
                        />
                      </div>
                      <div className="col-md-1 d-flex align-items-end">
                        <button type="submit" className="btn btn-primary">
                          Add
                        </button>
                      </div>
                    </div>
                  </form>

                  <div className="list-group list-group-flush">
                    {queue.map((item) => (
                      <div key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <span className={`badge me-2 ${
                            item.priority === "HIGH" ? "bg-danger" :
                            item.priority === "MEDIUM" ? "bg-warning" :
                            "bg-info"
                          }`}></span>
                          <div>
                            <h6 className="mb-1 fw-semibold">{item.patientName}</h6>
                            {item.notes && <p className="mb-0 fs-13 text-muted">{item.notes}</p>}
                          </div>
                        </div>
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => message.info("Book now (open scheduler prefilled) — TODO")}
                          >
                            <i className="ti ti-chevron-right me-1" />
                          Book now
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                          onClick={() =>
                            setQueue((prev) =>
                              prev.filter((q) => q.id !== item.id)
                            )
                          }
                        >
                          Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-6">
              <div className="card shadow-sm">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h5 className="fw-bold mb-0">
                    <i className="ti ti-bell me-2" />
                    Alerts
                  </h5>
                </div>
                <div className="card-body">
                  <div className="list-group list-group-flush">
                    <div className="list-group-item d-flex align-items-center">
                      <div className="flex-shrink-0 me-3">
                        <i className="ti ti-alert-triangle text-warning fs-18"></i>
                      </div>
                      <div className="flex-grow-1">
                        <p className="mb-0 text-warning">
                          2 cancellations today for patient #24 (auto-flag)
                        </p>
                      </div>
                    </div>
                    <div className="list-group-item d-flex align-items-center">
                      <div className="flex-shrink-0 me-3">
                        <i className="ti ti-alert-circle text-danger fs-18"></i>
                      </div>
                      <div className="flex-grow-1">
                        <p className="mb-0 text-danger">
                          3 plans inactive for ≥7 days
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payments Modal */}
          {paymentsOpen && (
            <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">
                      <i className="ti ti-wallet me-2" />
                      Outstanding Balances
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setPaymentsOpen(false)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="list-group list-group-flush">
                      {balances.map((b) => (
                        <div key={b.id} className="list-group-item d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                            <div>
                              <h6 className="mb-1 fw-semibold">{b.patientName}</h6>
                              {b.lastVisit && (
                                <p className="mb-0 fs-13 text-muted">
                                  Last visit: {new Date(b.lastVisit).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="d-flex align-items-center gap-3">
                            <div className="text-end">
                              <p className="mb-0 fs-13 text-muted">Outstanding</p>
                              <h6 className="mb-0 fw-bold text-danger">
                                {b.outstanding.toFixed(2)} JOD
                              </h6>
                            </div>
                            <button
                              className="btn btn-primary btn-sm"
                      onClick={() =>
                        message.info(
                          `Collect payment for ${b.patientName} (TODO)`
                        )
                      }
                    >
                      Collect
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setPaymentsOpen(false)}
                    >
                      Close
                    </button>
                    </div>
                  </div>
              </div>
            </div>
              )}
        </div>
        {/* End Content */}
        {/* Footer Start */}
        <div className="footer text-center bg-white p-2 border-top">
          <p className="text-dark mb-0">
            2025 ©
            <a href="#" className="link-primary">
              South Physical Clinic
            </a>
            , All Rights Reserved
          </p>
      </div>
        {/* Footer End */}
    </div>
      {/* ========================
			End Page Content
		========================= */}
    </>
  );
}
