import type {
  ClinicalRecord as BookingClinicalRecord,
  Patient as BookingPatient,
} from "../../features/booking/bookingTypes";
import {
  mockPatient,
  mockPatientConditions,
  mockPatientMedications,
} from "./patient-record.mock";
import type { MockCondition, MockMedication, MockPatient, Uuid } from "./types";

export interface PatientRecordVisualBundle {
  patient: MockPatient;
  conditions: MockCondition[];
  medications: MockMedication[];
}

function buildFullName(patient?: BookingPatient | null) {
  return [patient?.firstName, patient?.lastName, patient?.secondLastName]
    .filter(Boolean)
    .join(" ");
}

function mapConditionsToPatientContext(
  patientId: Uuid,
  clinicalRecordId: Uuid,
  orgId: Uuid,
) {
  return mockPatientConditions.map<MockCondition>((condition) => ({
    ...condition,
    orgId,
    patientId,
    clinicalRecordId,
  }));
}

function mapMedicationsToPatientContext(
  patientId: Uuid,
  clinicalRecordId: Uuid,
  orgId: Uuid,
) {
  return mockPatientMedications.map<MockMedication>((medication) => ({
    ...medication,
    orgId,
    patientId,
    clinicalRecordId,
  }));
}

export function buildPatientRecordVisualBundle(
  patient?: BookingPatient | null,
  record?: BookingClinicalRecord | null,
): PatientRecordVisualBundle {
  const patientId = patient?.id ?? mockPatient.id;
  const clinicalRecordId = record?.id ?? mockPatient.clinicalRecordId;
  const orgId = patient?.orgId ?? record?.orgId ?? mockPatient.orgId;
  const fullName = buildFullName(patient) || mockPatient.fullName;

  return {
    patient: {
      ...mockPatient,
      id: patientId,
      orgId,
      clinicalRecordId,
      firstName: patient?.firstName ?? mockPatient.firstName,
      lastName: patient?.lastName ?? mockPatient.lastName,
      secondLastName: patient?.secondLastName ?? mockPatient.secondLastName,
      fullName,
      code: patient?.patientCode ?? mockPatient.code,
      status: patient?.status ?? mockPatient.status,
      birthDate: patient?.birthDate ?? mockPatient.birthDate,
      phone: patient?.phone ?? mockPatient.phone,
      email: patient?.email ?? mockPatient.email,
      recordNumber: record?.recordNumber ?? mockPatient.recordNumber,
      recordStatus: record?.status ?? mockPatient.recordStatus,
      clinicalSummary: mockPatient.clinicalSummary,
      clinicalPrecautionsNotes: mockPatient.clinicalPrecautionsNotes,
    },
    conditions: mapConditionsToPatientContext(patientId, clinicalRecordId, orgId),
    medications: mapMedicationsToPatientContext(patientId, clinicalRecordId, orgId),
  };
}
