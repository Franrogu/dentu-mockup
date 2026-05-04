import { useEffect, useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "../../../components/ui/alert";
import { useBooking } from "../BookingContext";
import {
  addMinutesToTimeValue,
  buildDateTimeIso,
  findOverlappingAppointment,
  formatDate,
  formatTimeRange,
  getPatientFullName,
  toDateInputValue,
  toTimeInputValue,
} from "../bookingUtils";
import type { Appointment } from "../bookingTypes";

interface RescheduleAppointmentModalProps {
  appointment: Appointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RescheduleAppointmentModal({
  appointment,
  open,
  onOpenChange,
}: RescheduleAppointmentModalProps) {
  const { appointments, patients, rescheduleAppointment } = useBooking();

  const [dateValue, setDateValue] = useState("");
  const [timeValue, setTimeValue] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [changeReason, setChangeReason] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!appointment || !open) return;

    setDateValue(toDateInputValue(appointment.scheduledStartAt));
    setTimeValue(toTimeInputValue(appointment.scheduledStartAt));
    setDurationMinutes(
      Math.round(
        (new Date(appointment.scheduledEndAt).getTime() - new Date(appointment.scheduledStartAt).getTime()) / 60000,
      ),
    );
    setChangeReason("");
    setFormError(null);
  }, [appointment, open]);

  const patient = useMemo(() => {
    if (!appointment) return null;
    return patients.find((item) => item.id === appointment.patientId) ?? null;
  }, [appointment, patients]);

  const scheduledStartAt = dateValue && timeValue ? buildDateTimeIso(dateValue, timeValue) : "";
  const endTimeValue = timeValue ? addMinutesToTimeValue(timeValue, durationMinutes) : "";
  const scheduledEndAt = dateValue && endTimeValue ? buildDateTimeIso(dateValue, endTimeValue) : "";

  const overlappingAppointment =
    appointment && scheduledStartAt && scheduledEndAt
      ? findOverlappingAppointment(
          appointments,
          appointment.attendingUserId,
          scheduledStartAt,
          scheduledEndAt,
          appointment.id,
        )
      : null;

  const handleSave = () => {
    if (!appointment) return;

    const result = rescheduleAppointment({
      appointmentId: appointment.id,
      scheduledStartAt,
      scheduledEndAt,
      changeReason: changeReason || null,
    });

    if (!result.ok) {
      setFormError(result.error ?? "No fue posible reagendar.");
      return;
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-3xl border-slate-200 p-0">
        <DialogHeader className="border-b border-slate-200 px-6 py-5">
          <DialogTitle>Reagendar cita</DialogTitle>
          <DialogDescription>Crea una nueva cita y deja la actual como reagendada.</DialogDescription>
        </DialogHeader>

        {appointment && patient ? (
          <div className="space-y-6 px-6 py-6">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <p className="text-sm font-semibold text-slate-900">Cita actual</p>
              <p className="mt-1 text-base text-slate-800">{getPatientFullName(patient)}</p>
              <p className="mt-1 text-sm text-slate-500">
                {formatDate(appointment.scheduledStartAt)} ·{" "}
                {formatTimeRange(appointment.scheduledStartAt, appointment.scheduledEndAt)}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="rescheduleDate">Nueva fecha</Label>
                <Input
                  id="rescheduleDate"
                  type="date"
                  value={dateValue}
                  onChange={(event) => setDateValue(event.target.value)}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rescheduleTime">Nueva hora</Label>
                <Input
                  id="rescheduleTime"
                  type="time"
                  value={timeValue}
                  onChange={(event) => setTimeValue(event.target.value)}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rescheduleDuration">Duracion</Label>
                <Input
                  id="rescheduleDuration"
                  type="number"
                  min={5}
                  step={5}
                  value={durationMinutes}
                  onChange={(event) => setDurationMinutes(Number(event.target.value))}
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rescheduleReason">Motivo del cambio</Label>
              <Textarea
                id="rescheduleReason"
                value={changeReason}
                onChange={(event) => setChangeReason(event.target.value)}
                placeholder="Ej. El paciente solicito mover la cita por trabajo"
                className="rounded-2xl"
              />
            </div>

            {overlappingAppointment ? (
              <Alert variant="destructive" className="border-rose-200 bg-rose-50 text-rose-800">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Horario ocupado</AlertTitle>
                <AlertDescription>El dentista ya tiene otra cita activa en ese bloque.</AlertDescription>
              </Alert>
            ) : (
              <Alert className="border-emerald-200 bg-emerald-50 text-emerald-800">
                <AlertTitle>Horario disponible</AlertTitle>
                <AlertDescription>La nueva cita puede crearse sin empalme local.</AlertDescription>
              </Alert>
            )}

            {formError ? (
              <Alert variant="destructive" className="border-rose-200 bg-rose-50 text-rose-800">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>No se pudo reagendar</AlertTitle>
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            ) : null}
          </div>
        ) : null}

        <DialogFooter className="border-t border-slate-200 px-6 py-5">
          <Button variant="outline" className="rounded-xl" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            className="rounded-xl bg-[#0F5F6D] hover:bg-[#0d4f5a]"
            onClick={handleSave}
            disabled={!appointment || !scheduledStartAt || !scheduledEndAt || !!overlappingAppointment}
          >
            Crear nueva cita
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
