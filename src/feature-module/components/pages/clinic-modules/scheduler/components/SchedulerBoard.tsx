import React from "react";
import { useNavigate } from "react-router";
import type { Therapist, Appointment } from "../types";
import { hourLabel, hourRange, getCellCapacity, getCellState } from "../utils";
import { all_routes } from "@/feature-module/routes/all_routes";

interface SchedulerBoardProps {
  therapists: Therapist[];
  appointments: Appointment[];
  therapistFilter: string;
  date: string;
  loading: boolean;
  onCellClick: (therapistId: string, hour: number) => void;
  onAppointmentClick: (appointmentId: string) => void;
}

const SchedulerBoard: React.FC<SchedulerBoardProps> = ({
  therapists,
  appointments,
  therapistFilter,
  date,
  loading,
  onCellClick: _onCellClick,
  onAppointmentClick,
}) => {
  const navigate = useNavigate();
  const hours = hourRange();
  const filteredTherapists =
    therapistFilter === "all"
      ? therapists
      : therapists.filter((t) => t.id === therapistFilter);

  const handleEmptySlotClick = (therapistId: string, hour: number) => {
    // Build URL with query params for pre-filling
    const params = new URLSearchParams({
      therapistId,
      date,
      hour: hour.toString(),
    });
    navigate(`${all_routes.newAppointment}?${params.toString()}`);
  };

  const handleAppointmentClick = (e: React.MouseEvent, appointmentId: string) => {
    e.stopPropagation(); // Prevent cell click
    onAppointmentClick(appointmentId);
  };

  // Organize appointments by therapist and hour
  const appointmentsByTherapistAndHour = new Map<string, Map<number, Appointment[]>>();

  appointments.forEach((apt) => {
    if (!appointmentsByTherapistAndHour.has(apt.therapistId)) {
      appointmentsByTherapistAndHour.set(apt.therapistId, new Map());
    }
    const therapistSlots = appointmentsByTherapistAndHour.get(apt.therapistId)!;
    if (!therapistSlots.has(apt.hour)) {
      therapistSlots.set(apt.hour, []);
    }
    therapistSlots.get(apt.hour)!.push(apt);
  });

  const getAppointmentsForCell = (therapistId: string, hour: number): Appointment[] => {
    return appointmentsByTherapistAndHour.get(therapistId)?.get(hour) || [];
  };

  const formatDate = (dateStr: string): string => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="board-body">
        <div className="loading-state">Loading appointments...</div>
      </div>
    );
  }

  return (
    <>
      <div className="board-head">
        <strong>{formatDate(date)}</strong>
        <div className="legend">
          <span>
            <span className="dot available-dot"></span>Available
          </span>
          <span>
            <span className="dot booked-dot"></span>Booked
          </span>
          <span>
            <span className="dot extracare-dot"></span>Extra care
          </span>
          <span className="pill">Capacity: 2 / hour (extra‑care = 1)</span>
        </div>
      </div>
      <div className="board-body">
        <table className="table" aria-describedby="dayTitle">
          <thead>
            <tr>
              <th className="therapist">Therapist</th>
              {hours.map((h) => (
                <th key={h}>{hourLabel(h)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredTherapists.map((therapist) => (
              <tr key={therapist.id}>
                <td className="therapist">{therapist.name}</td>
                {hours.map((hour) => {
                  const cellAppointments = getAppointmentsForCell(therapist.id, hour);
                  const capacity = getCellCapacity(cellAppointments);
                  const state = getCellState(cellAppointments);

                  return (
                    <td key={hour}>
                      <div
                        className={`slot ${state}`}
                        data-state={state}
                        onClick={() => cellAppointments.length === 0 && handleEmptySlotClick(therapist.id, hour)}
                        role="button"
                        tabIndex={cellAppointments.length === 0 ? 0 : -1}
                        onKeyDown={(e) => {
                          if ((e.key === "Enter" || e.key === " ") && cellAppointments.length === 0) {
                            e.preventDefault();
                            handleEmptySlotClick(therapist.id, hour);
                          }
                        }}
                        aria-label={`${therapist.name} at ${hourLabel(hour)}`}
                      >
                        <div className="cap-pill">
                          {cellAppointments.length}/{capacity}
                        </div>
                        <div className="appointments-list">
                          {cellAppointments.map((apt) => (
                            <div
                              key={apt.id}
                              className={`appt ${apt.kind === "EXTRA_CARE" ? "extra" : ""}`}
                              data-kind={apt.kind === "EXTRA_CARE" ? "extra" : "standard"}
                              onClick={(e) => handleAppointmentClick(e, apt.id)}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  handleAppointmentClick(e as any, apt.id);
                                }
                              }}
                              title="Click to view/edit appointment"
                            >
                              {apt.preferredTherapistId && (
                                <svg
                                  className="pref"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                >
                                  <path
                                    d="M12 21s-6-4.35-9-8.1C1.33 10.05 2 7 5 7c2 0 3 1.5 3 1.5S9 7 11 7c3 0 3.67 3.05 2 5.9C18 16.65 12 21 12 21Z"
                                    strokeWidth="1.5"
                                  />
                                </svg>
                              )}
                              <span className="fw-medium small">P#{apt.patientId}</span>
                              {apt.kind === "EXTRA_CARE" && (
                                <span className="tag">Extra‑care</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default SchedulerBoard;



