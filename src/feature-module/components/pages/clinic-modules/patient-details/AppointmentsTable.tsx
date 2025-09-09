import { Link } from "react-router";

import DataTable, { type Column } from "./DataTable";
import { all_routes } from "../../../../routes/all_routes";

export type AppointmentRow = {
  id: string | number;
  dateTime: string;
  mode: "In-person" | "Online" | string;
  status:
    | "Checked Out"
    | "Checked In"
    | "Cancelled"
    | "Schedule"
    | "Confirmed"
    | string;
  doctor: {
    name: string;
    specialty?: string;
    avatarSrc?: string;
    detailsRoute?: string;
  };
};

const statusClass = (s: string) => {
  const k = s.toLowerCase();
  if (k.includes("checked out")) return { soft: "info", text: "info" };
  if (k.includes("checked in")) return { soft: "warning", text: "warning" };
  if (k.includes("cancel")) return { soft: "danger", text: "danger" };
  if (k.includes("confirm")) return { soft: "success", text: "success" };
  if (k.includes("schedule")) return { soft: "primary", text: "primary" };
  return { soft: "secondary", text: "body" };
};

const columns: Column<AppointmentRow>[] = [
  {
    key: "date",
    header: "Date & Time",
    noSort: true,
    accessor: (r) => r.dateTime,
  },
  {
    key: "doctor",
    header: "Doctor Name",
    render: (r) => {
      const route = r.doctor.detailsRoute ?? all_routes.doctordetails;
      return (
        <div className="d-flex align-items-center">
          <div>
            <h6 className="fs-14 mb-1 text-truncate">
              <Link to={route} className="fw-semibold">
                {r.doctor.name}
              </Link>
            </h6>
            {r.doctor.specialty && (
              <p className="mb-0 fs-13 text-truncate">{r.doctor.specialty}</p>
            )}
          </div>
        </div>
      );
    },
  },
  { key: "mode", header: "Mode", accessor: (r) => r.mode },
  {
    key: "status",
    header: "Status",
    render: (r) => {
      const cls = statusClass(r.status);
      return (
        <span
          className={`badge fs-13 badge-soft-${cls.soft} rounded text-${cls.text} fw-medium`}
        >
          {r.status}
        </span>
      );
    },
  },
  {
    key: "actions",
    header: "",
    thClassName: "text-end",
    tdClassName: "action-item text-end",
    render: (_r) => (
      <div className="dropdown">
        <button
          className="btn p-0 border-0 bg-transparent"
          data-bs-toggle="dropdown"
        >
          <i className="ti ti-dots-vertical" />
        </button>
        <ul className="dropdown-menu p-2">
          <li>
            <Link
              to="#"
              className="dropdown-item d-flex align-items-center"
              data-bs-toggle="offcanvas"
              data-bs-target="#view_details"
            >
              View
            </Link>
          </li>
          <li>
            <Link
              to="#"
              className="dropdown-item d-flex align-items-center"
              data-bs-toggle="modal"
              data-bs-target="#delete_modal"
            >
              Delete
            </Link>
          </li>
        </ul>
      </div>
    ),
  },
];

export function AppointmentsTable({
  rows,
  loading,
}: {
  rows: AppointmentRow[];
  loading?: boolean;
}) {
  return (
    <DataTable
      columns={columns}
      data={rows}
      loading={loading}
      emptyMessage="No appointments found."
    />
  );
}
