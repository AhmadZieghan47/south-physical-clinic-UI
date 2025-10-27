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

export interface DiagnosisFormData {
  code: string;
  nameEn: string;
  nameAr: string;
  category: string | null;
  isActive: boolean;
}

export interface DiagnosesFilters {
  search: string;
  category: string;
  isActive: boolean | null;
  page: number;
  pageSize: number;
}

export type DiagnosisCreateData = Omit<Diagnosis, 'id' | 'createdAt' | 'updatedAt'>;
export type DiagnosisUpdateData = Partial<DiagnosisCreateData>;

