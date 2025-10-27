import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";

import {
  getQueueItems,
  removeFromQueue,
} from "@/api/overbookingQueue";
import type {
  QueueItemWithPatient,
  QueueFilters,
} from "@/types/overbookingQueue";
import { type PriorityT, type BigIntStr } from "@/types/typedefs";
import { AddPatientToQueueModal } from "./modals/AddPatientToQueueModal";

import "./style/overbookingQueue.scss";
import { ErrorBoundary } from "@/components/ErrorDisplay";
import { DownloadIcon, SettingsIcon } from "lucide-react";

const PRIORITY_OPTIONS = [
  { label: "All Priorities", value: "" },
  { label: "High Priority", value: "HIGH" },
  { label: "Medium Priority", value: "MEDIUM" },
  { label: "Low Priority", value: "LOW" },
];

const STATUS_OPTIONS = [
  { label: "All Status", value: "" },
  { label: "Active", value: "true" },
  { label: "Inactive", value: "false" },
];

export const OverbookingQueuePage: React.FC = () => {
  const [queueItems, setQueueItems] = useState<QueueItemWithPatient[]>([]);
  const [filters, setFilters] = useState<QueueFilters>({
    page: 1,
    pageSize: 20,
  });
  const [_totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchQueueData = async () => {
    setLoading(true);
    setError(null);
    try {
      const queueResponse = await getQueueItems(filters);
      setQueueItems(queueResponse.data);
      setTotalItems(queueResponse.total);
    } catch (err) {
      console.error("Failed to fetch overbooking queue data", err);
      setError("Failed to load queue. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueueData();
  }, [filters]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({
      ...prev,
      priority: (e.target.value as PriorityT) || undefined,
      page: 1,
    }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({
      ...prev,
      isActive:
        e.target.value === "true"
          ? true
          : e.target.value === "false"
          ? false
          : undefined,
      page: 1,
    }));
  };

  const handleRemove = async (id: BigIntStr) => {
    if (
      window.confirm(
        "Are you sure you want to remove this patient from the queue?"
      )
    ) {
      try {
        await removeFromQueue(id);
        fetchQueueData();
      } catch (err) {
        console.error("Failed to remove queue item", err);
        setError("Failed to remove patient. Please try again.");
      }
    }
  };

  const handleBookAppointment = (patientId: BigIntStr) => {
    navigate(`/new-appointment/${patientId}`);
  };

  const handleViewDetails = (patientId: BigIntStr) => {
    navigate(`/patient-details/${patientId}`);
  };

  return (
    <ErrorBoundary>
      <div className="page-wrapper">
        <div className="content">
          <div className="col-lg-12">
            <div className="mb-4">
              <h4 className="fw-bold mb-0 d-flex align-items-center">
                Overbooking Queue
              </h4>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            {/* Queue Controls */}
            <div className="queue-controls">
              <div className="controls-header">
                <h2 className="controls-title">Queue Management</h2>
                <div className="controls-actions">
                  <button className="btn btn-outline-secondary btn-sm">
                    <DownloadIcon />
                    Export
                  </button>
                  <button className="btn btn-outline-secondary btn-sm">
                    <SettingsIcon />
                    Settings
                  </button>
                </div>
              </div>

              <div className="search-filter">
                <input
                  type="text"
                  placeholder="Search patients by name or ID..."
                  value={filters.search || ""}
                  onChange={handleSearchChange}
                  className="search-input search-box"
                />
                <select
                  className="filter-select"
                  value={filters.priority || ""}
                  onChange={handlePriorityChange}
                >
                  {PRIORITY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <select
                  className="filter-select"
                  value={
                    filters.isActive === true
                      ? "true"
                      : filters.isActive === false
                      ? "false"
                      : ""
                  }
                  onChange={handleStatusChange}
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Queue List */}
            <div className="queue-list">
              {loading ? (
                <div className="loading-state">Loading queue...</div>
              ) : queueItems.length === 0 ? (
                <div className="empty-state">
                  <i data-icon="users" className="empty-icon"></i>
                  <h5 className="empty-title">No Patients in Queue</h5>
                  <p className="empty-description">
                    The overbooking queue is currently empty. Add a patient to
                    get started.
                  </p>
                </div>
              ) : (
                <>
                  <div className="queue-header">
                    <div>#</div>
                    <div>Patient</div>
                    <div>Priority</div>
                    <div>Added</div>
                    <div>Added By</div>
                    <div>Actions</div>
                  </div>

                  {queueItems.map((item, index) => (
                    <div key={item?.id} className="queue-item">
                      <div className="queue-number">
                        {(filters.page! - 1) * filters.pageSize! + index + 1}
                      </div>
                      <div className="patient-info">
                        <div className="patient-name">
                          {item?.patient?.fullName}
                        </div>
                        <div className="patient-details">
                          ID: #{item?.patient?.id} • Phone: {item?.patient?.phone}
                        </div>
                      </div>
                      <div
                        className={classNames(
                          "priority-badge",
                          { "priority-high": item.priority === "HIGH" },
                          { "priority-medium": item.priority === "MEDIUM" },
                          { "priority-low": item.priority === "LOW" }
                        )}
                      >
                        {item.priority}
                      </div>
                      <div className="added-time">
                        {new Date(item.addedAt).toLocaleString()}
                      </div>
                      <div className="added-time">
                        {item?.addedByUser?.username}
                      </div>
                      <div className="queue-actions">
                        <button
                          className="btn btn-primary btn-sm btn-icon"
                          title="Book Appointment"
                          onClick={() => handleBookAppointment(item.patientId)}
                        >
                          <i data-icon="calendar-plus"></i>
                        </button>
                        <button
                          className="btn btn-outline-secondary btn-sm btn-icon"
                          title="View Details"
                          onClick={() => handleViewDetails(item.patientId)}
                        >
                          <i data-icon="eye"></i>
                        </button>
                        <button
                          className="btn btn-outline-secondary btn-sm btn-icon"
                          title="Remove"
                          onClick={() => handleRemove(item?.id)}
                        >
                          <i data-icon="trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>

        <AddPatientToQueueModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onPatientAdded={fetchQueueData}
        />
      </div>
    </ErrorBoundary>
  );
};
