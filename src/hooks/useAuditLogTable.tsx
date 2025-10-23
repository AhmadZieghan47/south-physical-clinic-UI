import { useState, useEffect, useMemo } from "react";
import { getAuditLogs } from "../api/auditLog";
import type { AuditLog } from "../types/typedefs";

export interface UseAuditLogTableParams {
  page?: number;
  pageSize?: number;
  entity?: string;
  action?: string;
  role?: string;
}

export function useAuditLogTable({
  page = 1,
  pageSize = 20,
  entity,
  action,
  role,
}: UseAuditLogTableParams = {}) {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(page);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  const [selectedAuditLog, setSelectedAuditLog] = useState<AuditLog | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);

  const columns = useMemo(
    () => [
      {
        title: "Timestamp",
        dataIndex: "ts",
        width: 180,
        render: (ts: string) => {
          const date = new Date(ts);
          return (
            <span className="text-muted">
              {date.toLocaleDateString()} {date.toLocaleTimeString()}
            </span>
          );
        },
      },
      {
        title: "User",
        dataIndex: "userId",
        width: 100,
        render: (userId: string | null, record: AuditLog) => (
          <div>
            <div className="fw-semibold">{userId || "System"}</div>
            {record.role && <small className="text-muted">{record.role}</small>}
          </div>
        ),
      },
      {
        title: "Action",
        dataIndex: "action",
        width: 120,
        render: (action: string) => (
          <span className="badge badge-soft-info">{action}</span>
        ),
      },
      {
        title: "Entity",
        dataIndex: "entity",
        width: 100,
        render: (entity: string) => (
          <span className="badge badge-soft-secondary">{entity}</span>
        ),
      },
      {
        title: "Entity ID",
        dataIndex: "entityId",
        width: 100,
        render: (entityId: string) => (
          <code className="text-muted">{entityId}</code>
        ),
      },
    ],
    []
  );

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      const data = await getAuditLogs({
        page: currentPage,
        pageSize: currentPageSize,
        entity,
        action,
        role,
      });
      setAuditLogs(data);
    } catch (error) {
      console.error("Failed to fetch audit logs:", error);
      setAuditLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, [currentPage, currentPageSize, entity, action, role]);

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) {
      setCurrentPageSize(pageSize);
    }
  };

  const handleRowClick = (record: AuditLog) => {
    setSelectedAuditLog(record);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedAuditLog(null);
  };

  return {
    columns,
    auditLogs,
    loading,
    currentPage,
    currentPageSize,
    handlePageChange,
    handleRowClick,
    selectedAuditLog,
    modalOpen,
    closeModal,
    refetch: fetchAuditLogs,
  };
}
