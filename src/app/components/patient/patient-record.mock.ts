import type {
  BloodType,
  ConditionScope,
  MockAppUserRow,
  MockClinicalConditionRow,
  MockClinicalRecordRow,
  MockCondition,
  MockMedication,
  MockPatient,
  MockPatientConditionRow,
  MockPatientDerived,
  MockPatientMedicationRow,
  MockPatientRow,
  SeverityLevel,
  Uuid,
} from "./types";
import { computeAge, formatIsoDate } from "./types";

const mockIds = {
  orgId: "0f100000-0000-4000-8000-000000000001",
  patientId: "0f100000-0000-4000-8000-000000000101",
  clinicalRecordId: "0f100000-0000-4000-8000-000000000201",
  createdByUserId: "0f100000-0000-4000-8000-000000000301",
  clinicianUserId: "0f100000-0000-4000-8000-000000000302",
  followUpUserId: "0f100000-0000-4000-8000-000000000303",
  visitId: "0f100000-0000-4000-8000-000000000401",
  clinicCentroId: "0f100000-0000-4000-8000-000000000501",
  clinicNorteId: "0f100000-0000-4000-8000-000000000502",
} as const;

const MONTHS_ES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

function formatMonthYear(isoDate: string) {
  const date = new Date(isoDate);
  return `${MONTHS_ES[date.getMonth()]} ${date.getFullYear()}`;
}

function buildConditionId(index: number) {
  return `0f100000-0000-4000-8000-${(600 + index).toString().padStart(12, "0")}`;
}

let catalogCounter = 0;

const catalogSeed: Record<
  ConditionScope,
  Array<{
    code: string;
    name: string;
    description?: string;
    defaultRiskLevel?: SeverityLevel | null;
    isRiskRelevant?: boolean;
  }>
> = {
  allergy: [
    { code: "ALG_PENICILIN", name: "Alergia a la penicilina", defaultRiskLevel: "high", isRiskRelevant: true },
    { code: "ALG_ANEST_LOCAL", name: "Alergia a anestésicos locales", defaultRiskLevel: "high", isRiskRelevant: true },
    { code: "ALG_LATEX", name: "Alergia al látex", defaultRiskLevel: "medium", isRiskRelevant: true },
    { code: "ALG_METALES", name: "Alergia a metales (níquel, cromo)", defaultRiskLevel: "medium" },
    { code: "ALG_AINES", name: "Alergia a ibuprofeno / AINEs", defaultRiskLevel: "medium", isRiskRelevant: true },
    { code: "ALG_ASPIRINA", name: "Alergia a la aspirina", defaultRiskLevel: "medium", isRiskRelevant: true },
    { code: "ALG_ALIMENTARIA", name: "Alergia alimentaria", defaultRiskLevel: "low" },
  ],
  medical: [
    { code: "MED_HTA", name: "Hipertensión arterial", defaultRiskLevel: "medium", isRiskRelevant: true },
    { code: "MED_DM2", name: "Diabetes mellitus tipo 2", defaultRiskLevel: "medium", isRiskRelevant: true },
    { code: "MED_ASMA", name: "Asma", defaultRiskLevel: "medium", isRiskRelevant: true },
    { code: "MED_EPILEPSIA", name: "Epilepsia", defaultRiskLevel: "high", isRiskRelevant: true },
    { code: "MED_RENAL", name: "Insuficiencia renal", defaultRiskLevel: "high", isRiskRelevant: true },
    { code: "MED_CARDIO", name: "Problemas cardiovasculares", defaultRiskLevel: "high", isRiskRelevant: true },
    { code: "MED_HEMOGRAMA", name: "Alteraciones del hemograma", defaultRiskLevel: "medium", isRiskRelevant: true },
    { code: "MED_HEMATO", name: "Trastornos hematológicos", defaultRiskLevel: "high", isRiskRelevant: true },
    { code: "MED_PULMONAR", name: "Problemas pulmonares", defaultRiskLevel: "medium", isRiskRelevant: true },
    { code: "MED_HEPATICA", name: "Enfermedad hepática", defaultRiskLevel: "medium", isRiskRelevant: true },
    { code: "MED_TIROIDES", name: "Hipotiroidismo / Hipertiroidismo", defaultRiskLevel: "low" },
  ],
  dental: [
    { code: "DEN_BRUXISMO", name: "Bruxismo nocturno", defaultRiskLevel: "medium" },
    { code: "DEN_PERIODONTAL", name: "Enfermedad periodontal", defaultRiskLevel: "medium" },
    { code: "DEN_SENSIBILIDAD", name: "Sensibilidad dental severa", defaultRiskLevel: "low" },
    { code: "DEN_IMPLANTES", name: "Implantes dentales", defaultRiskLevel: "low" },
    { code: "DEN_PROTESIS", name: "Prótesis dental", defaultRiskLevel: "low" },
    { code: "DEN_ENDODONCIA", name: "Endodoncia previa", defaultRiskLevel: "low" },
    { code: "DEN_BRACKETS", name: "Brackets (ortodoncia)", defaultRiskLevel: "low" },
  ],
  habit: [
    { code: "HAB_HIGIENE", name: "Higiene dental deficiente", defaultRiskLevel: "low" },
    { code: "HAB_TABAQUISMO", name: "Tabaquismo", defaultRiskLevel: "medium", isRiskRelevant: true },
    { code: "HAB_ALCOHOL", name: "Consumo regular de alcohol", defaultRiskLevel: "medium" },
    { code: "HAB_ONICOFAGIA", name: "Onicofagia", defaultRiskLevel: "low" },
    { code: "HAB_HILO", name: "Uso irregular de hilo dental", defaultRiskLevel: "low" },
    { code: "HAB_RESP_BUCAL", name: "Respiración bucal", defaultRiskLevel: "low" },
  ],
  risk: [
    { code: "RISK_VASO", name: "Contraindicación a vasoconstrictores", defaultRiskLevel: "medium", isRiskRelevant: true },
    { code: "RISK_HEMORR", name: "Riesgo de hemorragia posoperatoria", defaultRiskLevel: "high", isRiskRelevant: true },
    { code: "RISK_ANEST", name: "Incompatibilidad con anestésicos locales", defaultRiskLevel: "high", isRiskRelevant: true },
    { code: "RISK_ANSIEDAD", name: "Fobia dental / ansiedad severa", defaultRiskLevel: "medium", isRiskRelevant: true },
    { code: "RISK_SINCOPE", name: "Antecedentes de síncope dental", defaultRiskLevel: "medium", isRiskRelevant: true },
    { code: "RISK_INFECCION", name: "Riesgo de infección", defaultRiskLevel: "medium", isRiskRelevant: true },
  ],
  pregnancy: [
    { code: "PREG_EMBARAZO", name: "Embarazo", defaultRiskLevel: "medium", isRiskRelevant: true },
    { code: "PREG_LACTANCIA", name: "Lactancia", defaultRiskLevel: "medium", isRiskRelevant: true },
    { code: "PREG_PLAN", name: "Planificación de embarazo", defaultRiskLevel: "low" },
  ],
  other: [],
  mixed: [],
};

export const mockAppUsers: MockAppUserRow[] = [
  { id: mockIds.createdByUserId, orgId: mockIds.orgId, fullName: "Dr. Luis Hernández" },
  { id: mockIds.clinicianUserId, orgId: mockIds.orgId, fullName: "Dra. Sofía Ramírez" },
  { id: mockIds.followUpUserId, orgId: mockIds.orgId, fullName: "Dr. Javier Ortega" },
];

export const mockPatientRow: MockPatientRow = {
  id: mockIds.patientId,
  orgId: mockIds.orgId,
  patientCode: "PROMOTIONALORG-GENERAL-PAC-000004",
  firstName: "Abraham Isaac",
  lastName: "Rosales",
  secondLastName: "Gutiérrez",
  birthDate: "2003-08-30",
  sex: "male",
  phone: "+52 55 1234 5678",
  phoneNormalized: "+525512345678",
  email: "avierrojas@gmail.com",
  emailNormalized: "avierrojas@gmail.com",
  addressText: "Calle Insurgentes 123, Col. Del Valle, CDMX, C.P. 03100",
  emergencyContactName: "Rosa Gutiérrez Morales",
  emergencyContactPhone: "+52 55 9876 5432",
  notes: "Prefiere citas matutinas. Manejo de ansiedad con música en consultorio.",
  fullNameNormalized: "abraham isaac rosales gutierrez",
  status: "active",
  archivedAt: null,
  createdByUserId: mockIds.createdByUserId,
  updatedByUserId: mockIds.clinicianUserId,
  createdAt: "2026-03-15T09:00:00.000Z",
  updatedAt: "2026-03-20T12:30:00.000Z",
};

export const mockClinicalRecordRow: MockClinicalRecordRow = {
  id: mockIds.clinicalRecordId,
  orgId: mockIds.orgId,
  patientId: mockIds.patientId,
  recordNumber: "EXP-2026-000004",
  status: "open",
  bloodType: "O+",
  clinicalSummary:
    "Paciente masculino de 22 años con hipertensión arterial controlada con Losartán 50 mg/día desde enero 2025. " +
    "Alergia severa a la penicilina documentada en la infancia. Contraindicación a vasoconstrictores.",
  clinicalPrecautionsNotes:
    "No darle café. Monitorizar presión arterial en procedimientos extensos.",
  openedAt: "2026-03-15T09:10:00.000Z",
  archivedAt: null,
  updatedByUserId: mockIds.clinicianUserId,
  createdAt: "2026-03-15T09:10:00.000Z",
  updatedAt: "2026-03-20T12:30:00.000Z",
};

export const mockClinicalConditionsCatalog: MockClinicalConditionRow[] = Object.entries(catalogSeed).flatMap(
  ([scope, items]) =>
    items.map((item) => ({
      id: buildConditionId(++catalogCounter),
      code: item.code,
      scope: scope as ConditionScope,
      name: item.name,
      description: item.description ?? null,
      defaultRiskLevel: item.defaultRiskLevel ?? null,
      isRiskRelevant: item.isRiskRelevant ?? false,
      isActive: true,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    })),
);

const clinicalConditionByName = new Map(
  mockClinicalConditionsCatalog.map((condition) => [condition.name, condition]),
);

const conditionDisplayMeta: Record<
  Uuid,
  {
    onsetDateLabel?: string;
    resolutionDateLabel?: string;
  }
> = {};

export const mockPatientConditionRows: MockPatientConditionRow[] = [
  {
    id: "0f100000-0000-4000-8000-000000000701",
    orgId: mockIds.orgId,
    patientId: mockIds.patientId,
    clinicalRecordId: mockIds.clinicalRecordId,
    conditionId: clinicalConditionByName.get("Hipertensión arterial")!.id,
    sourceVisitId: mockIds.visitId,
    status: "present",
    severityLevel: "medium",
    onsetDate: "2025-01-10",
    resolutionDate: null,
    notes: "Controlada con Losartán 50 mg/día.",
    recordedByUserId: mockIds.createdByUserId,
    recordedAt: "2026-03-15T10:15:00.000Z",
    updatedAt: "2026-03-20T12:00:00.000Z",
  },
  {
    id: "0f100000-0000-4000-8000-000000000702",
    orgId: mockIds.orgId,
    patientId: mockIds.patientId,
    clinicalRecordId: mockIds.clinicalRecordId,
    conditionId: clinicalConditionByName.get("Alergia a la penicilina")!.id,
    sourceVisitId: null,
    status: "present",
    severityLevel: "high",
    onsetDate: "2008-01-01",
    resolutionDate: null,
    notes: "Reacción alérgica severa documentada.",
    recordedByUserId: mockIds.clinicianUserId,
    recordedAt: "2026-03-15T10:20:00.000Z",
    updatedAt: "2026-03-15T10:20:00.000Z",
  },
  {
    id: "0f100000-0000-4000-8000-000000000703",
    orgId: mockIds.orgId,
    patientId: mockIds.patientId,
    clinicalRecordId: mockIds.clinicalRecordId,
    conditionId: clinicalConditionByName.get("Contraindicación a vasoconstrictores")!.id,
    sourceVisitId: mockIds.visitId,
    status: "present",
    severityLevel: "medium",
    onsetDate: "2025-01-10",
    resolutionDate: null,
    notes: "Evitar vasoconstrictores en procedimientos extensos.",
    recordedByUserId: mockIds.createdByUserId,
    recordedAt: "2026-03-15T10:30:00.000Z",
    updatedAt: "2026-03-18T09:00:00.000Z",
  },
  {
    id: "0f100000-0000-4000-8000-000000000704",
    orgId: mockIds.orgId,
    patientId: mockIds.patientId,
    clinicalRecordId: mockIds.clinicalRecordId,
    conditionId: clinicalConditionByName.get("Bruxismo nocturno")!.id,
    sourceVisitId: mockIds.visitId,
    status: "present",
    severityLevel: "medium",
    onsetDate: "2024-08-01",
    resolutionDate: null,
    notes: "Paciente refiere apretar los dientes durante la noche.",
    recordedByUserId: mockIds.followUpUserId,
    recordedAt: "2026-03-20T08:15:00.000Z",
    updatedAt: "2026-03-20T08:15:00.000Z",
  },
  {
    id: "0f100000-0000-4000-8000-000000000705",
    orgId: mockIds.orgId,
    patientId: mockIds.patientId,
    clinicalRecordId: mockIds.clinicalRecordId,
    conditionId: clinicalConditionByName.get("Higiene dental deficiente")!.id,
    sourceVisitId: mockIds.visitId,
    status: "present",
    severityLevel: "low",
    onsetDate: "2024-08-01",
    resolutionDate: null,
    notes: "No mantiene una rutina constante de cepillado e hilo dental.",
    recordedByUserId: mockIds.followUpUserId,
    recordedAt: "2026-03-20T08:20:00.000Z",
    updatedAt: "2026-03-20T08:20:00.000Z",
  },
  {
    id: "0f100000-0000-4000-8000-000000000706",
    orgId: mockIds.orgId,
    patientId: mockIds.patientId,
    clinicalRecordId: mockIds.clinicalRecordId,
    conditionId: clinicalConditionByName.get("Brackets (ortodoncia)")!.id,
    sourceVisitId: mockIds.visitId,
    status: "resolved",
    severityLevel: "low",
    onsetDate: "2024-03-01",
    resolutionDate: "2026-03-20",
    notes: "Tratamiento de ortodoncia concluido sin incidencias.",
    recordedByUserId: mockIds.clinicianUserId,
    recordedAt: "2026-03-15T10:40:00.000Z",
    updatedAt: "2026-03-20T11:00:00.000Z",
  },
];

conditionDisplayMeta["0f100000-0000-4000-8000-000000000702"] = { onsetDateLabel: "Infancia" };

export const mockPatientMedicationRows: MockPatientMedicationRow[] = [
  {
    id: "0f100000-0000-4000-8000-000000000801",
    orgId: mockIds.orgId,
    patientId: mockIds.patientId,
    clinicalRecordId: mockIds.clinicalRecordId,
    medicationName: "Losartán",
    dosage: "50 mg",
    frequency: "Una vez al día",
    route: "Oral",
    indication: "Hipertensión arterial",
    startedOn: "2025-03-10",
    endedOn: null,
    status: "current",
    notes: "Tomar con o sin alimentos.",
    recordedByUserId: mockIds.createdByUserId,
    recordedAt: "2026-03-15T10:45:00.000Z",
    updatedAt: "2026-03-15T10:45:00.000Z",
  },
  {
    id: "0f100000-0000-4000-8000-000000000802",
    orgId: mockIds.orgId,
    patientId: mockIds.patientId,
    clinicalRecordId: mockIds.clinicalRecordId,
    medicationName: "Atorvastatina",
    dosage: "20 mg",
    frequency: "Una vez al día",
    route: "Oral",
    indication: "Hipercolesterolemia",
    startedOn: "2025-01-05",
    endedOn: null,
    status: "current",
    notes: "Tomar en la noche.",
    recordedByUserId: mockIds.clinicianUserId,
    recordedAt: "2026-03-15T10:50:00.000Z",
    updatedAt: "2026-03-15T10:50:00.000Z",
  },
  {
    id: "0f100000-0000-4000-8000-000000000803",
    orgId: mockIds.orgId,
    patientId: mockIds.patientId,
    clinicalRecordId: mockIds.clinicalRecordId,
    medicationName: "Amlodipino",
    dosage: "5 mg",
    frequency: "Una vez al día",
    route: "Oral",
    indication: "Hipertensión arterial",
    startedOn: "2024-11-12",
    endedOn: "2025-03-09",
    status: "stopped",
    notes: "Cambio a Losartán por mejor control de la presión.",
    recordedByUserId: mockIds.createdByUserId,
    recordedAt: "2026-03-15T10:55:00.000Z",
    updatedAt: "2026-03-18T09:15:00.000Z",
  },
  {
    id: "0f100000-0000-4000-8000-000000000804",
    orgId: mockIds.orgId,
    patientId: mockIds.patientId,
    clinicalRecordId: mockIds.clinicalRecordId,
    medicationName: "Ibuprofeno",
    dosage: "400 mg",
    frequency: "Cada 8 horas",
    route: "Oral",
    indication: "Control postoperatorio",
    startedOn: "2026-03-20",
    endedOn: "2026-03-25",
    status: "stopped",
    notes: "Tratamiento completado.",
    recordedByUserId: mockIds.clinicianUserId,
    recordedAt: "2026-03-20T17:10:00.000Z",
    updatedAt: "2026-03-25T08:00:00.000Z",
  },
];

const usersById = new Map(mockAppUsers.map((user) => [user.id, user]));
const conditionsById = new Map(mockClinicalConditionsCatalog.map((condition) => [condition.id, condition]));

function buildFullName(patientRow: MockPatientRow) {
  return [patientRow.firstName, patientRow.lastName, patientRow.secondLastName].filter(Boolean).join(" ");
}

export const mockPatient: MockPatient = {
  id: mockPatientRow.id,
  orgId: mockPatientRow.orgId,
  clinicalRecordId: mockClinicalRecordRow.id,
  firstName: mockPatientRow.firstName,
  lastName: mockPatientRow.lastName,
  secondLastName: mockPatientRow.secondLastName ?? "",
  fullName: buildFullName(mockPatientRow),
  code: mockPatientRow.patientCode ?? "",
  status: mockPatientRow.status,
  birthDate: mockPatientRow.birthDate ?? "2003-08-30",
  sex: mockPatientRow.sex ?? "unknown",
  phone: mockPatientRow.phone ?? "",
  email: mockPatientRow.email ?? "",
  addressText: mockPatientRow.addressText ?? "",
  emergencyContactName: mockPatientRow.emergencyContactName ?? "",
  emergencyContactPhone: mockPatientRow.emergencyContactPhone ?? "",
  notes: mockPatientRow.notes,
  recordNumber: mockClinicalRecordRow.recordNumber ?? "",
  recordStatus: mockClinicalRecordRow.status,
  openedDate: formatIsoDate(mockClinicalRecordRow.openedAt),
  archivedDate: mockClinicalRecordRow.archivedAt ? formatIsoDate(mockClinicalRecordRow.archivedAt) : null,
  bloodType: mockClinicalRecordRow.bloodType ?? "unknown",
  clinicalSummary: mockClinicalRecordRow.clinicalSummary ?? "",
  clinicalPrecautionsNotes: mockClinicalRecordRow.clinicalPrecautionsNotes ?? "",
};

export const mockPatientDerived: MockPatientDerived = {
  age: computeAge(mockPatient.birthDate),
  nextAppointment: "15 May 2026",
  lastClinic: "Clínica Del Valle Centro",
  visitedClinics: [
    { id: mockIds.clinicCentroId, colorKey: "teal", shortName: "Centro" },
    { id: mockIds.clinicNorteId, colorKey: "violet", shortName: "Norte" },
  ],
};

export const mockPatientConditions: MockCondition[] = mockPatientConditionRows.map((row) => {
  const condition = conditionsById.get(row.conditionId)!;
  const displayMeta = conditionDisplayMeta[row.id];

  return {
    id: row.id,
    orgId: row.orgId,
    patientId: row.patientId,
    clinicalRecordId: row.clinicalRecordId,
    conditionId: row.conditionId,
    code: condition.code,
    name: condition.name,
    scope: condition.scope,
    status: row.status,
    severityLevel: row.severityLevel ?? condition.defaultRiskLevel ?? null,
    onsetDate: row.onsetDate
      ? displayMeta?.onsetDateLabel ?? formatMonthYear(row.onsetDate)
      : null,
    resolutionDate: row.resolutionDate
      ? displayMeta?.resolutionDateLabel ?? formatIsoDate(row.resolutionDate)
      : null,
    notes: row.notes ?? undefined,
    sourceVisitId: row.sourceVisitId,
    recordedByUserId: row.recordedByUserId,
    recordedByDisplayName: usersById.get(row.recordedByUserId)?.fullName,
    recordedAt: formatIsoDate(row.recordedAt),
    updatedAt: row.updatedAt,
  };
});

export const mockPatientMedications: MockMedication[] = mockPatientMedicationRows.map((row) => ({
  id: row.id,
  orgId: row.orgId,
  patientId: row.patientId,
  clinicalRecordId: row.clinicalRecordId,
  medicationName: row.medicationName,
  dosage: row.dosage,
  frequency: row.frequency,
  route: row.route,
  indication: row.indication,
  startedOn: row.startedOn ? formatIsoDate(row.startedOn) : null,
  endedOn: row.endedOn ? formatIsoDate(row.endedOn) : null,
  status: row.status,
  notes: row.notes ?? undefined,
  recordedByUserId: row.recordedByUserId,
  recordedByDisplayName: row.recordedByUserId ? usersById.get(row.recordedByUserId)?.fullName : undefined,
  recordedAt: formatIsoDate(row.recordedAt),
  updatedAt: row.updatedAt,
}));

export const pregnancyStatusOptions = [
  "No aplica",
  ...mockClinicalConditionsCatalog
    .filter((condition) => condition.scope === "pregnancy")
    .map((condition) => condition.name),
] as const;

export type PregnancyStatusOption = (typeof pregnancyStatusOptions)[number];

export const defaultPregnancyStatus: PregnancyStatusOption = "No aplica";

export const bloodTypeOptions: { value: BloodType; label: string; description: string }[] = [
  { value: "A+", label: "A+", description: "A positivo" },
  { value: "A-", label: "A−", description: "A negativo" },
  { value: "B+", label: "B+", description: "B positivo" },
  { value: "B-", label: "B−", description: "B negativo" },
  { value: "AB+", label: "AB+", description: "AB positivo" },
  { value: "AB-", label: "AB−", description: "AB negativo" },
  { value: "O+", label: "O+", description: "O positivo" },
  { value: "O-", label: "O−", description: "O negativo" },
  { value: "unknown", label: "Desconocido", description: "" },
];

export const conditionCatalogDisplayCount = 152;

export const conditionCatalogByScope: Record<ConditionScope, string[]> = {
  allergy: mockClinicalConditionsCatalog.filter((condition) => condition.scope === "allergy").map((condition) => condition.name),
  medical: mockClinicalConditionsCatalog.filter((condition) => condition.scope === "medical").map((condition) => condition.name),
  dental: mockClinicalConditionsCatalog.filter((condition) => condition.scope === "dental").map((condition) => condition.name),
  habit: mockClinicalConditionsCatalog.filter((condition) => condition.scope === "habit").map((condition) => condition.name),
  risk: mockClinicalConditionsCatalog.filter((condition) => condition.scope === "risk").map((condition) => condition.name),
  pregnancy: mockClinicalConditionsCatalog.filter((condition) => condition.scope === "pregnancy").map((condition) => condition.name),
  other: [],
  mixed: [],
};

export const frequentConditions: Array<{ name: string; scope: ConditionScope }> = [
  { name: "Hipertensión arterial", scope: "medical" },
  { name: "Alergia a la penicilina", scope: "allergy" },
  { name: "Diabetes mellitus tipo 2", scope: "medical" },
  { name: "Bruxismo nocturno", scope: "dental" },
  { name: "Embarazo", scope: "pregnancy" },
  { name: "Tabaquismo", scope: "habit" },
];

export const defaultSeverityByScope: Record<ConditionScope, SeverityLevel> = {
  allergy: "high",
  risk: "medium",
  medical: "medium",
  dental: "low",
  habit: "low",
  pregnancy: "medium",
  other: "low",
  mixed: "medium",
};
