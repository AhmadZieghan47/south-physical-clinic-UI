export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

export interface GetPatientsParams {
  page?: number;
  pageSize?: number;
  search?: string;
}
