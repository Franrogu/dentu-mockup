export type AppointmentStatus =
  | "draft"
  | "scheduled"
  | "confirmed"
  | "checked_in"
  | "completed"
  | "cancelled"
  | "no_show"
  | "rescheduled";

export type BookingSource =
  | "internal"
  | "external_request"
  | "external_portal"
  | "import"
  | "other";

export type PatientStatus = "active" | "inactive" | "archived";
export type ClinicalRecordStatus = "open" | "archived";
export type ClinicStatus = "active" | "inactive";
export type UserStatus = "active" | "inactive";
export type UserCategory = "dentist" | "assistant" | "admin" | "reception";
export type VisitStatus = "draft" | "open" | "completed" | "cancelled" | "voided";
export type VisitSourceType = "appointment" | "manual";

export interface Organization {
  id: string;
  name: string;
  slug: string;
}

export interface Clinic {
  id: string;
  orgId: string;
  code: string;
  name: string;
  status: ClinicStatus;
  addressText: string;
  phone: string;
  email: string;
}

export interface Patient {
  id: string;
  orgId: string;
  patientCode: string;
  firstName: string;
  lastName: string;
  secondLastName: string | null;
  birthDate: string | null;
  phone: string | null;
  email: string | null;
  status: PatientStatus;
  fullNameNormalized: string;
}

export interface ClinicalRecord {
  id: string;
  orgId: string;
  patientId: string;
  recordNumber: string;
  status: ClinicalRecordStatus;
  clinicalSummary: string | null;
  riskFlagsSummary: string | null;
  alertFlagsJson: string[];
}

export interface AppUser {
  id: string;
  orgId: string;
  displayName: string;
  firstName: string;
  lastName: string;
  email: string;
  status: UserStatus;
  userCategory: UserCategory;
  specialtyIds: string[];
}

export interface Specialty {
  id: string;
  orgId: string;
  code: string;
  name: string;
  isActive: boolean;
}

export interface VisitType {
  id: string;
  code: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Visit {
  id: string;
  orgId: string;
  clinicId: string;
  patientId: string;
  clinicalRecordId: string;
  createdByUserId: string;
  attendingUserId: string | null;
  specialtyId: string | null;
  visitTypeId: string | null;
  reasonForVisit: string | null;
  startedAt: string;
  endedAt: string | null;
  status: VisitStatus;
  sourceType: VisitSourceType;
  createdAt: string;
  updatedAt: string;
}

export interface WorkingHourRule {
  enabled: boolean;
  start: string;
  end: string;
}

export type WorkingHours = Record<string, WorkingHourRule>;

export interface ClinicBookingSettings {
  id: string;
  orgId: string;
  clinicId: string;
  defaultSlotDurationMinutes: number;
  minNoticeMinutes: number;
  maxDaysAhead: number;
  internalBookingEnabled: boolean;
  externalBookingEnabled: boolean;
  externalRequiresManualConfirmation: boolean;
  workingHoursJson: WorkingHours;
  metadataJson: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  orgId: string;
  clinicId: string;
  patientId: string;
  clinicalRecordId: string;
  createdByUserId: string;
  updatedByUserId: string | null;
  attendingUserId: string | null;
  specialtyId: string | null;
  visitTypeId: string | null;
  visitId: string | null;
  rescheduledFromAppointmentId: string | null;
  bookingSource: BookingSource;
  status: AppointmentStatus;
  scheduledStartAt: string;
  scheduledEndAt: string;
  reasonForVisit: string | null;
  patientNotes: string | null;
  internalNotes: string | null;
  confirmedAt: string | null;
  checkedInAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  cancelledByUserId: string | null;
  cancellationReason: string | null;
  noShowMarkedAt: string | null;
  noShowMarkedByUserId: string | null;
  noShowReason: string | null;
  externalReference: string | null;
  metadataJson: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface BookingMockState {
  organization: Organization;
  currentUserId: string;
  clinics: Clinic[];
  patients: Patient[];
  clinicalRecords: ClinicalRecord[];
  users: AppUser[];
  specialties: Specialty[];
  visitTypes: VisitType[];
  appointments: Appointment[];
  visits: Visit[];
  settings: ClinicBookingSettings[];
}

export interface CreateAppointmentInput {
  clinicId: string;
  patientId: string;
  clinicalRecordId: string;
  attendingUserId: string | null;
  specialtyId: string | null;
  visitTypeId: string | null;
  scheduledStartAt: string;
  scheduledEndAt: string;
  reasonForVisit: string | null;
  patientNotes: string | null;
  internalNotes: string | null;
}

export interface RescheduleAppointmentInput {
  appointmentId: string;
  scheduledStartAt: string;
  scheduledEndAt: string;
  changeReason: string | null;
}

export interface UpdateBookingSettingsInput {
  clinicId: string;
  defaultSlotDurationMinutes: number;
  minNoticeMinutes: number;
  maxDaysAhead: number;
  internalBookingEnabled: boolean;
  externalBookingEnabled: boolean;
  externalRequiresManualConfirmation: boolean;
  workingHoursJson: WorkingHours;
}

export type AppointmentActionKey =
  | "confirm"
  | "check_in"
  | "start_visit"
  | "reschedule"
  | "cancel"
  | "mark_no_show"
  | "view_visit"
  | "view_patient"
  | "view_successor";

export interface MutationResult<T> {
  ok: boolean;
  error?: string;
  data?: T;
}
