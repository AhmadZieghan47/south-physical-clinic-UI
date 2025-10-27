import { getApi } from "../services/authService";

export interface Diagnosis {
  id: string;
  code: string;
  nameEn: string;
  nameAr: string;
  category: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DiagnosesListResponse {
  data: Diagnosis[];
  total: number;
  page: number;
  pageSize: number;
}

export interface DiagnosesListParams {
  search?: string;
  category?: string;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
}

export interface CreateDiagnosisData {
  code: string;
  nameEn: string;
  nameAr: string;
  category?: string | null;
  isActive?: boolean;
}

export interface UpdateDiagnosisData {
  code?: string;
  nameEn?: string;
  nameAr?: string;
  category?: string | null;
  isActive?: boolean;
}

export const diagnosesApi = {
  /**
   * List diagnoses with optional filters and pagination
   */
  list: async (params: DiagnosesListParams = {}): Promise<DiagnosesListResponse> => {
    const api = getApi();
    const response = await api.get<DiagnosesListResponse>('/diagnoses', { params });
    return response.data;
  },

  /**
   * Get a single diagnosis by ID
   */
  getById: async (id: string): Promise<Diagnosis> => {
    const api = getApi();
    const response = await api.get<Diagnosis>(`/diagnoses/${id}`);
    return response.data;
  },

  /**
   * Create a new diagnosis
   */
  create: async (data: CreateDiagnosisData): Promise<Diagnosis> => {
    const api = getApi();
    const response = await api.post<Diagnosis>('/diagnoses', data);
    return response.data;
  },

  /**
   * Update an existing diagnosis
   */
  update: async (id: string, data: UpdateDiagnosisData): Promise<Diagnosis> => {
    const api = getApi();
    const response = await api.patch<Diagnosis>(`/diagnoses/${id}`, data);
    return response.data;
  },

  /**
   * Soft delete a diagnosis (sets isActive to false)
   */
  delete: async (id: string): Promise<void> => {
    const api = getApi();
    await api.delete(`/diagnoses/${id}`);
  }
};

