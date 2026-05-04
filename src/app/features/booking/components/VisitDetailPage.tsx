import { useMemo } from "react";
import { useNavigate } from "react-router";
import { ChevronRight, ClipboardList, FileCheck2, FolderOpen, Stethoscope, UserRound } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { useBooking } from "../BookingContext";
import { formatDate, formatTimeRange, getPatientFullName } from "../bookingUtils";

export function VisitDetailPage({ visitId }: { visitId: string | undefined }) {
  const navigate = useNavigate();
  const { appointments, clinicalRecords, clinics, patients, specialties, users, visitTypes, visits } = useBooking();

  const visit = useMemo(() => visits.find((item) => item.id === visitId) ?? null, [visitId, visits]);

  const patient = patients.find((item) => item.id === visit?.patientId) ?? null;
  const clinic = clinics.find((item) => item.id === visit?.clinicId) ?? null;
  const dentist = users.find((item) => item.id === visit?.attendingUserId) ?? null;
  const specialty = specialties.find((item) => item.id === visit?.specialtyId) ?? null;
  const visitType = visitTypes.find((item) => item.id === visit?.visitTypeId) ?? null;
  const record = clinicalRecords.find((item) => item.id === visit?.clinicalRecordId) ?? null;
  const sourceAppointment = appointments.find((item) => item.visitId === visit?.id) ?? null;

  if (!visit || !patient) {
    return (
      <div className="p-8">
        <Card className="rounded-3xl border-slate-200 p-8">
          <p className="text-lg font-semibold text-slate-900">Visita no encontrada</p>
          <p className="mt-2 text-sm text-slate-500">La visita solicitada no existe dentro del mock de agenda.</p>
          <Button className="mt-4 rounded-xl" onClick={() => navigate("/visitas")}>
            Volver a visitas
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#f4f7f7] p-6 md:p-8">
      <div className="mx-auto max-w-[1120px] space-y-6">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <button type="button" onClick={() => navigate("/visitas")} className="hover:text-[#0F5F6D]">
            Visitas
          </button>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-900">Detalle de visita</span>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white px-6 py-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-semibold text-slate-950">Visita de {getPatientFullName(patient)}</h1>
                <Badge variant="outline" className="rounded-full border-slate-200 bg-slate-50 text-slate-600">
                  {visit.status}
                </Badge>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                {formatDate(visit.startedAt)} · {formatTimeRange(visit.startedAt, visit.endedAt || visit.startedAt)}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {sourceAppointment ? (
                <Button variant="outline" className="rounded-xl" onClick={() => navigate(`/agenda`)}>
                  Ver cita origen
                </Button>
              ) : null}
              <Button className="rounded-xl bg-[#0F5F6D] hover:bg-[#0d4f5a]" onClick={() => navigate(`/pacientes/${patient.id}?tab=visitas`)}>
                Ver paciente
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <Card className="rounded-3xl border-slate-200 p-5">
              <div className="flex items-center gap-2">
                <UserRound className="h-4 w-4 text-slate-400" />
                <h2 className="text-base font-semibold text-slate-900">Paciente</h2>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <p className="text-sm text-slate-600">
                  <span className="font-medium text-slate-900">Nombre:</span> {getPatientFullName(patient)}
                </p>
                <p className="text-sm text-slate-600">
                  <span className="font-medium text-slate-900">Codigo:</span> {patient.patientCode}
                </p>
                <p className="text-sm text-slate-600">
                  <span className="font-medium text-slate-900">Telefono:</span> {patient.phone || "Sin telefono"}
                </p>
                <p className="text-sm text-slate-600">
                  <span className="font-medium text-slate-900">Expediente:</span> {record?.recordNumber || "Sin expediente"}
                </p>
              </div>
            </Card>

            <Card className="rounded-3xl border-slate-200 p-5">
              <div className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-slate-400" />
                <h2 className="text-base font-semibold text-slate-900">Atencion</h2>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <p className="text-sm text-slate-600">
                  <span className="font-medium text-slate-900">Clinica:</span> {clinic?.name || "Sin clinica"}
                </p>
                <p className="text-sm text-slate-600">
                  <span className="font-medium text-slate-900">Dentista:</span> {dentist?.displayName || "Sin dentista"}
                </p>
                <p className="text-sm text-slate-600">
                  <span className="font-medium text-slate-900">Especialidad:</span> {specialty?.name || "Sin especialidad"}
                </p>
                <p className="text-sm text-slate-600">
                  <span className="font-medium text-slate-900">Tipo de visita:</span> {visitType?.name || "Sin tipo"}
                </p>
              </div>
            </Card>

            <Card className="rounded-3xl border-slate-200 p-5">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-slate-400" />
                <h2 className="text-base font-semibold text-slate-900">Motivo</h2>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-700">{visit.reasonForVisit || "Sin motivo capturado"}</p>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="rounded-3xl border-slate-200 p-5">
              <div className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4 text-slate-400" />
                <h2 className="text-base font-semibold text-slate-900">Estado de visita</h2>
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <p><span className="font-medium text-slate-900">Source type:</span> {visit.sourceType}</p>
                <p><span className="font-medium text-slate-900">Inicio:</span> {formatDate(visit.startedAt)}</p>
                <p><span className="font-medium text-slate-900">Rango:</span> {formatTimeRange(visit.startedAt, visit.endedAt || visit.startedAt)}</p>
                <p><span className="font-medium text-slate-900">Estado:</span> {visit.status}</p>
              </div>
            </Card>

            <Card className="rounded-3xl border-slate-200 p-5">
              <div className="flex items-center gap-2">
                <FileCheck2 className="h-4 w-4 text-slate-400" />
                <h2 className="text-base font-semibold text-slate-900">Relacion con agenda</h2>
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <p>
                  <span className="font-medium text-slate-900">Cita origen:</span>{" "}
                  {sourceAppointment ? `${formatDate(sourceAppointment.scheduledStartAt)} · ${sourceAppointment.status}` : "Manual o no vinculada"}
                </p>
                <p>
                  <span className="font-medium text-slate-900">Expediente:</span> {record?.recordNumber || "Sin expediente"}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
