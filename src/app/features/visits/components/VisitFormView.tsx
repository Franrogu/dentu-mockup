import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Clock3,
  DollarSign,
  FileImage,
  Grid3x3,
  Search,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Textarea } from "../../../components/ui/textarea";
import { cn } from "../../../components/ui/utils";
import { mockPatient } from "../../../components/patient/patient-record.mock";
import { mockVisitFormDefaults, type VisitMock } from "../visits.mock";

function FieldLabel({ children }: { children: ReactNode }) {
  return <label className="mb-2 block text-sm font-medium text-gray-700">{children}</label>;
}

function SelectLikeField({
  value,
  placeholder,
  icon: Icon,
  searchable = false,
}: {
  value?: string;
  placeholder?: string;
  icon?: LucideIcon;
  searchable?: boolean;
}) {
  return (
    <div className="flex h-11 items-center justify-between rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700">
      <div className="flex min-w-0 items-center gap-2">
        {Icon ? <Icon className="h-4 w-4 text-gray-400" /> : null}
        <span className={cn("truncate", value ? "text-gray-800" : "text-gray-400")}>
          {value || placeholder}
        </span>
      </div>
      {searchable ? <Search className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
    </div>
  );
}

function ActionTile({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <button
      type="button"
      className="rounded-2xl border border-gray-200 bg-white p-4 text-left transition-colors hover:border-[#0F5F6D]/40 hover:bg-teal-50/40"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-[#0F5F6D]">
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-3 font-medium text-gray-900">{title}</p>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </button>
  );
}

export function VisitFormView({
  mode,
  visit,
  fromPatientContext,
  patientRouteId,
}: {
  mode: "new" | "edit";
  visit?: VisitMock;
  fromPatientContext: boolean;
  patientRouteId: string;
}) {
  const navigate = useNavigate();
  const isEdit = mode === "edit";
  const backTarget = fromPatientContext
    ? `/pacientes/${patientRouteId}?tab=historia-clinica`
    : "/visitas";

  const patientDisplayName = visit?.patient.fullName || mockPatient.fullName;
  const visitReason = visit?.reasonForVisit || "";
  const chiefComplaint = visit?.chiefComplaint || "";
  const clinicalNotes = visit?.clinicalNotes || "";
  const diagnosisNotes = visit?.diagnosisNotes || "";
  const proceduresSummary = visit?.proceduresSummary || "";

  return (
    <div className="p-8 space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white px-6 py-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
              <button onClick={() => navigate("/visitas")} className="transition-colors hover:text-[#0F5F6D]">
                Visitas
              </button>
              <ChevronRight className="h-4 w-4" />
              <span className="font-medium text-gray-900">{isEdit ? "Editar visita" : "Nueva visita"}</span>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">{isEdit ? "Editar visita" : "Registrar visita"}</h1>
            <p className="mt-1 text-sm text-gray-500">
              {isEdit
                ? "Actualiza la información clínica y operativa de la visita."
                : "Completa la información de la visita para iniciar la atención."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => navigate(backTarget)}>
              Cancelar
            </Button>
            <Button variant="outline" className="rounded-xl">
              Guardar borrador
            </Button>
            <Button className="rounded-xl bg-[#0F5F6D] hover:bg-[#0d4f5a]">
              {isEdit ? "Actualizar visita" : "Iniciar visita"}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <Card className="rounded-2xl border-gray-200 p-6">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-gray-900">Paciente y atención</h2>
              <p className="mt-1 text-sm text-gray-500">Datos base de la visita para iniciar la atención clínica.</p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <FieldLabel>Paciente *</FieldLabel>
                <SelectLikeField
                  value={patientDisplayName}
                  placeholder="Selecciona un paciente"
                  icon={fromPatientContext ? UserRound : Search}
                  searchable={!fromPatientContext}
                />
              </div>

              <div>
                <FieldLabel>Clínica *</FieldLabel>
                <SelectLikeField value={visit?.clinic.name || mockVisitFormDefaults.clinic} />
              </div>

              <div>
                <FieldLabel>Dentista tratante *</FieldLabel>
                <SelectLikeField value={visit?.attendingDentist.name || mockVisitFormDefaults.attendingDentist} />
              </div>

              <div>
                <FieldLabel>Especialidad</FieldLabel>
                <SelectLikeField value={visit?.specialty.name || mockVisitFormDefaults.specialty} />
              </div>

              <div>
                <FieldLabel>Tipo de visita *</FieldLabel>
                <SelectLikeField value={visit?.visitType.label || mockVisitFormDefaults.visitType} />
              </div>

              <div>
                <FieldLabel>Fecha *</FieldLabel>
                <SelectLikeField value={mockVisitFormDefaults.dateLabel} icon={CalendarDays} />
              </div>

              <div>
                <FieldLabel>Hora de inicio *</FieldLabel>
                <SelectLikeField value={mockVisitFormDefaults.timeLabel} icon={Clock3} />
              </div>
            </div>
          </Card>

          <Card className="rounded-2xl border-gray-200 p-6">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-gray-900">Motivo de consulta</h2>
              <p className="mt-1 text-sm text-gray-500">Captura breve para arrancar la atención sin sobrecargar el formulario.</p>
            </div>

            <div className="grid gap-5">
              <div>
                <FieldLabel>Motivo de consulta *</FieldLabel>
                <Textarea
                  defaultValue={visitReason}
                  placeholder="Selecciona el motivo de consulta"
                  rows={3}
                  className="rounded-2xl"
                />
              </div>
              <div>
                <FieldLabel>Queja principal *</FieldLabel>
                <Textarea
                  defaultValue={chiefComplaint}
                  placeholder="Describe la queja principal del paciente"
                  rows={3}
                  className="rounded-2xl"
                />
              </div>
            </div>
          </Card>

          <Card className="rounded-2xl border-gray-200 p-6">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-gray-900">Notas de la visita</h2>
              <p className="mt-1 text-sm text-gray-500">Campos clínicos de captura libre para el mock visual.</p>
            </div>

            <div className="grid gap-5">
              <div>
                <FieldLabel>Notas clínicas</FieldLabel>
                <Textarea
                  defaultValue={clinicalNotes}
                  placeholder="Observaciones clínicas relevantes..."
                  rows={5}
                  className="rounded-2xl"
                />
              </div>
              <div>
                <FieldLabel>Diagnóstico</FieldLabel>
                <Textarea
                  defaultValue={diagnosisNotes}
                  placeholder="Diagnóstico o impresión clínica..."
                  rows={4}
                  className="rounded-2xl"
                />
              </div>
              <div>
                <FieldLabel>Procedimientos realizados</FieldLabel>
                <Textarea
                  defaultValue={proceduresSummary}
                  placeholder="Procedimientos realizados durante la visita..."
                  rows={4}
                  className="rounded-2xl"
                />
              </div>
            </div>
          </Card>

          <Card className="rounded-2xl border-gray-200 p-6">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-gray-900">Elementos relacionados</h2>
              <p className="mt-1 text-sm text-gray-500">Accesos rápidos a relaciones de la visita sin integraciones reales.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <ActionTile title="Gestionar condiciones" description="Ver y actualizar condiciones" icon={ShieldCheck} />
              <ActionTile title="Adjuntar archivos" description="Sube imágenes o documentos" icon={FileImage} />
              <ActionTile title="Vincular odontograma" description="Selecciona un snapshot" icon={Grid3x3} />
              <ActionTile title="Registrar pago" description="Registrar o consultar pago" icon={DollarSign} />
            </div>
          </Card>
        </div>

        <div className="xl:sticky xl:top-8 xl:self-start">
          <Card className="rounded-2xl border-gray-200 p-6">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-gray-900">Resumen de la visita</h2>
              <p className="mt-1 text-sm text-gray-500">Vista rápida del contexto clínico y operativo antes de iniciar.</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0F5F6D] text-sm font-semibold text-white">
                  AR
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-gray-900">{mockPatient.fullName}</p>
                    <Badge className="border border-emerald-200 bg-emerald-50 text-emerald-700">Activo</Badge>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">22 años · Masculino</p>
                  <p className="mt-1 text-sm text-gray-500">{mockPatient.recordNumber}</p>
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="rounded-2xl border border-gray-200 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Clínica</p>
                <p className="mt-2 text-sm text-gray-800">{visit?.clinic.name || mockVisitFormDefaults.clinic}</p>
              </div>
              <div className="rounded-2xl border border-gray-200 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Dentista tratante</p>
                <p className="mt-2 text-sm text-gray-800">{visit?.attendingDentist.name || mockVisitFormDefaults.attendingDentist}</p>
              </div>
              <div className="rounded-2xl border border-gray-200 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Especialidad</p>
                <p className="mt-2 text-sm text-gray-800">{visit?.specialty.name || mockVisitFormDefaults.specialty}</p>
              </div>
              <div className="rounded-2xl border border-gray-200 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Tipo de visita</p>
                <p className="mt-2 text-sm text-gray-800">{visit?.visitType.label || mockVisitFormDefaults.visitType}</p>
              </div>
              <div className="rounded-2xl border border-gray-200 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Fecha y hora</p>
                <p className="mt-2 text-sm text-gray-800">
                  {mockVisitFormDefaults.dateSummaryLabel} · {mockVisitFormDefaults.timeLabel}
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Estado</p>
                <p className="mt-2 text-sm font-medium text-gray-800">{isEdit ? "Abierta" : "Borrador"}</p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-teal-200 bg-teal-50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#0F5F6D]">
                  <Stethoscope className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-teal-900">Antes de iniciar la visita</p>
                  <ul className="mt-3 space-y-2 text-sm text-teal-900">
                    <li>Verifica los datos del paciente y la cita.</li>
                    <li>Revisa condiciones médicas relevantes.</li>
                    <li>Adjunta archivos o radiografías si aplica.</li>
                    <li>Asegúrate de tener el odontograma actualizado.</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
