/** ---------- Common primitives ---------- */
export type BigIntStr = string; // PostgreSQL BIGINT/BIGSERIAL as string (lossless)
export type ISODate = string; // 'YYYY-MM-DD'
export type ISODateTime = string; // ISO timestamp string
export type Money = string; // NUMERIC(10,2) as string
export type Percent = string; // NUMERIC(5,2) as string
export type Json =
  | null
  | boolean
  | number
  | string
  | Json[]
  | { [key: string]: Json };

/** ---------- Enums (from CREATE TYPE & CHECKs) ---------- */
export type RoleT = "ADMIN" | "MANAGER" | "RECEPTION" | "THERAPIST";
export type GenderT = "M" | "F" | "O";
export type PlanTypeT = "PAY_PER_VISIT" | "PACKAGE";
export type PlanStatusT = "ONGOING" | "DISCHARGED";
export type SessionTypeT =
  | "REGULAR"
  | "SHOCK_WAVE"
  | "INDIBA"
  | "HOME"
  | "HOJAMA"
  | "ELDER"
  | "HOSPITAL";
export type LocationT = "CLINIC" | "HOME" | "HOSPITAL";
export type ApptStatusT = "BOOKED" | "CHECKED_IN" | "COMPLETED" | "CANCELLED";
export type PriorityT = "HIGH" | "MEDIUM" | "LOW";
export type DiscountScopeT = "APPOINTMENT" | "PLAN";
export type DiscountTypeT = "PERCENT" | "FLAT";
export type CancelReasonT =
  | "PATIENT_REQUEST"
  | "THERAPIST_UNAVAILABLE"
  | "INSURANCE_ISSUE"
  | "WEATHER_TRANSPORT"
  | "DUPLICATE_BOOKING"
  | "CREATED_IN_ERROR"
  | "DOCTOR_ADVISED_HOLD";
export type PreferredNextT = "2D" | "3D" | "4D" | "5D" | "1W" | "2W";
export type PriceBasisT = "PER_VISIT" | "PACKAGE_RATE";
export type PaymentMethod = "CASH" | "CARD" | "INSURANCE";
export type DiscountStatus = "PENDING" | "APPROVED" | "DENIED" | "REVOKED";

/** Optional helper to narrow enumLabel.enumType */
export type EnumTypeName =
  | "roleT"
  | "genderT"
  | "planTypeT"
  | "planStatusT"
  | "sessionTypeT"
  | "locationT"
  | "apptStatusT"
  | "priorityT"
  | "discountScopeT"
  | "discountTypeT"
  | "cancelReasonT"
  | "preferredNextT"
  | "priceBasisT";

/** ===================== Identity & Master ===================== */
export interface AppUser {
  id: BigIntStr;
  username: string;
  email: string;
  passwordHash: string;
  role: RoleT;
  whatsappNumber: string | null;
  isActive: boolean;
  lastLoginAt: ISODateTime | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface InsertAppUser {
  id?: BigIntStr;
  username: string;
  email: string;
  passwordHash: string;
  role: RoleT;
  whatsappNumber?: string | null;
  isActive?: boolean;
  lastLoginAt?: ISODateTime | null;
  createdAt?: ISODateTime;
  updatedAt?: ISODateTime;
}

export type UpdateAppUser = Partial<Omit<AppUser, "id" | "createdAt">>;

export interface ReferringDoctor {
  id: BigIntStr;
  nameEn: string;
  nameAr: string;
  isActive: boolean;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface InsertReferringDoctor {
  id?: BigIntStr;
  nameEn: string;
  nameAr: string;
  isActive?: boolean;
  createdAt?: ISODateTime;
  updatedAt?: ISODateTime;
}

export type UpdateReferringDoctor = Partial<
  Omit<ReferringDoctor, "id" | "createdAt">
>;

export interface Insurer {
  id: BigIntStr;
  nameEn: string; // UNIQUE
  nameAr: string;
  isActive: boolean;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface InsertInsurer {
  id?: BigIntStr;
  nameEn: string;
  nameAr: string;
  isActive?: boolean;
  createdAt?: ISODateTime;
  updatedAt?: ISODateTime;
}

export type UpdateInsurer = Partial<Omit<Insurer, "id" | "createdAt">>;

export interface SessionType {
  id: BigIntStr;
  code: SessionTypeT;
  labelEn: string;
  labelAr: string;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface InsertSessionType {
  id?: BigIntStr;
  code: SessionTypeT;
  labelEn: string;
  labelAr: string;
  createdAt?: ISODateTime;
  updatedAt?: ISODateTime;
}

export type UpdateSessionType = Partial<Omit<SessionType, "id" | "createdAt">>;

export interface SessionPrice {
  id: BigIntStr;
  sessionTypeId: BigIntStr;
  priceJd: Money;
  effectiveFrom: ISODateTime;
  effectiveTo: ISODateTime | null;
}

export interface InsertSessionPrice {
  id?: BigIntStr;
  sessionTypeId: BigIntStr;
  priceJd: Money;
  effectiveFrom: ISODateTime;
  effectiveTo?: ISODateTime | null;
}

export type UpdateSessionPrice = Partial<Omit<SessionPrice, "id">>;

export interface AddressJson {
  city?: String;
  street?: String;
}

/** ===================== Patients & Attachments ===================== */
export interface Patient {
  id: BigIntStr;
  fullName: string; // may be Arabic or English
  dob: ISODate;
  gender: GenderT;
  phone: string;
  hasInsurance: boolean;
  balance: Money; // Default 0
  extraCare: boolean;
  nationalId: string | null;
  addressJson: AddressJson | null;
  notes: string | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface InsertPatient {
  id?: BigIntStr;
  fullName: string;
  dob: ISODate;
  gender: GenderT;
  phone: string;
  hasInsurance?: boolean;
  balance?: Money;
  extraCare?: boolean;
  nationalId?: string | null;
  addressJson?: Json | null;
  notes?: string | null;
  createdAt?: ISODateTime;
  updatedAt?: ISODateTime;
}

export type UpdatePatient = Partial<Omit<Patient, "id" | "createdAt">>;

export interface FileBlob {
  id: BigIntStr;
  ownerPatientId: BigIntStr | null;
  storedPath: string;
  mimeType: string;
  sizeBytes: number;
  labelEn: string | null;
  labelAr: string | null;
  createdAt: ISODateTime;
}

export interface InsertFileBlob {
  id?: BigIntStr;
  ownerPatientId?: BigIntStr | null;
  storedPath: string;
  mimeType: string;
  sizeBytes: number;
  labelEn?: string | null;
  labelAr?: string | null;
  createdAt?: ISODateTime;
}

export type UpdateFileBlob = Partial<Omit<FileBlob, "id" | "createdAt">>;

export interface InsuranceProfile {
  id: BigIntStr;
  patientId: BigIntStr; // UNIQUE per patient
  insurerId: BigIntStr;
  coveragePercent: Percent; // 0..100
  validityDate: ISODate;
  referralAuth: string | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface InsertInsuranceProfile {
  id?: BigIntStr;
  patientId: BigIntStr;
  insurerId: BigIntStr;
  coveragePercent: Percent;
  validityDate: ISODate;
  referralAuth?: string | null;
  createdAt?: ISODateTime;
  updatedAt?: ISODateTime;
}

export type UpdateInsuranceProfile = Partial<
  Omit<InsuranceProfile, "id" | "createdAt">
>;

/** ===================== Treatment Plans & Appointments ===================== */
export interface TreatmentPlan {
  id: BigIntStr;
  patientId: BigIntStr;
  planType: PlanTypeT;
  packageCode: string | null;
  priceBasis: PriceBasisT;
  primaryTherapistId: BigIntStr;
  startDate: ISODate;
  status: PlanStatusT;
  totalSessions: number | null;
  remainingSessions: number;
  targetFreqPerWeek: number; // 1..5
  referringDoctorId: BigIntStr;
  insuranceReferralAuth: string | null;
  freqAdvisory2w: boolean;
  initialDxTextEn: string | null;
  initialDxTextAr: string | null;
  initialDxFileId: BigIntStr | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface InsertTreatmentPlan {
  id?: BigIntStr;
  patientId: BigIntStr;
  planType: PlanTypeT;
  packageCode?: string | null;
  priceBasis: PriceBasisT;
  primaryTherapistId: BigIntStr;
  startDate: ISODate;
  status?: PlanStatusT;
  totalSessions?: number | null;
  remainingSessions?: number; // default 0
  targetFreqPerWeek?: number; // default 1
  referringDoctorId: BigIntStr;
  insuranceReferralAuth?: string | null;
  freqAdvisory2w?: boolean;
  initialDxTextEn?: string | null;
  initialDxTextAr?: string | null;
  initialDxFileId?: BigIntStr | null;
  createdAt?: ISODateTime;
  updatedAt?: ISODateTime;
}

export type UpdateTreatmentPlan = Partial<
  Omit<TreatmentPlan, "id" | "createdAt">
>;

export interface Appointment {
  id: BigIntStr;
  planId: BigIntStr;
  therapistId: BigIntStr;
  startsAt: ISODateTime;
  endsAt: ISODateTime;
  sessionType: SessionTypeT;
  location: LocationT;
  status: ApptStatusT;
  noteEn: string | null;
  noteAr: string | null;
  cancelReason: CancelReasonT | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface InsertAppointment {
  id?: BigIntStr;
  planId: BigIntStr;
  therapistId: BigIntStr;
  startsAt: ISODateTime;
  endsAt: ISODateTime;
  sessionType: SessionTypeT;
  location: LocationT;
  status?: ApptStatusT;
  noteEn?: string | null;
  noteAr?: string | null;
  cancelReason?: CancelReasonT | null;
  createdAt?: ISODateTime;
  updatedAt?: ISODateTime;
}

export type UpdateAppointment = Partial<Omit<Appointment, "id" | "createdAt">>;

export interface Procedure {
  id: BigIntStr;
  nameEn: string;
  nameAr: string;
  isActive: boolean;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface InsertProcedure {
  id?: BigIntStr;
  nameEn: string;
  nameAr: string;
  isActive?: boolean;
  createdAt?: ISODateTime;
  updatedAt?: ISODateTime;
}

export type UpdateProcedure = Partial<Omit<Procedure, "id" | "createdAt">>;

export interface AppointmentProcedure {
  appointmentId: BigIntStr;
  procedureId: BigIntStr;
}

export interface InsertAppointmentProcedure {
  appointmentId: BigIntStr;
  procedureId: BigIntStr;
}

export type UpdateAppointmentProcedure = never; // composite PK only

export interface SessionNote {
  appointmentId: BigIntStr; // PK, also FK to appointment.id
  summaryTextEn: string | null;
  summaryTextAr: string | null;
  preferredNext: PreferredNextT | null;
  recommendationsEn: string | null;
  recommendationsAr: string | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface InsertSessionNote {
  appointmentId: BigIntStr;
  summaryTextEn?: string | null;
  summaryTextAr?: string | null;
  preferredNext?: PreferredNextT | null;
  recommendationsEn?: string | null;
  recommendationsAr?: string | null;
  createdAt?: ISODateTime;
  updatedAt?: ISODateTime;
}

export type UpdateSessionNote = Partial<
  Omit<SessionNote, "appointmentId" | "createdAt">
>;

/** ===================== Payments & Discounts ===================== */
export interface Payment {
  id: BigIntStr;
  patientId: BigIntStr;
  planId: BigIntStr | null;
  appointmentId: BigIntStr | null;
  amountJd: Money;
  method: PaymentMethod;
  paidAt: ISODateTime;
  recordedBy: BigIntStr;
  createdAt: ISODateTime;
}

export interface InsertPayment {
  id?: BigIntStr;
  patientId: BigIntStr;
  planId?: BigIntStr | null;
  appointmentId?: BigIntStr | null;
  amountJd: Money;
  method: PaymentMethod;
  paidAt?: ISODateTime;
  recordedBy: BigIntStr;
  createdAt?: ISODateTime;
}

export type UpdatePayment = Partial<Omit<Payment, "id" | "createdAt">>;

export interface Discount {
  id: BigIntStr;
  scope: DiscountScopeT;
  type: DiscountTypeT;
  value: Money;
  status: DiscountStatus;
  requestedBy: BigIntStr;
  decidedBy: BigIntStr | null;
  reasonEn: string;
  reasonAr: string | null;
  decisionNoteEn: string | null;
  decisionNoteAr: string | null;
  planId: BigIntStr | null;
  appointmentId: BigIntStr | null;
  effectiveFrom: ISODateTime | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface InsertDiscount {
  id?: BigIntStr;
  scope: DiscountScopeT;
  type: DiscountTypeT;
  value: Money;
  status: DiscountStatus;
  requestedBy: BigIntStr;
  decidedBy?: BigIntStr | null;
  reasonEn: string;
  reasonAr?: string | null;
  decisionNoteEn?: string | null;
  decisionNoteAr?: string | null;
  planId?: BigIntStr | null; // DB enforces scope via CHECK
  appointmentId?: BigIntStr | null;
  effectiveFrom?: ISODateTime | null;
  createdAt?: ISODateTime;
  updatedAt?: ISODateTime;
}

export type UpdateDiscount = Partial<Omit<Discount, "id" | "createdAt">>;

/** ===================== Queue & Audit ===================== */
export interface OverbookingQueue {
  id: BigIntStr;
  patientId: BigIntStr;
  priority: PriorityT;
  isActive: boolean;
  addedBy: BigIntStr;
  addedAt: ISODateTime;
}

export interface InsertOverbookingQueue {
  id?: BigIntStr;
  patientId: BigIntStr;
  priority: PriorityT;
  isActive?: boolean;
  addedBy: BigIntStr;
  addedAt?: ISODateTime;
}

export type UpdateOverbookingQueue = Partial<Omit<OverbookingQueue, "id">>;

export interface AuditLog {
  id: BigIntStr;
  ts: ISODateTime;
  userId: BigIntStr | null;
  role: RoleT | null;
  action: string;
  entity: string;
  entityId: string;
  details: Json | null;
}

export interface InsertAuditLog {
  id?: BigIntStr;
  ts?: ISODateTime;
  userId?: BigIntStr | null;
  role?: RoleT | null;
  action: string;
  entity: string;
  entityId: string;
  details?: Json | null;
}

export type UpdateAuditLog = Partial<Omit<AuditLog, "id">>;

/** ===================== Generic Enum Labels ===================== */
export interface EnumLabel {
  enumType: EnumTypeName | string; // keep open for future types
  code: string;
  labelEn: string;
  labelAr: string;
}

export interface InsertEnumLabel extends EnumLabel {}
export type UpdateEnumLabel = Partial<EnumLabel>;

/** ---------- Optional: table map ---------- */
export interface Tables {
  appUser: AppUser;
  referringDoctor: ReferringDoctor;
  insurer: Insurer;
  sessionType: SessionType;
  sessionPrice: SessionPrice;
  patient: Patient;
  fileBlob: FileBlob;
  insuranceProfile: InsuranceProfile;
  treatmentPlan: TreatmentPlan;
  appointment: Appointment;
  procedure: Procedure;
  appointmentProcedure: AppointmentProcedure;
  sessionNote: SessionNote;
  payment: Payment;
  discount: Discount;
  overbookingQueue: OverbookingQueue;
  auditLog: AuditLog;
  enumLabel: EnumLabel;
}
