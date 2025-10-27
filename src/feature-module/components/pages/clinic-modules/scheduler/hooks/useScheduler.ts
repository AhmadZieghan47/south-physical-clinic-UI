// Custom hook for scheduler data management
import { useState, useEffect, useCallback } from "react";
import { SchedulerAPI } from "../api";
import type { Appointment, Therapist, OverbookItem } from "../types";
import { getTodayDate } from "../utils";

export interface UseSchedulerOptions {
  date?: string;
  therapistFilter?: string;
}

export function useScheduler(options: UseSchedulerOptions = {}) {
  const [date, setDate] = useState(options.date || getTodayDate());
  const [therapistFilter, setTherapistFilter] = useState(options.therapistFilter || "all");
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [overbookQueue, setOverbookQueue] = useState<OverbookItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [therapistsData, appointmentsData, queueData] = await Promise.all([
        SchedulerAPI.listTherapists(),
        SchedulerAPI.listAppointmentsByDate(date),
        SchedulerAPI.listOverbook(),
      ]);
      setTherapists(therapistsData);
      setAppointments(appointmentsData);
      setOverbookQueue(queueData);
    } catch (err) {
      console.error("Failed to fetch scheduler data:", err);
      setError("Failed to load scheduler data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refreshData = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    date,
    setDate,
    therapistFilter,
    setTherapistFilter,
    therapists,
    appointments,
    overbookQueue,
    loading,
    error,
    refreshData,
  };
}



