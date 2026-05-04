import { CalendarClock, MoreHorizontal, Stethoscope, UserRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { AppointmentStatusBadge } from "./AppointmentStatusBadge";
import {
  appointmentActionLabels,
  appointmentStatusMeta,
  formatTime,
  getAvailableAppointmentActions,
  getDurationMinutes,
  getPatientFullName,
} from "../bookingUtils";
import type {
  Appointment,
  AppointmentActionKey,
  AppUser,
  Patient,
  Specialty,
  VisitType,
} from "../bookingTypes";

interface AppointmentCardProps {
  appointment: Appointment;
  patient: Patient;
  dentist: AppUser | null;
  specialty: Specialty | null;
  visitType: VisitType | null;
  rescheduleTargetLabel?: string | null;
  onOpen: (appointmentId: string) => void;
  onAction: (action: AppointmentActionKey, appointmentId: string) => void;
}

export function AppointmentCard({
  appointment,
  patient,
  dentist,
  specialty,
  visitType,
  rescheduleTargetLabel,
  onOpen,
  onAction,
}: AppointmentCardProps) {
  const meta = appointmentStatusMeta[appointment.status];
  const duration = getDurationMinutes(appointment.scheduledStartAt, appointment.scheduledEndAt);
  const actions = getAvailableAppointmentActions(appointment);

  return (
    <Card
      className={`cursor-pointer gap-4 rounded-2xl border border-gray-200 border-l-4 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${meta.cardClassName}`}
      onClick={() => onOpen(appointment.id)}
    >
      <div className="flex items-start gap-4">
        <div className="min-w-[84px] rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-600">
          <p className="text-lg font-semibold text-slate-900">{formatTime(appointment.scheduledStartAt)}</p>
          <p>{duration} min</p>
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate text-base font-semibold text-slate-900">{getPatientFullName(patient)}</p>
                <AppointmentStatusBadge status={appointment.status} />
              </div>
              <p className="mt-1 text-sm text-slate-500">{appointment.reasonForVisit || "Sin motivo capturado"}</p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(event) => event.stopPropagation()}>
                <Button variant="ghost" size="icon" className="rounded-xl">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {actions.map((action) => (
                  <DropdownMenuItem
                    key={action}
                    onClick={(event) => {
                      event.stopPropagation();
                      onAction(action, appointment.id);
                    }}
                    variant={action === "cancel" ? "destructive" : "default"}
                  >
                    {appointmentActionLabels[action]}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(event) => {
                    event.stopPropagation();
                    onOpen(appointment.id);
                  }}
                >
                  Ver detalle
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="grid gap-2 text-sm text-slate-600 md:grid-cols-3">
            <div className="flex items-center gap-2">
              <UserRound className="h-4 w-4 text-slate-400" />
              <span>{dentist?.displayName || "Sin dentista asignado"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-slate-400" />
              <span>{specialty?.name || "Sin especialidad"}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-slate-400" />
              <span>{visitType?.name || "Sin tipo de visita"}</span>
            </div>
          </div>

          {appointment.status === "rescheduled" && rescheduleTargetLabel ? (
            <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-2 text-sm text-indigo-700">
              Nueva cita: {rescheduleTargetLabel}
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
