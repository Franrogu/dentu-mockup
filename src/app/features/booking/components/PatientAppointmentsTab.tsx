import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { CalendarDays, History, Plus } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { AppointmentStatusBadge } from "./AppointmentStatusBadge";
import { AppointmentDetailDrawer } from "./AppointmentDetailDrawer";
import { CreateAppointmentModal } from "./CreateAppointmentModal";
import { RescheduleAppointmentModal } from "./RescheduleAppointmentModal";
import { useBooking } from "../BookingContext";
import {
  formatDate,
  formatTimeRange,
  getPatientFullName,
  isSameDay,
  sortAppointmentsByNewest,
} from "../bookingUtils";
import type { Appointment, AppointmentActionKey } from "../bookingTypes";

export function PatientAppointmentsTab({ patientId }: { patientId: string }) {
  const navigate = useNavigate();
  const {
    appointments,
    clinicalRecords,
    clinics,
    patients,
    specialties,
    users,
    visitTypes,
    confirmAppointment,
    checkInAppointment,
    startVisitFromAppointment,
    cancelAppointment,
    markNoShow,
  } = useBooking();

  const patient = patients.find((item) => item.id === patientId) ?? null;

  const [drawerAppointmentId, setDrawerAppointmentId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [rescheduleAppointmentId, setRescheduleAppointmentId] = useState<string | null>(null);

  const patientAppointments = useMemo(() => {
    return sortAppointmentsByNewest(appointments.filter((appointment) => appointment.patientId === patientId));
  }, [appointments, patientId]);

  const upcomingAppointments = patientAppointments.filter((appointment) => {
    return ["draft", "scheduled", "confirmed", "checked_in"].includes(appointment.status);
  });

  const historyAppointments = patientAppointments.filter((appointment) => {
    return ["completed", "cancelled", "no_show", "rescheduled"].includes(appointment.status);
  });

  const drawerAppointment = patientAppointments.find((appointment) => appointment.id === drawerAppointmentId) ?? null;
  const rescheduleAppointment = patientAppointments.find((appointment) => appointment.id === rescheduleAppointmentId) ?? null;

  const handleAction = (action: AppointmentActionKey, appointmentId: string) => {
    const appointment = patientAppointments.find((item) => item.id === appointmentId);
    if (!appointment) return;

    switch (action) {
      case "confirm":
        confirmAppointment(appointmentId);
        break;
      case "check_in":
        checkInAppointment(appointmentId);
        break;
      case "start_visit":
        startVisitFromAppointment(appointmentId);
        break;
      case "cancel": {
        const reason = window.prompt("Motivo de cancelacion", "Paciente solicito cancelar");
        if (reason) {
          cancelAppointment(appointmentId, reason);
        }
        break;
      }
      case "mark_no_show": {
        const reason = window.prompt("Motivo de no-show", "No asistio a la cita");
        if (reason) {
          markNoShow(appointmentId, reason);
        }
        break;
      }
      case "reschedule":
        setRescheduleAppointmentId(appointmentId);
        break;
      case "view_visit":
        if (appointment.visitId) {
          navigate(`/visitas/${appointment.visitId}`);
        }
        break;
      case "view_successor": {
        const successor = appointments.find((item) => item.rescheduledFromAppointmentId === appointmentId);
        if (successor) {
          setDrawerAppointmentId(successor.id);
        }
        break;
      }
      case "view_patient":
        navigate(`/pacientes/${appointment.patientId}?tab=historia-clinica`);
        break;
    }
  };

  const renderAppointmentCard = (appointment: Appointment) => {
    const clinic = clinics.find((item) => item.id === appointment.clinicId);
    const dentist = users.find((item) => item.id === appointment.attendingUserId);
    const specialty = specialties.find((item) => item.id === appointment.specialtyId);

    return (
      <div
        key={appointment.id}
        onClick={() => setDrawerAppointmentId(appointment.id)}
        className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">{formatDate(appointment.scheduledStartAt)}</p>
            <p className="mt-1 text-base font-semibold text-slate-900">
              {formatTimeRange(appointment.scheduledStartAt, appointment.scheduledEndAt)}
            </p>
          </div>
          <AppointmentStatusBadge status={appointment.status} />
        </div>

        <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-2">
          <p>
            <span className="font-medium text-slate-900">Dentista:</span> {dentist?.displayName || "Sin asignar"}
          </p>
          <p>
            <span className="font-medium text-slate-900">Especialidad:</span> {specialty?.name || "Sin especialidad"}
          </p>
          <p>
            <span className="font-medium text-slate-900">Clinica:</span> {clinic?.name || "Sin clinica"}
          </p>
          <p>
            <span className="font-medium text-slate-900">Motivo:</span> {appointment.reasonForVisit || "Sin motivo"}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="outline" className="rounded-xl" onClick={(event) => {
            event.stopPropagation();
            setDrawerAppointmentId(appointment.id);
          }}>
            Ver
          </Button>
          {(appointment.status === "scheduled" ||
            appointment.status === "confirmed" ||
            appointment.status === "cancelled" ||
            appointment.status === "no_show") ? (
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={(event) => {
                event.stopPropagation();
                setRescheduleAppointmentId(appointment.id);
              }}
            >
              Reagendar
            </Button>
          ) : null}
          {appointment.status === "completed" && appointment.visitId ? (
            <Button
              className="rounded-xl bg-[#0F5F6D] hover:bg-[#0d4f5a]"
              onClick={(event) => {
                event.stopPropagation();
                navigate(`/visitas/${appointment.visitId}`);
              }}
            >
              Ver visita
            </Button>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-slate-500">Paciente: {patient ? getPatientFullName(patient) : "Sin paciente"}</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-950">Citas activas</h2>
        </div>
        <Button className="rounded-xl bg-[#0F5F6D] hover:bg-[#0d4f5a]" onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva cita
        </Button>
      </div>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-slate-400" />
          <h3 className="text-lg font-semibold text-slate-900">Proximas</h3>
        </div>

        {upcomingAppointments.length === 0 ? (
          <Card className="rounded-3xl border-dashed border-slate-200 bg-white p-10 text-center text-slate-500">
            No hay citas futuras o activas para este paciente.
          </Card>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">{upcomingAppointments.map(renderAppointmentCard)}</div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-slate-400" />
          <h3 className="text-lg font-semibold text-slate-900">Historial</h3>
        </div>

        {historyAppointments.length === 0 ? (
          <Card className="rounded-3xl border-dashed border-slate-200 bg-white p-10 text-center text-slate-500">
            Aun no hay historial de citas.
          </Card>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">{historyAppointments.map(renderAppointmentCard)}</div>
        )}
      </section>

      <AppointmentDetailDrawer
        open={!!drawerAppointmentId}
        onOpenChange={(open) => {
          if (!open) setDrawerAppointmentId(null);
        }}
        appointment={drawerAppointment}
        patient={patient}
        clinicalRecord={clinicalRecords.find((item) => item.id === drawerAppointment?.clinicalRecordId) ?? null}
        clinic={clinics.find((item) => item.id === drawerAppointment?.clinicId) ?? null}
        dentist={users.find((item) => item.id === drawerAppointment?.attendingUserId) ?? null}
        specialty={specialties.find((item) => item.id === drawerAppointment?.specialtyId) ?? null}
        visitType={visitTypes.find((item) => item.id === drawerAppointment?.visitTypeId) ?? null}
        successorAppointment={appointments.find((item) => item.rescheduledFromAppointmentId === drawerAppointment?.id) ?? null}
        createdByUser={users.find((item) => item.id === drawerAppointment?.createdByUserId) ?? null}
        cancelledByUser={users.find((item) => item.id === drawerAppointment?.cancelledByUserId) ?? null}
        noShowMarkedByUser={users.find((item) => item.id === drawerAppointment?.noShowMarkedByUserId) ?? null}
        onAction={handleAction}
      />

      <CreateAppointmentModal
        open={createOpen}
        initialPatientId={patientId}
        onOpenChange={setCreateOpen}
      />
      <RescheduleAppointmentModal
        appointment={rescheduleAppointment}
        open={!!rescheduleAppointmentId}
        onOpenChange={(open) => {
          if (!open) setRescheduleAppointmentId(null);
        }}
      />
    </div>
  );
}
