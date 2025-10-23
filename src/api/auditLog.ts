import type { AuditLog } from "../types/typedefs";
import { getApi } from "../services/authService";

export interface GetAuditLogsParams {
  page?: number;
  pageSize?: number;
  entity?: string;
  entityId?: string;
  action?: string;
  userId?: string;
  role?: string;
  fromTs?: string;
  toTs?: string;
}

export async function getAuditLogs(params: GetAuditLogsParams = {}) {
  const api = getApi();
  const query: Record<string, any> = {};

  if (params.page !== undefined) query.page = params.page;
  if (params.pageSize !== undefined) query.pageSize = params.pageSize;
  if (params.entity) query.entity = params.entity;
  if (params.entityId) query.entityId = params.entityId;
  if (params.action) query.action = params.action;
  if (params.userId) query.userId = params.userId;
  if (params.role) query.role = params.role;
  if (params.fromTs) query.fromTs = params.fromTs;
  if (params.toTs) query.toTs = params.toTs;

  const response = await api.get<AuditLog[]>("/audit-log", { params: query });
  return response.data;
}

export async function getAuditLogById(id: string): Promise<AuditLog> {
  const api = getApi();
  const response = await api.get<AuditLog>(`/audit-log/${id}`);
  return response.data;
}
