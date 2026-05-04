import { useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import {
  ChevronRight,
  Grid3x3,
  Paperclip,
  PencilLine,
  ShieldAlert,
  Stethoscope,
} from "lucide-react";
import { PatientMedicalHistory } from "../components/patient/PatientMedicalHistory";
import { PatientMedications } from "../components/patient/PatientMedications";
import { buildPatientRecordVisualBundle } from "../components/patient/patient-record.presenter";
import { sexLabels } from "../components/patient/types";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useBooking } from "../features/booking/BookingContext";
import {
  getPatientAge,
  getPatientFullName,
  getPatientInitials,
} from "../features/booking/bookingUtils";

type PatientTab =
  | "historia-clinica"
  | "medicamentos"
  | "odontograma"
  | "adjuntos";

function normalizePatientTab(value: string | null): PatientTab {
  switch (value) {
    case "medicamentos":
    case "odontograma":
    case "adjuntos":
      return value;
    case "citas":
    case "visitas":
    case "resumen":
    case "expediente":
    case "historia":
    case "historia-clinica":
    case "resumen-clinico":
    case "condiciones":
    case "pagos":
    default:
      return "historia-clinica";
  }
}

const patientStatusLabels = {
  active: "Activo",
  inactive: "Inactivo",
  archived: "Archivado",
} as const;

const recordStatusLabels = {
  open: "Abierto",
  archived: "Archivado",
} as const;

function HeaderMetric({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border px-4 py-3 ${
        accent
          ? "border-teal-200 bg-teal-50/80"
          : "border-slate-200 bg-slate-50/70"
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p
        className={`mt-2 text-sm font-medium ${
          accent ? "text-[#0F5F6D]" : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export function PatientDetail() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { clinicalRecords, patients } = useBooking();

  const activeTab = normalizePatientTab(searchParams.get("tab"));
  const patient = patients.find((item) => item.id === id) ?? null;
  const record = clinicalRecords.find((item) => item.patientId === id) ?? null;

  const visualBundle = useMemo(
    () => buildPatientRecordVisualBundle(patient, record),
    [patient, record],
  );

  const tabTriggerClass =
    "rounded-none border-b-2 border-transparent bg-transparent px-4 py-3 text-sm font-medium " +
    "text-slate-500 transition-colors hover:text-slate-700 data-[state=active]:border-[#0F5F6D] " +
    "data-[state=active]:font-semibold data-[state=active]:text-[#0F5F6D] data-[state=active]:shadow-none";

  const handleTabChange = (nextTab: string) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("tab", normalizePatientTab(nextTab));
    setSearchParams(nextParams, { replace: true });
  };

  if (!patient) {
    return (
      <div className="p-8">
        <Card className="rounded-3xl border-slate-200 p-8">
          <p className="text-lg font-semibold text-slate-900">
            Paciente no encontrado
          </p>
          <p className="mt-2 text-sm text-slate-500">
            El paciente solicitado no existe dentro del mock cargado.
          </p>
          <Button
            className="mt-4 rounded-xl"
            onClick={() => navigate("/pacientes")}
          >
            Volver a pacientes
          </Button>
        </Card>
      </div>
    );
  }

  const age = getPatientAge(patient.birthDate);
  const patientStatus =
    patientStatusLabels[patient.status] ?? patient.status;
  const recordStatus = record
    ? recordStatusLabels[record.status] ?? record.status
    : "Sin expediente";

  return (
    <div className="min-h-full bg-[#f4f7f7] p-6 md:p-8">
      <div className="mx-auto max-w-[1400px] space-y-6">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <button
            type="button"
            onClick={() => navigate("/pacientes")}
            className="hover:text-[#0F5F6D]"
          >
            Pacientes
          </button>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-slate-900">
            {getPatientFullName(patient)}
          </span>
        </div>

        <div className="rounded-[30px] border border-slate-200 bg-white px-6 py-6 shadow-sm">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-[#0F5F6D] text-lg font-semibold text-white">
                  {getPatientInitials(patient)}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-semibold text-slate-950">
                      {getPatientFullName(patient)}
                    </h1>
                    <Badge className="rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700">
                      {patientStatus}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {visualBundle.patient.code}{" "}
                    <span className="mx-2 text-slate-300">/</span>
                    {recordStatus}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                <HeaderMetric
                  label="Edad"
                  value={age ? `${age} anos` : "No capturada"}
                />
                <HeaderMetric
                  label="Sexo"
                  value={sexLabels[visualBundle.patient.sex]}
                />
                <HeaderMetric
                  label="Tipo de sangre"
                  value={visualBundle.patient.bloodType}
                  accent
                />
                <HeaderMetric
                  label="Expediente"
                  value={visualBundle.patient.recordNumber || "Sin expediente"}
                />
                <HeaderMetric
                  label="Telefono"
                  value={patient.phone || "Sin telefono"}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() =>
                  navigate(`/pacientes/${patient.id}/historia-clinica/editar`)
                }
              >
                <PencilLine className="mr-2 h-4 w-4" />
                Editar
              </Button>
              <Button
                className="rounded-xl bg-[#0F5F6D] hover:bg-[#0d4f5a]"
                onClick={() => navigate(`/visitas/nueva?patientId=${patient.id}`)}
              >
                Registrar visita
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white">
            <TabsList className="h-auto w-max min-w-full justify-start gap-0 rounded-none border-b border-slate-200 bg-transparent px-2 py-0">
              <TabsTrigger value="historia-clinica" className={tabTriggerClass}>
                Historia clinica
              </TabsTrigger>
              <TabsTrigger value="medicamentos" className={tabTriggerClass}>
                Medicamentos
              </TabsTrigger>
              <TabsTrigger value="odontograma" className={tabTriggerClass}>
                Odontograma
              </TabsTrigger>
              <TabsTrigger value="adjuntos" className={tabTriggerClass}>
                Adjuntos
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="historia-clinica" className="mt-5">
            <div className="space-y-5">
              {record?.status === "archived" ? (
                <Card className="rounded-3xl border-amber-200 bg-amber-50 p-5">
                  <div className="flex items-start gap-3">
                    <ShieldAlert className="mt-0.5 h-5 w-5 text-amber-700" />
                    <div>
                      <p className="font-semibold text-amber-950">
                        Expediente archivado
                      </p>
                      <p className="mt-1 text-sm text-amber-900">
                        La vista se mantiene disponible para consulta, pero este
                        expediente sigue marcado como archivado dentro del mock.
                      </p>
                    </div>
                  </div>
                </Card>
              ) : null}

              <PatientMedicalHistory
                patient={visualBundle.patient}
                conditions={visualBundle.conditions}
                medications={visualBundle.medications}
              />
            </div>
          </TabsContent>

          <TabsContent value="medicamentos" className="mt-5">
            <PatientMedications initialMedications={visualBundle.medications} />
          </TabsContent>

          <TabsContent value="odontograma" className="mt-5">
            <Card className="rounded-3xl border-slate-200 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-[#0F5F6D]">
                  <Grid3x3 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Odontograma
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm leading-7 text-slate-600">
                    Esta tab conserva el espacio del odontograma dentro del
                    expediente sin mezclarlo con el resumen clinico ni con las
                    condiciones estructuradas.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="adjuntos" className="mt-5">
            <Card className="rounded-3xl border-slate-200 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                  <Paperclip className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Adjuntos
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm leading-7 text-slate-600">
                    Radiografias, consentimientos y documentos se mantienen como
                    una superficie visual reservada para integracion futura.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
