import React, { useState } from "react";
import { ErrorBoundary } from "@/components/ErrorDisplay";
import { useScheduler } from "./hooks/useScheduler";
import SchedulerBoard from "./components/SchedulerBoard";
import OverbookingWidget from "./components/OverbookingWidget";
import AddToOverbookingModal from "./modals/AddToOverbookingModal";
import EditAppointmentModal from "@/core/components/EditAppointmentModal";
import { getAppointmentById } from "@/api/enhancedAppointments";
import type { AppointmentWithRelations } from "@/api/enhancedAppointments";
import "./styles/scheduler.css";

// Import test helper for easy access in browser console
// Usage: Open DevTools console and run: testSchedulerAPIs()
import "./testing/apiTestHelper";

const SchedulerPage: React.FC = () => {
  const {
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
  } = useScheduler();

  const [isAddToOverbookingModalOpen, setIsAddToOverbookingModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentWithRelations | null>(null);
  const [_loadingAppointment, setLoadingAppointment] = useState(false);

  const handleCellClick = (_therapistId: string, _hour: number) => {
    // Cells now redirect to /new-appointment page
    // This function is kept for backward compatibility but not used
  };

  const handleAppointmentClick = async (appointmentId: string) => {
    setLoadingAppointment(true);
    try {
      const appointment = await getAppointmentById(appointmentId);
      setSelectedAppointment(appointment);
      setIsEditModalOpen(true);
    } catch (err) {
      console.error("Failed to load appointment:", err);
    } finally {
      setLoadingAppointment(false);
    }
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedAppointment(null);
  };

  const handleEditModalSaved = () => {
    refreshData();
    handleEditModalClose();
  };

  const handleAddToOverbooking = () => {
    setIsAddToOverbookingModalOpen(true);
  };

  const handleAutoAssign = async () => {
    try {
      // Import SchedulerAPI dynamically to avoid circular dependencies
      const { SchedulerAPI } = await import("./api");
      await SchedulerAPI.autoAssign(date);
      refreshData();
    } catch (err) {
      console.error("Failed to auto-assign:", err);
    }
  };

  return (
    <ErrorBoundary>
      <div className="page-wrapper">
        <div className="content">
          <div className="scheduler-container">
            {/* Header */}
            <div className="page-head scheduler-header">
              <div className="title">
                <div className="logo" aria-hidden="true">
                  ✚
                </div>
                <h1>Appointments</h1>
                <span className="pill">Daily Board</span>
              </div>
              <div className="controls">
                <div className="control">
                  <span>📅</span>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div className="control">
                  <span>🧑‍⚕️</span>
                  <select
                    value={therapistFilter}
                    onChange={(e) => setTherapistFilter(e.target.value)}
                  >
                    <option value="all">All therapists</option>
                    {therapists.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button className="btn" onClick={handleAutoAssign} title="Fill overbook queue where possible">
                  Auto‑assign
                </button>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="alert alert-danger mb-3" role="alert">
                {error}
              </div>
            )}

            {/* Main Grid */}
            <div className="grid-area scheduler-main">
              {/* Daily Board */}
              <section className="board scheduler-board" aria-label="Daily appointments board">
                <SchedulerBoard
                  therapists={therapists}
                  appointments={appointments}
                  therapistFilter={therapistFilter}
                  date={date}
                  loading={loading}
                  onCellClick={handleCellClick}
                  onAppointmentClick={handleAppointmentClick}
                />
              </section>

              {/* Right Panel */}
              <aside className="panel scheduler-sidebar" aria-label="Queues and insights">
                <OverbookingWidget
                  queue={overbookQueue}
                  loading={loading}
                  onAddToQueue={handleAddToOverbooking}
                  onRefresh={refreshData}
                />
              </aside>
            </div>
          </div>
        </div>

        {/* Modals */}
        <AddToOverbookingModal
          isOpen={isAddToOverbookingModalOpen}
          onClose={() => setIsAddToOverbookingModalOpen(false)}
          onSuccess={refreshData}
        />
        
        <EditAppointmentModal
          isOpen={isEditModalOpen}
          onClose={handleEditModalClose}
          appointment={selectedAppointment}
          onSaved={handleEditModalSaved}
        />
      </div>
    </ErrorBoundary>
  );
};

export default SchedulerPage;



