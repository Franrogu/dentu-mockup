import type { ClinicColorKey } from "../../constants/clinics";
import { mockPatient, mockPatientDerived } from "../../components/patient/patient-record.mock";
import { sexLabels } from "../../components/patient/types";

export type VisitStatus = "draft" | "open" | "completed" | "cancelled" | "voided";
export type PaymentStatus = "pending" | "recorded" | "voided" | "refunded" | "paid";

export interface VisitMockPatient {
  id: string;
  routeId: string;
  fullName: string;
  initials: string;
  age: number;
  sex: string;
  recordNumber: string;
  status: "active" | "inactive" | "archived";
}

export interface VisitMockClinic {
  id: string;
  name: string;
  shortName: string;
  colorKey: ClinicColorKey;
}

export interface VisitMockUser {
  id: string;
  name: string;
}

export interface VisitMockSpecialty {
  id: string;
  name: string;
}

export interface VisitMockType {
  code: string;
  label: string;
}

export interface VisitMockAttachment {
  name: string;
  extension: string;
  size: string;
}

export interface VisitMockTimelineItem {
  time: string;
  label: string;
  by: string;
}

export interface VisitMock {
  id: string;
  patient: VisitMockPatient;
  clinic: VisitMockClinic;
  attendingDentist: VisitMockUser;
  specialty: VisitMockSpecialty;
  visitType: VisitMockType;
  reasonForVisit: string;
  chiefComplaint?: string;
  clinicalNotes?: string;
  diagnosisNotes?: string;
  proceduresSummary?: string;
  startedAt: string;
  endedAt?: string;
  status: VisitStatus;
  createdAt: string;
  updatedAt: string;
  createdByUser: string;
  updatedByUser: string;
  related: {
    conditionsCount: number;
    conditions: string[];
    attachmentsCount: number;
    attachments: VisitMockAttachment[];
    hasOdontogramSnapshot: boolean;
    odontogramLabel?: string;
    odontogramTeeth?: string[];
    paymentStatus?: PaymentStatus;
    paymentAmount?: string;
    paymentLabel?: string;
  };
  timeline: VisitMockTimelineItem[];
}

const clinicMatriz: VisitMockClinic = {
  id: "clinic-matriz",
  name: "Clínica Matriz",
  shortName: "Matriz",
  colorKey: "teal",
};

const clinicSatelite: VisitMockClinic = {
  id: "clinic-satelite",
  name: "Clínica Satélite",
  shortName: "Satélite",
  colorKey: "violet",
};

const abrahamPatient: VisitMockPatient = {
  id: mockPatient.id,
  routeId: "1",
  fullName: mockPatient.fullName,
  initials: "AR",
  age: mockPatientDerived.age,
  sex: sexLabels[mockPatient.sex],
  recordNumber: mockPatient.recordNumber,
  status: mockPatient.status,
};

const mariaPatient: VisitMockPatient = {
  id: "patient-maria-gomez",
  routeId: "2",
  fullName: "María Gómez",
  initials: "MG",
  age: 34,
  sex: "Femenino",
  recordNumber: "EXP-2026-000123",
  status: "active",
};

const carlosPatient: VisitMockPatient = {
  id: "patient-carlos-ramirez",
  routeId: "3",
  fullName: "Carlos Ramírez",
  initials: "CR",
  age: 42,
  sex: "Masculino",
  recordNumber: "EXP-2026-000154",
  status: "active",
};

const anaPatient: VisitMockPatient = {
  id: "patient-ana-lopez",
  routeId: "4",
  fullName: "Ana López",
  initials: "AL",
  age: 28,
  sex: "Femenino",
  recordNumber: "EXP-2026-000166",
  status: "active",
};

const josePatient: VisitMockPatient = {
  id: "patient-jose-torres",
  routeId: "5",
  fullName: "José Torres",
  initials: "JT",
  age: 51,
  sex: "Masculino",
  recordNumber: "EXP-2026-000177",
  status: "active",
};

const drLuis: VisitMockUser = { id: "user-dr-luis", name: "Dr. Luis Hernández" };
const draSofia: VisitMockUser = { id: "user-dra-sofia", name: "Dra. Sofía Ramírez" };
const drCarlos: VisitMockUser = { id: "user-dr-carlos", name: "Dr. Carlos Méndez" };
const draElena: VisitMockUser = { id: "user-dra-elena", name: "Dra. Elena Vargas" };

const generalSpecialty: VisitMockSpecialty = { id: "specialty-general", name: "Odontología general" };

export const mockVisitStats = {
  patient: {
    total: 8,
    open: 1,
    completed: 6,
    cancelledOrVoided: 1,
  },
  global: {
    today: 12,
    open: 3,
    completed: 8,
    cancelled: 1,
  },
};

export const mockVisitFormDefaults = {
  clinic: clinicMatriz.name,
  attendingDentist: drLuis.name,
  specialty: generalSpecialty.name,
  visitType: "Consulta general",
  dateLabel: "15/03/2026",
  dateSummaryLabel: "15 Mar 2026",
  timeLabel: "10:30 AM",
};

export const mockWorklistDateLabel = "15 May 2026";

export const mockVisits: VisitMock[] = [
  {
    id: "visit-abraham-2026-03-15",
    patient: abrahamPatient,
    clinic: clinicMatriz,
    attendingDentist: drLuis,
    specialty: generalSpecialty,
    visitType: { code: "general-consult", label: "Consulta general" },
    reasonForVisit: "Dolor en molar superior derecho",
    chiefComplaint: "Sensibilidad al frío",
    clinicalNotes:
      "Paciente refiere dolor intermitente en molar superior derecho, principalmente al ingerir bebidas frías. " +
      "No refiere dolor espontáneo ni nocturno. Se observa higiene oral aceptable. No hay signos de infección aguda. " +
      "Se explica diagnóstico y plan de tratamiento al paciente, quien acepta el plan propuesto.",
    diagnosisNotes: "Caries incipiente en OD 16",
    proceduresSummary: "Valoración, limpieza preventiva y plan de tratamiento",
    startedAt: "2026-03-15T10:00:00-06:00",
    endedAt: "2026-03-15T10:40:00-06:00",
    status: "completed",
    createdAt: "2026-03-15T09:45:00-06:00",
    updatedAt: "2026-03-15T11:05:00-06:00",
    createdByUser: "Ana Martínez",
    updatedByUser: "Ana Martínez",
    related: {
      conditionsCount: 2,
      conditions: ["Bruxismo sospechado", "Hipertensión arterial controlada"],
      attachmentsCount: 2,
      attachments: [
        { name: "RX inicial 16", extension: "JPG", size: "1.2 MB" },
        { name: "Fotografía intraoral", extension: "JPG", size: "0.8 MB" },
      ],
      hasOdontogramSnapshot: true,
      odontogramLabel: "Snapshot v3 disponible",
      odontogramTeeth: ["16"],
      paymentStatus: "recorded",
      paymentAmount: "$850 MXN",
      paymentLabel: "15 Mar 2026, 11:05 AM",
    },
    timeline: [
      { time: "10:00 AM", label: "Inicio de la visita", by: "Ana Martínez" },
      { time: "10:05 AM", label: "Historia clínica y motivo de consulta", by: "Ana Martínez" },
      { time: "10:20 AM", label: "Evaluación y diagnóstico", by: "Dr. Luis Hernández" },
      { time: "10:35 AM", label: "Procedimientos realizados", by: "Dr. Luis Hernández" },
      { time: "10:40 AM", label: "Cierre de la visita", by: "Ana Martínez" },
    ],
  },
  {
    id: "visit-abraham-2026-02-20",
    patient: abrahamPatient,
    clinic: clinicMatriz,
    attendingDentist: draSofia,
    specialty: generalSpecialty,
    visitType: { code: "follow-up", label: "Seguimiento" },
    reasonForVisit: "Revisión de sensibilidad dental",
    chiefComplaint: "Molestia al consumir alimentos fríos.",
    clinicalNotes:
      "Se mantiene la sensibilidad localizada en cuadrante inferior derecho. Sin progresión clínica visible al momento.",
    startedAt: "2026-02-20T16:15:00-06:00",
    status: "open",
    createdAt: "2026-02-20T16:00:00-06:00",
    updatedAt: "2026-02-20T16:25:00-06:00",
    createdByUser: "Ana Martínez",
    updatedByUser: "Dra. Sofía Ramírez",
    related: {
      conditionsCount: 0,
      conditions: [],
      attachmentsCount: 1,
      attachments: [{ name: "Foto control sensibilidad", extension: "JPG", size: "0.5 MB" }],
      hasOdontogramSnapshot: false,
      paymentStatus: "pending",
      paymentAmount: "$0 MXN",
      paymentLabel: "Pendiente de registro",
    },
    timeline: [
      { time: "04:15 PM", label: "Inicio de la visita", by: "Ana Martínez" },
      { time: "04:20 PM", label: "Actualización del motivo de consulta", by: "Dra. Sofía Ramírez" },
    ],
  },
  {
    id: "visit-abraham-2026-01-04",
    patient: abrahamPatient,
    clinic: clinicSatelite,
    attendingDentist: drCarlos,
    specialty: generalSpecialty,
    visitType: { code: "first-time", label: "Primera vez" },
    reasonForVisit: "Evaluación inicial",
    chiefComplaint: "Sin molestias; solicita valoración de primera vez.",
    startedAt: "2026-01-04T11:00:00-06:00",
    status: "cancelled",
    createdAt: "2026-01-04T10:20:00-06:00",
    updatedAt: "2026-01-04T10:45:00-06:00",
    createdByUser: "Ana Martínez",
    updatedByUser: "Ana Martínez",
    related: {
      conditionsCount: 0,
      conditions: [],
      attachmentsCount: 0,
      attachments: [],
      hasOdontogramSnapshot: false,
      paymentStatus: "voided",
      paymentAmount: "$0 MXN",
      paymentLabel: "Sin cargo",
    },
    timeline: [
      { time: "10:20 AM", label: "Registro de la visita", by: "Ana Martínez" },
      { time: "10:45 AM", label: "Cancelación por reprogramación del paciente", by: "Ana Martínez" },
    ],
  },
  {
    id: "visit-abraham-2026-03-01",
    patient: abrahamPatient,
    clinic: clinicMatriz,
    attendingDentist: drLuis,
    specialty: generalSpecialty,
    visitType: { code: "cleaning", label: "Limpieza dental" },
    reasonForVisit: "Limpieza preventiva semestral",
    chiefComplaint: "Desea control preventivo.",
    clinicalNotes: "Sin hallazgos relevantes. Encías con respuesta adecuada.",
    diagnosisNotes: "Placa leve en arcada superior",
    proceduresSummary: "Limpieza preventiva y control de higiene oral",
    startedAt: "2026-03-01T09:00:00-06:00",
    endedAt: "2026-03-01T09:35:00-06:00",
    status: "completed",
    createdAt: "2026-03-01T08:45:00-06:00",
    updatedAt: "2026-03-01T09:40:00-06:00",
    createdByUser: "Ana Martínez",
    updatedByUser: "Dr. Luis Hernández",
    related: {
      conditionsCount: 1,
      conditions: ["Hipertensión arterial controlada"],
      attachmentsCount: 0,
      attachments: [],
      hasOdontogramSnapshot: true,
      odontogramLabel: "Snapshot v2 disponible",
      odontogramTeeth: ["11", "16"],
      paymentStatus: "paid",
      paymentAmount: "$650 MXN",
      paymentLabel: "Pagado en caja",
    },
    timeline: [
      { time: "09:00 AM", label: "Inicio de la visita", by: "Ana Martínez" },
      { time: "09:20 AM", label: "Limpieza preventiva", by: "Dr. Luis Hernández" },
      { time: "09:35 AM", label: "Cierre de la visita", by: "Ana Martínez" },
    ],
  },
  {
    id: "visit-abraham-2026-02-02",
    patient: abrahamPatient,
    clinic: clinicSatelite,
    attendingDentist: draSofia,
    specialty: generalSpecialty,
    visitType: { code: "control", label: "Control" },
    reasonForVisit: "Control posterior a sensibilidad",
    chiefComplaint: "Molestia leve al cepillado.",
    clinicalNotes: "Se refuerzan medidas de higiene y pasta desensibilizante.",
    diagnosisNotes: "Sensibilidad dental controlada",
    proceduresSummary: "Evaluación clínica y ajuste de indicaciones",
    startedAt: "2026-02-02T12:15:00-06:00",
    endedAt: "2026-02-02T12:40:00-06:00",
    status: "completed",
    createdAt: "2026-02-02T11:55:00-06:00",
    updatedAt: "2026-02-02T12:45:00-06:00",
    createdByUser: "Ana Martínez",
    updatedByUser: "Dra. Sofía Ramírez",
    related: {
      conditionsCount: 0,
      conditions: [],
      attachmentsCount: 1,
      attachments: [{ name: "Nota de seguimiento", extension: "PDF", size: "0.2 MB" }],
      hasOdontogramSnapshot: false,
      paymentStatus: "paid",
      paymentAmount: "$400 MXN",
      paymentLabel: "Pagado con tarjeta",
    },
    timeline: [
      { time: "12:15 PM", label: "Inicio de la visita", by: "Ana Martínez" },
      { time: "12:25 PM", label: "Evaluación de seguimiento", by: "Dra. Sofía Ramírez" },
      { time: "12:40 PM", label: "Cierre de la visita", by: "Ana Martínez" },
    ],
  },
  {
    id: "visit-abraham-2026-01-22",
    patient: abrahamPatient,
    clinic: clinicMatriz,
    attendingDentist: drLuis,
    specialty: generalSpecialty,
    visitType: { code: "general-review", label: "Consulta general" },
    reasonForVisit: "Revisión general",
    chiefComplaint: "Molestia intermitente en molar superior derecho.",
    clinicalNotes: "Se identifica zona incipiente de caries y se agenda control.",
    diagnosisNotes: "Caries incipiente en OD 16",
    proceduresSummary: "Valoración clínica y recomendaciones",
    startedAt: "2026-01-22T10:20:00-06:00",
    endedAt: "2026-01-22T10:55:00-06:00",
    status: "completed",
    createdAt: "2026-01-22T10:00:00-06:00",
    updatedAt: "2026-01-22T11:05:00-06:00",
    createdByUser: "Ana Martínez",
    updatedByUser: "Dr. Luis Hernández",
    related: {
      conditionsCount: 1,
      conditions: ["Bruxismo sospechado"],
      attachmentsCount: 0,
      attachments: [],
      hasOdontogramSnapshot: true,
      odontogramLabel: "Snapshot v1 disponible",
      odontogramTeeth: ["16"],
      paymentStatus: "paid",
      paymentAmount: "$550 MXN",
      paymentLabel: "Pago registrado",
    },
    timeline: [
      { time: "10:20 AM", label: "Inicio de la visita", by: "Ana Martínez" },
      { time: "10:40 AM", label: "Evaluación y recomendaciones", by: "Dr. Luis Hernández" },
      { time: "10:55 AM", label: "Cierre de la visita", by: "Ana Martínez" },
    ],
  },
  {
    id: "visit-abraham-2026-01-15",
    patient: abrahamPatient,
    clinic: clinicMatriz,
    attendingDentist: drLuis,
    specialty: generalSpecialty,
    visitType: { code: "preventive-control", label: "Control preventivo" },
    reasonForVisit: "Control posterior a primera valoración",
    chiefComplaint: "Sin molestias agudas.",
    clinicalNotes: "Se mantiene seguimiento preventivo.",
    diagnosisNotes: "Sin progresión clínica",
    proceduresSummary: "Revisión clínica breve",
    startedAt: "2026-01-15T08:40:00-06:00",
    endedAt: "2026-01-15T09:05:00-06:00",
    status: "completed",
    createdAt: "2026-01-15T08:20:00-06:00",
    updatedAt: "2026-01-15T09:10:00-06:00",
    createdByUser: "Ana Martínez",
    updatedByUser: "Dr. Luis Hernández",
    related: {
      conditionsCount: 0,
      conditions: [],
      attachmentsCount: 0,
      attachments: [],
      hasOdontogramSnapshot: false,
      paymentStatus: "paid",
      paymentAmount: "$350 MXN",
      paymentLabel: "Pagado",
    },
    timeline: [
      { time: "08:40 AM", label: "Inicio de la visita", by: "Ana Martínez" },
      { time: "09:05 AM", label: "Cierre de la visita", by: "Ana Martínez" },
    ],
  },
  {
    id: "visit-abraham-2026-01-08",
    patient: abrahamPatient,
    clinic: clinicSatelite,
    attendingDentist: drCarlos,
    specialty: generalSpecialty,
    visitType: { code: "orientation", label: "Valoración inicial" },
    reasonForVisit: "Seguimiento de evaluación inicial",
    chiefComplaint: "Solicita plan preventivo.",
    clinicalNotes: "Se revisa evolución posterior a consulta de primera vez.",
    diagnosisNotes: "Sin hallazgos de alarma",
    proceduresSummary: "Orientación preventiva y educación en higiene",
    startedAt: "2026-01-08T13:10:00-06:00",
    endedAt: "2026-01-08T13:40:00-06:00",
    status: "completed",
    createdAt: "2026-01-08T12:45:00-06:00",
    updatedAt: "2026-01-08T13:45:00-06:00",
    createdByUser: "Ana Martínez",
    updatedByUser: "Dr. Carlos Méndez",
    related: {
      conditionsCount: 0,
      conditions: [],
      attachmentsCount: 1,
      attachments: [{ name: "Consentimiento informado", extension: "PDF", size: "0.3 MB" }],
      hasOdontogramSnapshot: false,
      paymentStatus: "paid",
      paymentAmount: "$300 MXN",
      paymentLabel: "Pagado",
    },
    timeline: [
      { time: "01:10 PM", label: "Inicio de la visita", by: "Ana Martínez" },
      { time: "01:25 PM", label: "Educación y orientación preventiva", by: "Dr. Carlos Méndez" },
      { time: "01:40 PM", label: "Cierre de la visita", by: "Ana Martínez" },
    ],
  },
  {
    id: "visit-maria-2026-05-15",
    patient: mariaPatient,
    clinic: clinicMatriz,
    attendingDentist: drLuis,
    specialty: generalSpecialty,
    visitType: { code: "first-time", label: "Primera vez" },
    reasonForVisit: "Revisión general",
    chiefComplaint: "Molestia en muela inferior derecha al masticar.",
    clinicalNotes: "Paciente estable. Se identifica área de desgaste y caries temprana.",
    diagnosisNotes: "Caries incipiente en OD 46.",
    proceduresSummary: "Valoración y limpieza preventiva.",
    startedAt: "2026-05-15T10:00:00-06:00",
    status: "open",
    createdAt: "2026-05-15T09:45:00-06:00",
    updatedAt: "2026-05-15T09:45:00-06:00",
    createdByUser: "Ana Martínez",
    updatedByUser: "Ana Martínez",
    related: {
      conditionsCount: 1,
      conditions: ["Caries temprana en cuadrante inferior derecho"],
      attachmentsCount: 2,
      attachments: [
        { name: "RX posterior derecha", extension: "JPG", size: "1.1 MB" },
        { name: "Foto oclusal", extension: "JPG", size: "0.7 MB" },
      ],
      hasOdontogramSnapshot: true,
      odontogramLabel: "Mini preview disponible",
      odontogramTeeth: ["46"],
      paymentStatus: "paid",
      paymentAmount: "$650.00 MXN",
      paymentLabel: "Pagado",
    },
    timeline: [
      { time: "10:00 AM", label: "Inicio de la visita", by: "Ana Martínez" },
      { time: "10:10 AM", label: "Exploración clínica inicial", by: "Dr. Luis Hernández" },
    ],
  },
  {
    id: "visit-carlos-2026-05-15",
    patient: carlosPatient,
    clinic: clinicSatelite,
    attendingDentist: draSofia,
    specialty: generalSpecialty,
    visitType: { code: "follow-up", label: "Seguimiento" },
    reasonForVisit: "Seguimiento post limpieza",
    chiefComplaint: "Sin molestias.",
    clinicalNotes: "Seguimiento sin hallazgos adicionales.",
    diagnosisNotes: "Sin progresión clínica",
    proceduresSummary: "Control y refuerzo de higiene oral.",
    startedAt: "2026-05-15T11:30:00-06:00",
    endedAt: "2026-05-15T11:55:00-06:00",
    status: "completed",
    createdAt: "2026-05-15T11:05:00-06:00",
    updatedAt: "2026-05-15T12:00:00-06:00",
    createdByUser: "Ana Martínez",
    updatedByUser: "Dra. Sofía Ramírez",
    related: {
      conditionsCount: 0,
      conditions: [],
      attachmentsCount: 0,
      attachments: [],
      hasOdontogramSnapshot: false,
      paymentStatus: "paid",
      paymentAmount: "$480.00 MXN",
      paymentLabel: "Pagado",
    },
    timeline: [
      { time: "11:30 AM", label: "Inicio de la visita", by: "Ana Martínez" },
      { time: "11:55 AM", label: "Cierre de la visita", by: "Dra. Sofía Ramírez" },
    ],
  },
  {
    id: "visit-ana-2026-05-15",
    patient: anaPatient,
    clinic: clinicMatriz,
    attendingDentist: drLuis,
    specialty: generalSpecialty,
    visitType: { code: "urgent", label: "Urgencia" },
    reasonForVisit: "Dolor agudo en pieza posterior",
    chiefComplaint: "Dolor al masticar desde la mañana.",
    startedAt: "2026-05-15T12:00:00-06:00",
    status: "draft",
    createdAt: "2026-05-15T11:50:00-06:00",
    updatedAt: "2026-05-15T11:50:00-06:00",
    createdByUser: "Ana Martínez",
    updatedByUser: "Ana Martínez",
    related: {
      conditionsCount: 0,
      conditions: [],
      attachmentsCount: 0,
      attachments: [],
      hasOdontogramSnapshot: false,
    },
    timeline: [{ time: "11:50 AM", label: "Borrador de visita creado", by: "Ana Martínez" }],
  },
  {
    id: "visit-jose-2026-05-15",
    patient: josePatient,
    clinic: clinicMatriz,
    attendingDentist: draElena,
    specialty: generalSpecialty,
    visitType: { code: "control", label: "Control" },
    reasonForVisit: "Control posterior a restauración",
    chiefComplaint: "No asiste a la revisión.",
    startedAt: "2026-05-15T13:30:00-06:00",
    status: "cancelled",
    createdAt: "2026-05-15T13:00:00-06:00",
    updatedAt: "2026-05-15T13:15:00-06:00",
    createdByUser: "Ana Martínez",
    updatedByUser: "Ana Martínez",
    related: {
      conditionsCount: 0,
      conditions: [],
      attachmentsCount: 0,
      attachments: [],
      hasOdontogramSnapshot: false,
    },
    timeline: [
      { time: "01:00 PM", label: "Visita registrada", by: "Ana Martínez" },
      { time: "01:15 PM", label: "Cancelación por ausencia del paciente", by: "Ana Martínez" },
    ],
  },
  {
    id: "visit-voided-2026-04-30",
    patient: mariaPatient,
    clinic: clinicSatelite,
    attendingDentist: draSofia,
    specialty: generalSpecialty,
    visitType: { code: "follow-up", label: "Seguimiento" },
    reasonForVisit: "Registro anulado por duplicidad",
    chiefComplaint: "Sin captura clínica válida.",
    startedAt: "2026-04-30T15:00:00-06:00",
    status: "voided",
    createdAt: "2026-04-30T14:45:00-06:00",
    updatedAt: "2026-04-30T14:55:00-06:00",
    createdByUser: "Ana Martínez",
    updatedByUser: "Ana Martínez",
    related: {
      conditionsCount: 0,
      conditions: [],
      attachmentsCount: 0,
      attachments: [],
      hasOdontogramSnapshot: false,
      paymentStatus: "voided",
      paymentAmount: "$0 MXN",
      paymentLabel: "Sin afectación financiera",
    },
    timeline: [
      { time: "02:45 PM", label: "Registro duplicado detectado", by: "Ana Martínez" },
      { time: "02:55 PM", label: "Visita anulada", by: "Ana Martínez" },
    ],
  },
];

export const mockPatientVisits = mockVisits.filter((visit) => visit.patient.id === abrahamPatient.id);

export const mockGlobalWorklistVisits = mockVisits.filter((visit) =>
  ["visit-maria-2026-05-15", "visit-carlos-2026-05-15", "visit-ana-2026-05-15", "visit-jose-2026-05-15"].includes(
    visit.id,
  ),
);

export function getVisitById(id?: string | null) {
  return mockVisits.find((visit) => visit.id === id);
}

export function canOpenPatientProfile(visit: VisitMock) {
  return visit.patient.id === abrahamPatient.id;
}
