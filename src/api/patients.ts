import type { Patient } from "../types/typedefs";
import type { GetPatientsParams } from "../types/patient";
import api from "../lib/api";

export async function getPatients(params: GetPatientsParams = {}) {
  const { page, pageSize, search } = params;
  const query: Record<string, any> = {};
  if (page !== undefined) query.page = page;
  if (pageSize !== undefined) query.pageSize = pageSize;
  if (search && search.trim().length > 0) query.search = search.trim();

  const response = await api.get<Patient[]>('/patients', { params: query });
  return {
    data: response.data,
    total: response?.data?.length
  };
}

export async function getPatientById(id: string): Promise<Patient> {
  const response = await api.get<Patient>(`/patients/${id}`);
  return response.data;
}
