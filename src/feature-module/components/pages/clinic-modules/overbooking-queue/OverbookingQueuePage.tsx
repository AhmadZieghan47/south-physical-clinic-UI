import React, { useState, useEffect, useMemo } from "react";
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

import styles from "./OverbookingQueuePage.module.css";
import { ErrorBoundary } from "@/core/common/error-display/ErrorDisplay";
import { Button, IconButton } from "@/core/common/button";
import { Download, Settings, Users, Trash2, Clock, AlertCircle, Phone } from "lucide-react";

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
  const [selectedItems, setSelectedItems] = useState<Set<BigIntStr>>(new Set());
  const [hoveredPatient, setHoveredPatient] = useState<BigIntStr | null>(null);
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

  // Bulk selection handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(new Set(queueItems.map((item) => item.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelectItem = (id: BigIntStr) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleBulkRemove = async () => {
    if (
      window.confirm(
        `Are you sure you want to remove ${selectedItems.size} patient(s) from the queue?`
      )
    ) {
      try {
        await Promise.all(
          Array.from(selectedItems).map((id) => removeFromQueue(id))
        );
        setSelectedItems(new Set());
        fetchQueueData();
      } catch (err) {
        console.error("Failed to remove queue items", err);
        setError("Failed to remove patients. Please try again.");
      }
    }
  };

  // Filter clearing handlers
  const clearFilter = (filterKey: keyof QueueFilters) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[filterKey];
      return { ...newFilters, page: 1 };
    });
  };

  const clearAllFilters = () => {
    setFilters({ page: 1, pageSize: 20 });
  };

  // Calculate stats
  const stats = useMemo(() => {
    const total = queueItems.length;
    const highPriority = queueItems.filter((item) => item.priority === "HIGH").length;
    const active = queueItems.filter((item) => item.isActive).length;
    return { total, highPriority, active };
  }, [queueItems]);

  const selectedAll = selectedItems.size === queueItems.length && queueItems.length > 0;
  const hasActiveFilters = !!(filters.priority || filters.isActive !== undefined || filters.search);

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
            
            {/* Stats Cards */}
            <div className={styles.statsGrid}>
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center gap-3">
                    <div className={styles.statIcon}>
                      <Users size={24} />
                    </div>
                    <div>
                      <div className={styles.statValue}>{stats.total}</div>
                      <div className={styles.statTitle}>Total in Queue</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center gap-3">
                    <div className={styles.statIcon}>
                      <AlertCircle size={24} color="#dc3545" />
                    </div>
                    <div>
                      <div className={styles.statValue}>{stats.highPriority}</div>
                      <div className={styles.statTitle}>High Priority</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center gap-3">
                    <div className={styles.statIcon}>
                      <Clock size={24} color="#28a745" />
                    </div>
                    <div>
                      <div className={styles.statValue}>{stats.active}</div>
                      <div className={styles.statTitle}>Active</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Queue Controls */}
            <div className={styles.queueControls}>
              <div className={styles.controlsHeader}>
                <h2 className={styles.controlsTitle}>Queue Management</h2>
                <div className={styles.controlsActions}>
                  <Button
                    variant="secondary"
                    styleVariant="outline"
                    size="sm"
                    icon={<Download size={16} />}
                  >
                    Export
                  </Button>
                  <Button
                    variant="secondary"
                    styleVariant="outline"
                    size="sm"
                    icon={<Settings size={16} />}
                  >
                    Settings
                  </Button>
                </div>
              </div>

              <div className={styles.searchFilter}>
                <input
                  type="text"
                  placeholder="Search patients by name or ID..."
                  value={filters.search || ""}
                  onChange={handleSearchChange}
                  className={`form-control ${styles.searchBox}`}
                />
                <select
                  className={styles.filterSelect}
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
                  className={styles.filterSelect}
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

              {/* Active Filters */}
              {hasActiveFilters && (
                <div className={styles.activeFilters}>
                  {filters.search && (
                    <span className="badge bg-primary">
                      Search: {filters.search}
                      <button
                        className={styles.filterBadgeClose}
                        onClick={() => clearFilter("search")}
                        aria-label="Clear search filter"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {filters.priority && (
                    <span className="badge bg-info">
                      Priority: {filters.priority}
                      <button
                        className={styles.filterBadgeClose}
                        onClick={() => clearFilter("priority")}
                        aria-label="Clear priority filter"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {filters.isActive !== undefined && (
                    <span className="badge bg-secondary">
                      Status: {filters.isActive ? "Active" : "Inactive"}
                      <button
                        className={styles.filterBadgeClose}
                        onClick={() => clearFilter("isActive")}
                        aria-label="Clear status filter"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  <button
                    className="btn btn-link btn-sm text-danger"
                    onClick={clearAllFilters}
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Bulk Actions Bar */}
            {selectedItems.size > 0 && (
              <div className={styles.bulkActions}>
                <input
                  type="checkbox"
                  className={styles.bulkActionsCheckbox}
                  checked={selectedAll}
                  onChange={handleSelectAll}
                  aria-label="Select all patients"
                />
                <span className={styles.bulkActionsText}>
                  {selectedItems.size} patient{selectedItems.size > 1 ? "s" : ""} selected
                </span>
                <Button
                  size="sm"
                  variant="danger"
                  styleVariant="soft"
                  icon={<Trash2 size={14} />}
                  onClick={handleBulkRemove}
                >
                  Remove Selected
                </Button>
              </div>
            )}

            {/* Queue List */}
            <div className={styles.queueList}>
              {loading ? (
                <div className={styles.loadingState}>Loading queue...</div>
              ) : queueItems.length === 0 ? (
                <div className={styles.emptyState}>
                  <Users size={64} className={styles.emptyIcon} color="#cbd5e0" />
                  <h5 className={styles.emptyTitle}>No Patients in Queue</h5>
                  <p className={styles.emptyDescription}>
                    The overbooking queue is currently empty. Add a patient to
                    get started.
                  </p>
                </div>
              ) : (
                <>
                  <div className={classNames(styles.queueHeader, {
                    [styles.queueHeaderWithCheckbox]: selectedItems.size > 0 || selectedAll
                  })}>
                    <div>
                      <input
                        type="checkbox"
                        checked={selectedAll}
                        onChange={handleSelectAll}
                        aria-label="Select all patients"
                      />
                    </div>
                    <div>#</div>
                    <div>Patient</div>
                    <div>Priority</div>
                    <div>Added</div>
                    <div>Added By</div>
                    <div>Actions</div>
                  </div>

                  {queueItems.map((item, index) => (
                    <div 
                      key={item?.id} 
                      className={classNames(styles.queueItem, {
                        [styles.queueItemWithCheckbox]: selectedItems.size > 0 || selectedAll
                      })}
                    >
                      <div className={styles.queueCheckbox}>
                        <input
                          type="checkbox"
                          checked={selectedItems.has(item?.id)}
                          onChange={() => handleSelectItem(item?.id)}
                          aria-label={`Select ${item?.patient?.fullName}`}
                        />
                      </div>
                      <div className={styles.queueNumber}>
                        {(filters.page! - 1) * filters.pageSize! + index + 1}
                      </div>
                      <div 
                        className={styles.patientInfo}
                        onMouseEnter={() => setHoveredPatient(item.patientId)}
                        onMouseLeave={() => setHoveredPatient(null)}
                      >
                        <div className={styles.patientName}>
                          {item?.patient?.fullName}
                        </div>
                        <div className={styles.patientDetails}>
                          ID: #{item?.patient?.id} • Phone: {item?.patient?.phone}
                        </div>
                        
                        {/* Patient Quick Preview */}
                        {hoveredPatient === item.patientId && (
                          <div className={styles.quickPreview}>
                            <div className={styles.quickPreviewHeader}>
                              <div className={styles.quickPreviewAvatar}>
                                {item?.patient?.fullName?.charAt(0).toUpperCase()}
                              </div>
                              <div className={styles.quickPreviewInfo}>
                                <div className={styles.quickPreviewName}>
                                  {item?.patient?.fullName}
                                </div>
                                <div className={styles.quickPreviewMeta}>
                                  Patient ID: #{item?.patient?.id}
                                </div>
                              </div>
                            </div>
                            <div className={styles.quickPreviewBody}>
                              <div className={styles.quickPreviewItem}>
                                <Phone className={styles.quickPreviewIcon} size={16} />
                                <span className={styles.quickPreviewLabel}>Phone:</span>
                                <span className={styles.quickPreviewValue}>
                                  {item?.patient?.phone || "N/A"}
                                </span>
                              </div>
                              <div className={styles.quickPreviewItem}>
                                <AlertCircle className={styles.quickPreviewIcon} size={16} />
                                <span className={styles.quickPreviewLabel}>Priority:</span>
                                <span className={styles.quickPreviewValue}>
                                  {item.priority}
                                </span>
                              </div>
                              <div className={styles.quickPreviewItem}>
                                <Clock className={styles.quickPreviewIcon} size={16} />
                                <span className={styles.quickPreviewLabel}>In Queue Since:</span>
                                <span className={styles.quickPreviewValue}>
                                  {new Date(item.addedAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
                        <span
                          className={classNames(
                            "badge",
                            { "bg-danger": item.priority === "HIGH" },
                            { "bg-warning text-dark": item.priority === "MEDIUM" },
                            { "bg-success": item.priority === "LOW" }
                          )}
                        >
                          {item.priority}
                        </span>
                      </div>
                      <div className={styles.addedTime}>
                        {new Date(item.addedAt).toLocaleString()}
                      </div>
                      <div className={styles.addedTime}>
                        {item?.addedByUser?.username}
                      </div>
                      <div className={styles.queueActions}>
                        <IconButton
                          iconName="calendar-plus"
                          ariaLabel="Book Appointment"
                          variant="primary"
                          size="sm"
                          onClick={() => handleBookAppointment(item.patientId)}
                        />
                        <IconButton
                          iconName="eye"
                          ariaLabel="View Details"
                          variant="secondary"
                          styleVariant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(item.patientId)}
                        />
                        <IconButton
                          iconName="trash-2"
                          ariaLabel="Remove from queue"
                          variant="danger"
                          styleVariant="outline"
                          size="sm"
                          onClick={() => handleRemove(item?.id)}
                        />
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
