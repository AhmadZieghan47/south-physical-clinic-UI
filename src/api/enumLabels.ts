import { getApi } from "../services/authService";

export interface EnumLabel {
  enumType: string;
  code: string;
  labelEn: string;
  labelAr: string;
  // Note: Backend currently only supports these 4 basic fields
  // Additional fields from plan to be implemented later:
  // descriptionEn, descriptionAr, displayOrder, isActive, createdAt, updatedAt
}

export interface EnumLabelsListResponse {
  data: EnumLabel[];
  total: number;
  page: number;
  pageSize: number;
}

export interface EnumLabelsListParams {
  enumType?: string;
  code?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateEnumLabelData {
  enumType: string;
  code: string;
  labelEn: string;
  labelAr: string;
}

export interface UpdateEnumLabelData {
  labelEn?: string;
  labelAr?: string;
}

export const enumLabelsApi = {
  /**
   * List enum labels with optional filters and pagination
   * Note: Backend currently returns array directly, not paginated response
   */
  list: async (params: EnumLabelsListParams = {}): Promise<EnumLabelsListResponse> => {
    const api = getApi();
    const response = await api.get<EnumLabel[] | EnumLabelsListResponse>('/enum-labels', { params });
    
    // Backend returns array directly, so normalize to expected format
    if (Array.isArray(response.data)) {
      return {
        data: response.data,
        total: response.data.length,
        page: params.page || 1,
        pageSize: params.pageSize || 100
      };
    }
    
    return response.data;
  },

  /**
   * Get a single enum label by composite key (enumType + code)
   */
  getByKey: async (enumType: string, code: string): Promise<EnumLabel> => {
    const api = getApi();
    const response = await api.get<EnumLabel>(`/enum-labels/${enumType}/${code}`);
    return response.data;
  },

  /**
   * Create a new enum label
   */
  create: async (data: CreateEnumLabelData): Promise<EnumLabel> => {
    const api = getApi();
    const response = await api.post<EnumLabel>('/enum-labels', data);
    return response.data;
  },

  /**
   * Update an existing enum label
   */
  update: async (enumType: string, code: string, data: UpdateEnumLabelData): Promise<EnumLabel> => {
    const api = getApi();
    const response = await api.patch<EnumLabel>(`/enum-labels/${enumType}/${code}`, data);
    return response.data;
  },

  /**
   * Delete an enum label
   */
  delete: async (enumType: string, code: string): Promise<void> => {
    const api = getApi();
    await api.delete(`/enum-labels/${enumType}/${code}`);
  }
};

