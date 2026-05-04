export type Uuid = string;

export type ConditionStatus = "present" | "suspected" | "resolved";
export type ConditionScope =
  | "medical"
  | "dental"
  | "allergy"
  | "pregnancy"
  | "habit"
  | "risk"
  | "other"
  | "mixed";
export type SeverityLevel = "low" | "medium" | "high" | "critical";
export type MedicationStatus = "current" | "paused" | "stopped" | "unknown";
export type BloodType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | "unknown";
export type PatientSex = "female" | "male" | "other" | "unknown";
export type RecordStatus = "open" | "archived";
export type PatientStatus = "active" | "inactive" | "archived";

// Raw schema-aligned mock rows

export interface MockPatientRow {
  id: Uuid;
  orgId: Uuid;
  patientCode: string | null;
  firstName: string;
  lastName: string;
  secondLastName: string | null;
  birthDate: string | null;
  sex: PatientSex | null;
  phone: string | null;
  phoneNormalized: string | null;
  email: string | null;
  emailNormalized: string | null;
  addressText: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  notes: string | null;
  fullNameNormalized: string;
  status: PatientStatus;
  archivedAt: string | null;
  createdByUserId: Uuid | null;
  updatedByUserId: Uuid | null;
  createdAt: string;
  updatedAt: string;
}

export interface MockClinicalRecordRow {
  id: Uuid;
  orgId: Uuid;
  patientId: Uuid;
  recordNumber: string | null;
  status: RecordStatus;
  bloodType: BloodType | null;
  clinicalSummary: string | null;
  clinicalPrecautionsNotes: string | null;
  openedAt: string;
  archivedAt: string | null;
  updatedByUserId: Uuid | null;
  createdAt: string;
  updatedAt: string;
}

export interface MockClinicalConditionRow {
  id: Uuid;
  code: string;
  scope: ConditionScope;
  name: string;
  description: string | null;
  defaultRiskLevel: SeverityLevel | null;
  isRiskRelevant: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MockPatientConditionRow {
  id: Uuid;
  orgId: Uuid;
  patientId: Uuid;
  clinicalRecordId: Uuid;
  conditionId: Uuid;
  sourceVisitId: Uuid | null;
  status: ConditionStatus;
  severityLevel: SeverityLevel | null;
  onsetDate: string | null;
  resolutionDate: string | null;
  notes: string | null;
  recordedByUserId: Uuid;
  recordedAt: string;
  updatedAt: string;
}

export interface MockPatientMedicationRow {
  id: Uuid;
  orgId: Uuid;
  patientId: Uuid;
  clinicalRecordId: Uuid;
  medicationName: string;
  dosage: string | null;
  frequency: string | null;
  route: string | null;
  indication: string | null;
  startedOn: string | null;
  endedOn: string | null;
  status: MedicationStatus;
  notes: string | null;
  recordedByUserId: Uuid | null;
  recordedAt: string;
  updatedAt: string;
}

export interface MockAppUserRow {
  id: Uuid;
  orgId: Uuid;
  fullName: string;
}

// View models for the current frontend

export interface MockPatient {
  id: Uuid;
  orgId: Uuid;
  clinicalRecordId: Uuid;
  firstName: string;
  lastName: string;
  secondLastName: string;
  fullName: string;
  code: string;
  status: PatientStatus;
  birthDate: string;
  sex: PatientSex;
  phone: string;
  email: string;
  addressText: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  notes: string | null;
  recordNumber: string;
  recordStatus: RecordStatus;
  openedDate: string;
  archivedDate: string | null;
  bloodType: BloodType;
  clinicalSummary: string;
  clinicalPrecautionsNotes: string;
}

export interface MockPatientDerived {
  age: number;
  nextAppointment: string | null;
  lastClinic: string | null;
  visitedClinics: Array<{ id: Uuid; colorKey: string; shortName: string }>;
}

export interface MockCondition {
  id: Uuid;
  orgId: Uuid;
  patientId: Uuid;
  clinicalRecordId: Uuid;
  conditionId: Uuid;
  code: string;
  name: string;
  scope: ConditionScope;
  status: ConditionStatus;
  severityLevel: SeverityLevel | null;
  onsetDate: string | null;
  resolutionDate: string | null;
  notes?: string;
  sourceVisitId: Uuid | null;
  recordedByUserId: Uuid;
  recordedByDisplayName?: string;
  recordedAt: string;
  updatedAt: string;
}

export interface MockMedication {
  id: Uuid;
  orgId: Uuid;
  patientId: Uuid;
  clinicalRecordId: Uuid;
  medicationName: string;
  dosage: string | null;
  frequency: string | null;
  route: string | null;
  indication: string | null;
  startedOn: string | null;
  endedOn: string | null;
  status: MedicationStatus;
  notes?: string;
  recordedByUserId: Uuid | null;
  recordedByDisplayName?: string;
  recordedAt: string;
  updatedAt: string;
}

let localUuidCounter = 0;

export function createLocalUuid(): Uuid {
  localUuidCounter += 1;
  return `00000000-0000-4000-8000-${localUuidCounter.toString().padStart(12, "0")}`;
}

export function computeAge(isoDate: string): number {
  const birth = new Date(isoDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

const MONTHS_ES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

export function formatIsoDate(isoDate: string): string {
  const d = new Date(isoDate);
  return `${d.getDate()} ${MONTHS_ES[d.getMonth()]} ${d.getFullYear()}`;
}

export const scopeLabels: Record<ConditionScope, string> = {
  medical: "Médico",
  dental: "Dental",
  allergy: "Alergia",
  pregnancy: "Embarazo",
  habit: "Hábito",
  risk: "Riesgo",
  other: "Otro",
  mixed: "Mixto",
};

export const scopeColors: Record<ConditionScope, string> = {
  medical: "bg-blue-100 text-blue-800 border-blue-200",
  dental: "bg-purple-100 text-purple-800 border-purple-200",
  allergy: "bg-red-100 text-red-800 border-red-200",
  pregnancy: "bg-pink-100 text-pink-800 border-pink-200",
  habit: "bg-amber-100 text-amber-800 border-amber-200",
  risk: "bg-orange-100 text-orange-800 border-orange-200",
  other: "bg-gray-100 text-gray-800 border-gray-200",
  mixed: "bg-cyan-100 text-cyan-800 border-cyan-200",
};

export const statusLabels: Record<ConditionStatus, string> = {
  present: "Presente",
  suspected: "Sospechada",
  resolved: "Resuelta",
};

export const statusColors: Record<ConditionStatus, string> = {
  present: "bg-emerald-100 text-emerald-800 border-emerald-200",
  suspected: "bg-yellow-100 text-yellow-800 border-yellow-200",
  resolved: "bg-gray-100 text-gray-600 border-gray-200",
};

export const severityLabels: Record<SeverityLevel, string> = {
  low: "Bajo",
  medium: "Medio",
  high: "Alto",
  critical: "Crítico",
};

export const severityColors: Record<SeverityLevel, string> = {
  low: "bg-green-100 text-green-800 border-green-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  high: "bg-orange-100 text-orange-800 border-orange-200",
  critical: "bg-red-100 text-red-800 border-red-200",
};

export const medicationStatusLabels: Record<MedicationStatus, string> = {
  current: "Actual",
  paused: "Pausado",
  stopped: "Suspendido",
  unknown: "Desconocido",
};

export const medicationStatusColors: Record<MedicationStatus, string> = {
  current: "bg-emerald-100 text-emerald-800 border-emerald-200",
  paused: "bg-yellow-100 text-yellow-800 border-yellow-200",
  stopped: "bg-orange-100 text-orange-800 border-orange-200",
  unknown: "bg-slate-100 text-slate-600 border-slate-200",
};

export function getMedicationStatusPresentation(
  medication: Pick<MockMedication, "status" | "endedOn" | "notes">,
) {
  const notes = medication.notes?.toLowerCase() ?? "";

  if (medication.status === "stopped" && medication.endedOn && notes.includes("tratamiento completado")) {
    return {
      label: "Finalizado",
      className: "bg-violet-100 text-violet-700 border-violet-200",
    };
  }

  return {
    label: medicationStatusLabels[medication.status],
    className: medicationStatusColors[medication.status],
  };
}

export const sexLabels: Record<PatientSex, string> = {
  female: "Femenino",
  male: "Masculino",
  other: "Otro",
  unknown: "No especificado",
};
