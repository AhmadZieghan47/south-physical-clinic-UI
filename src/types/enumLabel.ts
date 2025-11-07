export interface EnumLabelFilters {
  enumType: string;
  search: string;
  page: number;
  pageSize: number;
}

export const COMMON_ENUM_TYPES = [
  { value: 'SessionType', label: 'Session Type', color: '#1E40AF' },
  { value: 'Location', label: 'Location', color: '#059669' },
  { value: 'ApptStatus', label: 'Appointment Status', color: '#EA580C' },
  { value: 'CancelReason', label: 'Cancel Reason', color: '#DC2626' },
  { value: 'Gender', label: 'Gender', color: '#7C3AED' },
  { value: 'Role', label: 'Role', color: '#0891B2' },
  { value: 'PriceBasis', label: 'Price Basis', color: '#65A30D' }
] as const;

