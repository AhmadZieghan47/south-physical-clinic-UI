import type { Insurer } from "../types/typedefs";
import { getApi } from "../services/authService";

export async function getInsurers(): Promise<Insurer[]> {
  const api = getApi();
  const response = await api.get<Insurer[]>('/insurers');
  return response.data;
}

export async function getInsurerById(id: string): Promise<Insurer> {
  const api = getApi();
  const response = await api.get<Insurer>(`/insurers/${id}`);
  return response.data;
}
