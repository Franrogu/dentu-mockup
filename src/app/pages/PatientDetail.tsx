import { useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { ChevronRight, FileText, FolderOpen, Grid3x3, Paperclip, Plus, ShieldAlert, Stethoscope } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { CreateAppointmentModal } from "../features/booking/components/CreateAppointmentModal";
import { PatientAppointmentsTab } from "../features/booking/components/PatientAppointmentsTab";
import { useBooking } from "../features/booking/BookingContext";
import {
  formatDate,
  formatTime,
  formatTimeRange,
  getPatientAge,
  getPatientFullName,
  getPatientInitials,
  sortAppointmentsByStart,
} from "../features/booking/bookingUtils";

type PatientTab =
  | "historia-clinica"
  | "citas"
  | "visitas"
  | "medicamentos"
  | "odontograma"
  | "adjuntos";

function normalizePatientTab(value: string | null): PatientTab {
  switch (value) {
    case "citas":
    case "visitas":
    case "medicamentos":
    case "odontograma":
    case "adjuntos":
      return value;
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

const recordStatusLabels = {
  open: "Abierto",
  archived: "Archivado",
} as const;

const patientStatusLabels = {
  active: "Activo",
  inactive: "Inactivo",
  archived: "Archivado",
} as const;

const visitStatusLabels = {
  draft: "Borrador",
  open: "Abierta",
  completed: "Completada",
  cancelled: "Cancelada",
  voided: "Anulada",
} as const;

export function PatientDetail() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [createOpen, setCreateOpen] = useState(false);

  const { appointments, clinicalRecords, clinics, patients, specialties, users, visitTypes, visits } = useBooking();

  const activeTab = normalizePatientTab(searchParams.get("tab"));
  const patient = patients.find((item) => item.id === id) ?? null;
  const record = clinicalRecords.find((item) => item.patientId === id) ?? null;
  const patientAppointments = appointments.filter((appointment) => appointment.patientId === id);
  const patientVisits = visits.filter((visit) => visit.patientId === id);

  const nextAppointment =
    sortAppointmentsByStart(
      patientAppointments.filter((appointment) =>
        ["draft", "scheduled", "confirmed", "checked_in"].includes(appointment.status),
      ),
    )[0] ?? null;

  const latestCompletedAppointment =
    sortAppointmentsByStart(
      patientAppointments.filter((appointment) => appointment.status === "completed"),
    ).at(-1) ?? null;

  const visitsCards = useMemo(() => {
    return [...patientVisits].sort(
      (left, right) => new Date(right.startedAt).getTime() - new Date(left.startedAt).getTime(),
    );
  }, [patientVisits]);

  const tabTriggerClass =
    "rounded-none border-b-2 border-transparent bg-transparent px-4 py-3 text-sm font-medium " +
    "text-gray-500 transition-colors hover:text-gray-700 data-[state=active]:border-[#0F5F6D] " +
    "data-[state=active]:font-semibold data-[state=active]:text-[#0F5F6D] data-[state=active]:shadow-none";

  const handleTabChange = (nextTab: string) => {
    const normalizedTab = normalizePatientTab(nextTab);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("tab", normalizedTab);
    setSearchParams(nextParams, { replace: true });
  };

  if (!patient) {
    return (
      <div className="p-8">
        <Card className="rounded-3xl border-slate-200 p-8">
          <p className="text-lg font-semibold text-slate-900">Paciente no encontrado</p>
          <p className="mt-2 text-sm text-slate-500">El paciente solicitado no existe dentro del mock cargado.</p>
          <Button className="mt-4 rounded-xl" onClick={() => navigate("/pacientes")}>
            Volver a pacientes
          </Button>
        </Card>
      </div>
    );
  }

  const age = getPatientAge(patient.birthDate);
  const alertItems = [record?.riskFlagsSummary, ...(record?.alertFlagsJson ?? [])].filter(
    (item): item is string => Boolean(item),
  );

  return (
    <div className="min-h-full bg-[#f4f7f7] p-6 md:p-8">
      <div className="mx-auto max-w-[1400px] space-y-6">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <button type="button" onClick={() => navigate("/pacientes")} className="hover:text-[#0F5F6D]">
            Pacientes
          </button>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-slate-900">{getPatientFullName(patient)}</span>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white px-6 py-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0F5F6D] text-lg font-semibold text-white">
                {getPatientInitials(patient)}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-semibold text-slate-950">{getPatientFullName(patient)}</h1>
                  <Badge variant="outline" className="rounded-full border-slate-200 bg-slate-50 text-slate-600">
                    {patientStatusLabels[patient.status] ?? patient.status}
                  </Badge>
                  <Badge variant="outline" className="rounded-full border-slate-200 bg-slate-50 text-slate-600">
                    {patient.patientCode}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {age ? `${age} anos` : "Edad no capturada"} / {patient.phone || "Sin telefono"} /{" "}
                  {record?.recordNumber || "Sin expediente"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="rounded-xl" onClick={() => navigate("/agenda")}>
                Ver agenda
              </Button>
              <Button className="rounded-xl bg-[#0F5F6D] hover:bg-[#0d4f5a]" onClick={() => setCreateOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Nueva cita
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white">
            <TabsList className="h-auto w-max min-w-full justify-start gap-0 rounded-none border-b border-slate-200 bg-transparent px-2 py-0">
              <TabsTrigger value="historia-clinica" className={tabTriggerClass}>Historia clinica</TabsTrigger>
              <TabsTrigger value="citas" className={tabTriggerClass}>Citas</TabsTrigger>
              <TabsTrigger value="visitas" className={tabTriggerClass}>Visitas</TabsTrigger>
              <TabsTrigger value="medicamentos" className={tabTriggerClass}>Medicamentos</TabsTrigger>
              <TabsTrigger value="odontograma" className={tabTriggerClass}>Odontograma</TabsTrigger>
              <TabsTrigger value="adjuntos" className={tabTriggerClass}>Adjuntos</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="historia-clinica" className="mt-5">
            <div className="space-y-5">
              {record?.status === "archived" ? (
                <Card className="rounded-3xl border-amber-200 bg-amber-50 p-5">
                  <div className="flex items-start gap-3">
                    <ShieldAlert className="mt-0.5 h-5 w-5 text-amber-700" />
                    <div>
                      <p className="font-semibold text-amber-950">Expediente archivado</p>
                      <p className="mt-1 text-sm text-amber-900">
                        El paciente puede consultarse, pero el mock de agenda bloquea la creacion de nuevas citas
                        hasta volver a tener un expediente activo.
                      </p>
                    </div>
                  </div>
                </Card>
              ) : null}

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Card className="rounded-3xl border-slate-200 p-5">
                  <p className="text-sm text-slate-500">Proxima cita</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {nextAppointment ? formatDate(nextAppointment.scheduledStartAt) : "Sin cita activa"}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {nextAppointment?.reasonForVisit || "Agenda libre por ahora."}
                  </p>
                </Card>

                <Card className="rounded-3xl border-slate-200 p-5">
                  <p className="text-sm text-slate-500">Ultima atencion</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {latestCompletedAppointment ? formatDate(latestCompletedAppointment.scheduledStartAt) : "Sin cita completada"}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {latestCompletedAppointment?.reasonForVisit || "Aun no existe seguimiento clinico desde agenda."}
                  </p>
                </Card>

                <Card className="rounded-3xl border-slate-200 p-5">
                  <p className="text-sm text-slate-500">Expediente</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {record?.recordNumber || "Sin expediente"}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {record ? recordStatusLabels[record.status] : "Sin registro clinico"}
                  </p>
                </Card>

                <Card className="rounded-3xl border-slate-200 p-5">
                  <p className="text-sm text-slate-500">Visitas vinculadas</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{patientVisits.length}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {patientVisits.length > 0 ? "Atenciones creadas desde cita." : "Sin visitas relacionadas todavia."}
                  </p>
                </Card>
              </div>

              <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
                <Card className="rounded-3xl border-slate-200 p-6">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="h-4 w-4 text-[#0F5F6D]" />
                    <h2 className="text-lg font-semibold text-slate-900">Historia clinica consolidada</h2>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {record?.clinicalSummary ||
                      "No hay un resumen clinico cargado en este mock. La agenda usa el expediente solo como contexto rapido, sin editar informacion asistencial desde la cita."}
                  </p>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Telefono</p>
                      <p className="mt-2 text-sm text-slate-900">{patient.phone || "Sin telefono"}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</p>
                      <p className="mt-2 text-sm text-slate-900">{patient.email || "Sin email"}</p>
                    </div>
                  </div>
                </Card>

                <Card className="rounded-3xl border-slate-200 p-6">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4 text-slate-400" />
                    <h2 className="text-lg font-semibold text-slate-900">Expediente y alertas</h2>
                  </div>

                  <div className="mt-5 space-y-4">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Record number</p>
                      <p className="mt-2 font-medium text-slate-900">{record?.recordNumber || "Sin expediente"}</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Estado</p>
                      <p className="mt-2 font-medium text-slate-900">
                        {record ? recordStatusLabels[record.status] : "Sin registro clinico"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Alertas visibles</p>
                      {alertItems.length > 0 ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {alertItems.map((alertItem) => (
                            <Badge
                              key={alertItem}
                              variant="outline"
                              className="rounded-full border-amber-200 bg-amber-50 text-amber-900"
                            >
                              {alertItem}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-2 text-sm text-slate-500">Sin alertas operativas relevantes.</p>
                      )}
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="rounded-3xl border-teal-200 bg-teal-50/70 p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">Contexto clinico sin duplicar la agenda</p>
                    <p className="mt-1 text-sm text-slate-600">
                      Esta vista vuelve a concentrar resumen, expediente e historia en un solo tab. Asi evitamos
                      clics extra en paciente y mantenemos booking separado de la atencion clinica.
                    </p>
                  </div>
                  <Button variant="outline" className="rounded-xl bg-white" onClick={() => setCreateOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nueva cita
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="citas" className="mt-5">
            <PatientAppointmentsTab patientId={patient.id} />
          </TabsContent>

          <TabsContent value="visitas" className="mt-5">
            <div className="space-y-4">
              {visitsCards.length === 0 ? (
                <Card className="rounded-3xl border-dashed border-slate-200 p-10 text-center text-slate-500">
                  Aun no existen visitas vinculadas para este paciente.
                </Card>
              ) : (
                visitsCards.map((visit) => {
                  const clinic = clinics.find((item) => item.id === visit.clinicId);
                  const dentist = users.find((item) => item.id === visit.attendingUserId);
                  const specialty = specialties.find((item) => item.id === visit.specialtyId);
                  const visitType = visitTypes.find((item) => item.id === visit.visitTypeId);

                  return (
                    <Card key={visit.id} className="rounded-3xl border-slate-200 p-5">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-lg font-semibold text-slate-900">
                              {visit.reasonForVisit || "Sin motivo capturado"}
                            </p>
                            <Badge variant="outline" className="rounded-full border-slate-200 bg-slate-50 text-slate-600">
                              {visitStatusLabels[visit.status] ?? visit.status}
                            </Badge>
                          </div>

                          <div className="grid gap-2 text-sm text-slate-600 md:grid-cols-2 xl:grid-cols-4">
                            <p>{formatDate(visit.startedAt)}</p>
                            <p>{visit.endedAt ? formatTimeRange(visit.startedAt, visit.endedAt) : `Desde ${formatTime(visit.startedAt)}`}</p>
                            <p>{dentist?.displayName || "Sin dentista"}</p>
                            <p>{visitType?.name || specialty?.name || "Sin tipo de visita"}</p>
                          </div>

                          <p className="text-sm text-slate-500">
                            {clinic?.name || "Sin clinica"} / {visit.sourceType}
                          </p>
                        </div>

                        <Button className="rounded-xl bg-[#0F5F6D] hover:bg-[#0d4f5a]" onClick={() => navigate(`/visitas/${visit.id}`)}>
                          Ver visita
                        </Button>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>

          <TabsContent value="medicamentos" className="mt-5">
            <Card className="rounded-3xl border-slate-200 p-6">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-slate-400" />
                <h2 className="text-lg font-semibold text-slate-900">Medicamentos</h2>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                La medicacion detallada permanece en el modulo clinico. En este mock de agenda la dejamos fuera para
                no mezclar booking con tratamiento ni duplicar informacion sensible en la cita.
              </p>
              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
                Usa esta tab como espacio reservado para integrar el modulo clinico real mas adelante, sin alterar la
                navegacion del paciente.
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="odontograma" className="mt-5">
            <Card className="rounded-3xl border-slate-200 p-6">
              <div className="flex items-center gap-2">
                <Grid3x3 className="h-4 w-4 text-slate-400" />
                <h2 className="text-lg font-semibold text-slate-900">Odontograma</h2>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                El odontograma sigue siendo parte de la atencion clinica y no del flujo de agenda. Se mantiene esta
                pestana para conservar la navegacion previa sin volver pesada la maqueta de booking.
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="adjuntos" className="mt-5">
            <Card className="rounded-3xl border-slate-200 p-6">
              <div className="flex items-center gap-2">
                <Paperclip className="h-4 w-4 text-slate-400" />
                <h2 className="text-lg font-semibold text-slate-900">Adjuntos</h2>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Radiografias, consentimientos y demas archivos siguen fuera del mock de agenda. La tab queda visible
                para respetar el layout administrativo del paciente y preparar la integracion futura.
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <CreateAppointmentModal open={createOpen} initialPatientId={patient.id} onOpenChange={setCreateOpen} />
    </div>
  );
}
