import type { Patient } from "../types/typedefs";
import type { GetPatientsParams } from "../types/patient";
import { getApi } from "../services/authService";

export async function getPatients(params: GetPatientsParams = {}) {
  const api = getApi();
  const { page, pageSize, search } = params;
  const query: Record<string, any> = {};
  if (page !== undefined) query.page = page;
  if (pageSize !== undefined) query.pageSize = pageSize;
  if (search && search.trim().length > 0) query.search = search.trim();

  const response = await api.get<{ data: Patient[]; total: number }>('/patients', { params: query });
  return {
    data: response.data.data,
    total: response.data.total
  };
}

export async function getPatientById(id: string): Promise<Patient> {
  const api = getApi();
  const response = await api.get<Patient>(`/patients/${id}`);
  return response.data;
}

export async function deletePatient(id: string): Promise<void> {
  const api = getApi();
  await api.delete(`/patients/${id}`);
}
