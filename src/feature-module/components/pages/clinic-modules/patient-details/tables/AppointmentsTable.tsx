import { Link } from "react-router";

import DataTable, { type Column } from "./DataTable";
import { all_routes } from "@/feature-module/routes/all_routes";
import type {
  Appointment,
  ApptStatusT,
  LocationT,
  SessionTypeT,
} from "@/types/typedefs";

export type AppointmentRow = Appointment & {
  therapist: {
    name: string;
    specialty?: string;
    avatarSrc?: string;
    detailsRoute?: string;
  };
  sessionTypeLabel?: string;
  locationLabel?: string;
  statusLabel?: string;
};

const statusClass = (status: ApptStatusT) => {
  switch (status) {
    case "COMPLETED":
      return { soft: "info", text: "info" };
    case "CHECKED_IN":
      return { soft: "warning", text: "warning" };
    case "CANCELLED":
      return { soft: "danger", text: "danger" };
    case "BOOKED":
      return { soft: "primary", text: "primary" };
    default:
      return { soft: "secondary", text: "body" };
  }
};

const getStatusLabel = (status: ApptStatusT): string => {
  switch (status) {
    case "BOOKED":
      return "Scheduled";
    case "CHECKED_IN":
      return "Checked In";
    case "COMPLETED":
      return "Completed";
    case "CANCELLED":
      return "Cancelled";
    default:
      return status;
  }
};

const getLocationLabel = (location: LocationT): string => {
  switch (location) {
    case "CLINIC":
      return "In-person";
    case "HOME":
      return "Home Visit";
    case "HOSPITAL":
      return "Hospital";
    default:
      return location;
  }
};

const getSessionTypeLabel = (sessionType: SessionTypeT): string => {
  switch (sessionType) {
    case "REGULAR":
      return "Regular Session";
    case "SHOCK_WAVE":
      return "Shock Wave Therapy";
    case "INDIBA":
      return "INDIBA Therapy";
    case "HOME":
      return "Home Session";
    case "HOJAMA":
      return "Hijama Therapy";
    case "ELDER":
      return "Elder Care";
    case "HOSPITAL":
      return "Hospital Session";
    default:
      return sessionType;
  }
};

const formatDateTime = (startsAt: string, endsAt: string): string => {
  const startDate = new Date(startsAt);
  const endDate = new Date(endsAt);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const startFormatted = formatDate(startDate);
  const startTime = formatTime(startDate);
  const endTime = formatTime(endDate);

  return `${startFormatted} - ${startTime} to ${endTime}`;
};

const columns: Column<AppointmentRow>[] = [
  {
    key: "date",
    header: "Date & Time",
    noSort: true,
    accessor: (r: AppointmentRow) => formatDateTime(r.startsAt, r.endsAt),
  },
  {
    key: "therapist",
    header: "Therapist",
    render: (r: AppointmentRow) => {
      const route = r.therapist.detailsRoute ?? all_routes.doctordetails;
      return (
        <div className="d-flex align-items-center">
          <div>
            <h6 className="fs-14 mb-1 text-truncate">
              <Link to={route} className="fw-semibold">
                {r.therapist.name}
              </Link>
            </h6>
            {r.therapist.specialty && (
              <p className="mb-0 fs-13 text-truncate">
                {r.therapist.specialty}
              </p>
            )}
          </div>
        </div>
      );
    },
  },
  {
    key: "sessionType",
    header: "Session Type",
    accessor: (r: AppointmentRow) =>
      r.sessionTypeLabel || getSessionTypeLabel(r.sessionType),
  },
  {
    key: "location",
    header: "Location",
    accessor: (r: AppointmentRow) =>
      r.locationLabel || getLocationLabel(r.location),
  },
  {
    key: "status",
    header: "Status",
    render: (r: AppointmentRow) => {
      const cls = statusClass(r.status);
      const label = r.statusLabel || getStatusLabel(r.status);
      return (
        <span
          className={`badge fs-13 badge-soft-${cls.soft} rounded text-${cls.text} fw-medium`}
        >
          {label}
        </span>
      );
    },
  },
  {
    key: "actions",
    header: "",
    thClassName: "text-end",
    tdClassName: "action-item text-end",
    render: (_r: AppointmentRow) => (
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
