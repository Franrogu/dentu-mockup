import { AlertTriangle, CalendarDays, Clock3, FileText, Phone, Stethoscope } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../../../components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "../../../components/ui/sheet";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "../../../components/ui/alert";
import { Separator } from "../../../components/ui/separator";
import { AppointmentStatusBadge } from "./AppointmentStatusBadge";
import {
  appointmentActionLabels,
  formatDate,
  formatTimeRange,
  getAvailableAppointmentActions,
  getDurationMinutes,
  getPatientFullName,
  getPatientInitials,
} from "../bookingUtils";
import type {
  Appointment,
  AppointmentActionKey,
  AppUser,
  ClinicalRecord,
  Clinic,
  Patient,
  Specialty,
  VisitType,
} from "../bookingTypes";

interface AppointmentDetailDrawerProps {
  open: boolean;
  appointment: Appointment | null;
  patient: Patient | null;
  clinicalRecord: ClinicalRecord | null;
  clinic: Clinic | null;
  dentist: AppUser | null;
  specialty: Specialty | null;
  visitType: VisitType | null;
  successorAppointment: Appointment | null;
  createdByUser: AppUser | null;
  cancelledByUser: AppUser | null;
  noShowMarkedByUser: AppUser | null;
  onOpenChange: (open: boolean) => void;
  onAction: (action: AppointmentActionKey, appointmentId: string) => void;
}

function DetailBlock({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-sm text-slate-700">{value}</p>
    </div>
  );
}

export function AppointmentDetailDrawer({
  open,
  appointment,
  patient,
  clinicalRecord,
  clinic,
  dentist,
  specialty,
  visitType,
  successorAppointment,
  createdByUser,
  cancelledByUser,
  noShowMarkedByUser,
  onOpenChange,
  onAction,
}: AppointmentDetailDrawerProps) {
  const navigate = useNavigate();

  const actions = appointment ? getAvailableAppointmentActions(appointment) : [];
  const duration = appointment ? getDurationMinutes(appointment.scheduledStartAt, appointment.scheduledEndAt) : 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 overflow-y-auto border-l border-slate-200 p-0 sm:max-w-[480px]">
        {appointment && patient ? (
          <>
            <SheetHeader className="border-b border-slate-200 bg-white px-6 py-5">
              <div className="flex items-center gap-2">
                <SheetTitle className="text-xl text-slate-900">Detalle de cita</SheetTitle>
                <AppointmentStatusBadge status={appointment.status} />
              </div>
              <SheetDescription className="text-slate-500">
                Revisa informacion operativa de agenda sin mezclar datos clinicos.
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-6 px-6 py-6">
              <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-[#0F5F6D] text-white">{getPatientInitials(patient)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-semibold text-slate-900">{getPatientFullName(patient)}</p>
                    <p className="text-sm text-slate-500">{patient.patientCode}</p>
                  </div>
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => navigate(`/pacientes/${patient.id}?tab=citas`)}
                  >
                    Ver paciente
                  </Button>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <DetailBlock label="Telefono" value={patient.phone || "Sin telefono"} />
                  <DetailBlock label="Email" value={patient.email || "Sin email"} />
                </div>

                {clinicalRecord?.alertFlagsJson.length ? (
                  <Alert className="mt-4 border-amber-200 bg-amber-50 text-amber-800">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Alerta de expediente</AlertTitle>
                    <AlertDescription>{clinicalRecord.alertFlagsJson.join(" · ")}</AlertDescription>
                  </Alert>
                ) : null}
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-slate-400" />
                  <h3 className="text-sm font-semibold text-slate-900">Fecha y hora</h3>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <DetailBlock label="Fecha" value={formatDate(appointment.scheduledStartAt)} />
                  <DetailBlock label="Horario" value={formatTimeRange(appointment.scheduledStartAt, appointment.scheduledEndAt)} />
                  <DetailBlock label="Duracion" value={`${duration} minutos`} />
                  <DetailBlock label="Expediente" value={clinicalRecord?.recordNumber || "Sin expediente"} />
                </div>
              </section>

              <Separator />

              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-slate-400" />
                  <h3 className="text-sm font-semibold text-slate-900">Atencion</h3>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <DetailBlock label="Clinica" value={clinic?.name || "Sin clinica"} />
                  <DetailBlock label="Dentista" value={dentist?.displayName || "Sin dentista"} />
                  <DetailBlock label="Especialidad" value={specialty?.name || "Sin especialidad"} />
                  <DetailBlock label="Tipo de visita" value={visitType?.name || "Sin tipo"} />
                </div>
              </section>

              <Separator />

              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-900">Motivo</h3>
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                  {appointment.reasonForVisit || "Sin motivo capturado"}
                </div>
              </section>

              {(appointment.patientNotes || appointment.internalNotes) && (
                <section className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-900">Notas</h3>
                  <div className="space-y-3">
                    {appointment.patientNotes ? (
                      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Paciente</p>
                        <p className="mt-2 text-sm text-slate-700">{appointment.patientNotes}</p>
                      </div>
                    ) : null}
                    {appointment.internalNotes ? (
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Interna</p>
                        <p className="mt-2 text-sm text-slate-700">{appointment.internalNotes}</p>
                      </div>
                    ) : null}
                  </div>
                </section>
              )}

              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-900">Actividad</h3>
                <div className="space-y-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <div className="flex items-start gap-3">
                    <Clock3 className="mt-0.5 h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">Creada</p>
                      <p className="text-sm text-slate-500">
                        {formatDate(appointment.createdAt)} · {createdByUser?.displayName || "Sistema"}
                      </p>
                    </div>
                  </div>
                  {appointment.confirmedAt ? (
                    <div className="flex items-start gap-3">
                      <Clock3 className="mt-0.5 h-4 w-4 text-slate-400" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">Confirmada</p>
                        <p className="text-sm text-slate-500">{formatDate(appointment.confirmedAt)}</p>
                      </div>
                    </div>
                  ) : null}
                  {appointment.checkedInAt ? (
                    <div className="flex items-start gap-3">
                      <Clock3 className="mt-0.5 h-4 w-4 text-slate-400" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">Ingreso registrado automaticamente</p>
                        <p className="text-sm text-slate-500">{formatDate(appointment.checkedInAt)}</p>
                      </div>
                    </div>
                  ) : null}
                  {appointment.cancelledAt ? (
                    <div className="flex items-start gap-3">
                      <Clock3 className="mt-0.5 h-4 w-4 text-slate-400" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">Cancelada</p>
                        <p className="text-sm text-slate-500">
                          {formatDate(appointment.cancelledAt)} · {cancelledByUser?.displayName || "Usuario"}
                        </p>
                      </div>
                    </div>
                  ) : null}
                  {appointment.noShowMarkedAt ? (
                    <div className="flex items-start gap-3">
                      <Clock3 className="mt-0.5 h-4 w-4 text-slate-400" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">No asistio</p>
                        <p className="text-sm text-slate-500">
                          {formatDate(appointment.noShowMarkedAt)} · {noShowMarkedByUser?.displayName || "Usuario"}
                        </p>
                      </div>
                    </div>
                  ) : null}
                  {appointment.status === "rescheduled" && successorAppointment ? (
                    <div className="flex items-start gap-3">
                      <FileText className="mt-0.5 h-4 w-4 text-slate-400" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">Reagendada</p>
                        <p className="text-sm text-slate-500">
                          Nueva cita: {formatDate(successorAppointment.scheduledStartAt)} ·{" "}
                          {formatTimeRange(successorAppointment.scheduledStartAt, successorAppointment.scheduledEndAt)}
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>
              </section>

              {appointment.status === "cancelled" && appointment.cancellationReason ? (
                <Alert className="border-rose-200 bg-rose-50 text-rose-800">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Motivo de cancelacion</AlertTitle>
                  <AlertDescription>{appointment.cancellationReason}</AlertDescription>
                </Alert>
              ) : null}

              {appointment.status === "no_show" && appointment.noShowReason ? (
                <Alert className="border-slate-200 bg-slate-50 text-slate-800">
                  <Phone className="h-4 w-4" />
                  <AlertTitle>Motivo de no-show</AlertTitle>
                  <AlertDescription>{appointment.noShowReason}</AlertDescription>
                </Alert>
              ) : null}
            </div>

            <SheetFooter className="border-t border-slate-200 bg-white px-6 py-5">
              <div className="grid w-full gap-2">
                {actions.map((action) => (
                  <Button
                    key={action}
                    variant={action === "cancel" ? "destructive" : action === "view_visit" ? "outline" : "default"}
                    className={
                      action === "view_visit"
                        ? "rounded-xl"
                        : action === "cancel"
                          ? "rounded-xl"
                          : "rounded-xl bg-[#0F5F6D] hover:bg-[#0d4f5a]"
                    }
                    onClick={() => onAction(action, appointment.id)}
                  >
                    {appointmentActionLabels[action]}
                  </Button>
                ))}
              </div>
            </SheetFooter>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
