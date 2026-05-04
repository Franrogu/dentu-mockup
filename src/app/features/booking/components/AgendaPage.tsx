import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Calendar1,
  CalendarDays,
  CheckCircle2,
  Clock3,
  LayoutList,
  Plus,
  Search,
  Users,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { AppointmentCard } from "./AppointmentCard";
import { AppointmentDetailDrawer } from "./AppointmentDetailDrawer";
import { CreateAppointmentModal } from "./CreateAppointmentModal";
import { RescheduleAppointmentModal } from "./RescheduleAppointmentModal";
import { useBooking } from "../BookingContext";
import { BOOKING_REFERENCE_DATE } from "../mockData";
import {
  formatDate,
  formatTimeRange,
  getAppointmentDaySummary,
  getClinicCapacity,
  getDateLabel,
  getPatientFullName,
  getShortDateLabel,
  getUpcomingActionCounts,
  isSameDay,
  sortAppointmentsByStart,
} from "../bookingUtils";
import type { AppointmentActionKey } from "../bookingTypes";

type AgendaView = "day" | "week" | "list";

function shiftDate(dateValue: string, days: number) {
  const date = new Date(`${dateValue}T12:00:00-06:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function getWeekDates(dateValue: string) {
  const date = new Date(`${dateValue}T12:00:00-06:00`);
  const dayIndex = date.getDay();
  const mondayOffset = dayIndex === 0 ? -6 : 1 - dayIndex;
  const monday = shiftDate(dateValue, mondayOffset);
  return Array.from({ length: 7 }, (_, index) => shiftDate(monday, index));
}

export function AgendaPage() {
  const navigate = useNavigate();
  const {
    appointments,
    clinicalRecords,
    clinics,
    currentUser,
    patients,
    settings,
    specialties,
    users,
    visitTypes,
    confirmAppointment,
    checkInAppointment,
    startVisitFromAppointment,
    cancelAppointment,
    markNoShow,
  } = useBooking();

  const dentistUsers = users.filter((user) => user.userCategory === "dentist");

  const [view, setView] = useState<AgendaView>("day");
  const [selectedDate, setSelectedDate] = useState(BOOKING_REFERENCE_DATE);
  const [clinicFilter, setClinicFilter] = useState<string>("all");
  const [dentistFilter, setDentistFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [rescheduleAppointmentId, setRescheduleAppointmentId] = useState<string | null>(null);

  const selectedAppointment = appointments.find((appointment) => appointment.id === selectedAppointmentId) ?? null;
  const rescheduleAppointment = appointments.find((appointment) => appointment.id === rescheduleAppointmentId) ?? null;

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredAppointments = useMemo(() => {
    const sourceAppointments = sortAppointmentsByStart(appointments).filter((appointment) => {
      if (clinicFilter !== "all" && appointment.clinicId !== clinicFilter) return false;
      if (dentistFilter !== "all" && appointment.attendingUserId !== dentistFilter) return false;
      if (statusFilter !== "all" && appointment.status !== statusFilter) return false;
      if (!normalizedSearch) return true;

      const patient = patients.find((item) => item.id === appointment.patientId);
      const patientName = patient ? getPatientFullName(patient).toLowerCase() : "";
      const reason = appointment.reasonForVisit?.toLowerCase() ?? "";
      return patientName.includes(normalizedSearch) || reason.includes(normalizedSearch);
    });

    if (view === "list") {
      return sourceAppointments;
    }

    if (view === "day") {
      return sourceAppointments.filter((appointment) => isSameDay(appointment.scheduledStartAt, `${selectedDate}T12:00:00-06:00`));
    }

    const weekDates = new Set(getWeekDates(selectedDate));
    return sourceAppointments.filter((appointment) => weekDates.has(appointment.scheduledStartAt.slice(0, 10)));
  }, [appointments, clinicFilter, dentistFilter, normalizedSearch, patients, selectedDate, statusFilter, view]);

  const selectedSummary = getAppointmentDaySummary(
    appointments.filter((appointment) => (clinicFilter === "all" ? true : appointment.clinicId === clinicFilter)),
    selectedDate,
  );

  const capacity = getClinicCapacity(settings, appointments, clinicFilter === "all" ? "all" : clinicFilter, selectedDate);
  const actionsSummary = getUpcomingActionCounts(
    appointments.filter((appointment) => (clinicFilter === "all" ? true : appointment.clinicId === clinicFilter)),
    selectedDate,
  );

  const handleAction = (action: AppointmentActionKey, appointmentId: string) => {
    const appointment = appointments.find((item) => item.id === appointmentId);
    if (!appointment) return;

    switch (action) {
      case "confirm":
        confirmAppointment(appointmentId);
        break;
      case "start_visit":
        startVisitFromAppointment(appointmentId);
        break;
      case "check_in":
        checkInAppointment(appointmentId);
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
      case "view_patient":
        navigate(`/pacientes/${appointment.patientId}?tab=historia-clinica`);
        break;
      case "view_visit":
        if (appointment.visitId) {
          navigate(`/visitas/${appointment.visitId}`);
        }
        break;
      case "view_successor": {
        const successor = appointments.find((item) => item.rescheduledFromAppointmentId === appointmentId);
        if (successor) {
          setSelectedAppointmentId(successor.id);
          setDrawerOpen(true);
        }
        break;
      }
    }
  };

  const groupedByHour = useMemo(() => {
    return Array.from({ length: 13 }, (_, index) => {
      const hour = 7 + index;
      const items = filteredAppointments.filter((appointment) => {
        const startHour = new Date(appointment.scheduledStartAt).getHours();
        return startHour === hour;
      });
      return { hour, items };
    });
  }, [filteredAppointments]);

  const weekDates = view === "week" ? getWeekDates(selectedDate) : [];

  return (
    <div className="min-h-full bg-[#f4f7f7] p-6 md:p-8">
      <div className="mx-auto max-w-[1500px] space-y-6">
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <CalendarDays className="h-4 w-4" />
                <span>Agenda interna</span>
              </div>
              <h1 className="mt-2 text-3xl font-semibold text-slate-950">Agenda</h1>
              <p className="mt-1 text-sm text-slate-500">Visualiza citas, confirma asistencia y convierte una cita en visita sin backend real.</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="icon" className="rounded-xl">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-xl">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-3 py-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F5F6D] text-sm font-semibold text-white">
                  {currentUser.firstName[0]}
                  {currentUser.lastName[0]}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-900">{currentUser.displayName}</p>
                  <p className="text-xs text-slate-500">Recepcion central</p>
                </div>
              </div>
            </div>
          </div>

              <div className="space-y-4 px-6 py-5">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => setSelectedDate(BOOKING_REFERENCE_DATE)}
                >
                  Hoy
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-xl"
                  onClick={() => setSelectedDate(shiftDate(selectedDate, view === "week" ? -7 : -1))}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">
                  {getDateLabel(selectedDate)}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-xl"
                  onClick={() => setSelectedDate(shiftDate(selectedDate, view === "week" ? 7 : 1))}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex rounded-2xl border border-slate-200 bg-slate-50 p-1">
                  {[
                    { id: "day" as const, label: "Dia", icon: Calendar1 },
                    { id: "week" as const, label: "Semana", icon: CalendarDays },
                    { id: "list" as const, label: "Lista", icon: LayoutList },
                  ].map((option) => {
                    const Icon = option.icon;
                    const isActive = view === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setView(option.id)}
                        className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
                          isActive ? "bg-white font-medium text-[#0F5F6D] shadow-sm" : "text-slate-500"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {option.label}
                      </button>
                    );
                  })}
                </div>

                <Select value={clinicFilter} onValueChange={setClinicFilter}>
                  <SelectTrigger className="h-11 w-[180px] rounded-xl">
                    <SelectValue placeholder="Clinica" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las clinicas</SelectItem>
                    {clinics.map((clinic) => (
                      <SelectItem key={clinic.id} value={clinic.id}>
                        {clinic.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={dentistFilter} onValueChange={setDentistFilter}>
                  <SelectTrigger className="h-11 w-[190px] rounded-xl">
                    <SelectValue placeholder="Dentista" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los dentistas</SelectItem>
                    {dentistUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-11 w-[180px] rounded-xl">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    {[
                      ["draft", "Borrador"],
                      ["scheduled", "Programada"],
                      ["confirmed", "Confirmada"],
                      ["completed", "Completada"],
                      ["cancelled", "Cancelada"],
                      ["no_show", "No asistio"],
                      ["rescheduled", "Reagendada"],
                    ].map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button className="h-11 rounded-xl bg-[#0F5F6D] px-4 hover:bg-[#0d4f5a]" onClick={() => setCreateOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva cita
                </Button>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar paciente o motivo"
                className="h-11 rounded-2xl border-slate-200 bg-slate-50 pl-10"
              />
            </div>

            <div className="rounded-2xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm text-teal-800">
              Flujo sugerido: confirma la cita y, al iniciar visita, el sistema registra la llegada automaticamente para evitar pasos extra.
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <div className="space-y-4 xl:sticky xl:top-6 xl:self-start">
            <Card className="rounded-[26px] border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Resumen del dia</p>
                  <h2 className="mt-1 text-lg font-semibold text-slate-900">{getDateLabel(selectedDate)}</h2>
                </div>
                <div className="rounded-2xl bg-teal-50 px-3 py-2 text-right text-sm text-teal-700">
                  <p className="font-semibold">{capacity.percentage}%</p>
                  <p>ocupacion</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {[
                  { label: "Programadas", value: selectedSummary.scheduled, icon: CalendarDays },
                  { label: "Por iniciar", value: selectedSummary.readyToStart, icon: CheckCircle2 },
                  { label: "Completadas", value: selectedSummary.completed, icon: Users },
                  { label: "No asistio", value: selectedSummary.noShow, icon: Clock3 },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#0F5F6D] shadow-sm">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-500">{item.label}</p>
                        <p className="text-lg font-semibold text-slate-900">{item.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                <p className="text-sm text-slate-500">Capacidad del dia</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {capacity.occupied} de {capacity.totalSlots || 0} slots
                </p>
              </div>
            </Card>

            <Card className="rounded-[26px] border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Proximas acciones</p>
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <p className="text-sm font-medium text-slate-900">Confirmar citas pendientes</p>
                  <p className="mt-1 text-sm text-slate-500">{actionsSummary.pendingConfirmation} citas por confirmar hoy.</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <p className="text-sm font-medium text-slate-900">Seguimiento de no asistencias</p>
                  <p className="mt-1 text-sm text-slate-500">{actionsSummary.noShowFollowUp} pacientes requieren contacto.</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <p className="text-sm font-medium text-slate-900">Citas por iniciar</p>
                  <p className="mt-1 text-sm text-slate-500">{actionsSummary.readyToStart} citas listas para iniciar visita.</p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="rounded-[30px] border-slate-200 bg-white p-5 shadow-sm">
            {view === "day" ? (
              <div className="space-y-5">
                {groupedByHour.map((slot) => (
                  <div key={slot.hour} className="grid gap-4 lg:grid-cols-[88px_minmax(0,1fr)]">
                    <div className="pt-2 text-sm font-medium text-slate-400">
                      {`${slot.hour}`.padStart(2, "0")}:00
                    </div>
                    <div className="space-y-3 rounded-3xl border border-dashed border-slate-200 bg-slate-50/70 p-3">
                      {slot.items.length === 0 ? (
                        <div className="rounded-2xl bg-white/80 px-4 py-4 text-sm text-slate-400">Sin citas en este bloque.</div>
                      ) : (
                        slot.items.map((appointment) => {
                          const patient = patients.find((item) => item.id === appointment.patientId)!;
                          const dentist = users.find((item) => item.id === appointment.attendingUserId) ?? null;
                          const specialty = specialties.find((item) => item.id === appointment.specialtyId) ?? null;
                          const visitType = visitTypes.find((item) => item.id === appointment.visitTypeId) ?? null;
                          const successor = appointments.find((item) => item.rescheduledFromAppointmentId === appointment.id) ?? null;
                          const successorLabel = successor
                            ? `${formatDate(successor.scheduledStartAt)} · ${formatTimeRange(
                                successor.scheduledStartAt,
                                successor.scheduledEndAt,
                              )}`
                            : null;

                          return (
                            <AppointmentCard
                              key={appointment.id}
                              appointment={appointment}
                              patient={patient}
                              dentist={dentist}
                              specialty={specialty}
                              visitType={visitType}
                              rescheduleTargetLabel={successorLabel}
                              onOpen={(appointmentId) => {
                                setSelectedAppointmentId(appointmentId);
                                setDrawerOpen(true);
                              }}
                              onAction={handleAction}
                            />
                          );
                        })
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {view === "week" ? (
              <div className="grid gap-4 xl:grid-cols-7">
                {weekDates.map((dateValue) => {
                  const dayAppointments = filteredAppointments.filter((appointment) => appointment.scheduledStartAt.slice(0, 10) === dateValue);

                  return (
                    <div key={dateValue} className="rounded-3xl border border-slate-200 bg-slate-50 p-3">
                      <div className="mb-3 border-b border-slate-200 pb-3">
                        <p className="text-sm font-semibold text-slate-900">{getShortDateLabel(dateValue)}</p>
                        <p className="text-xs text-slate-500">{dayAppointments.length} citas</p>
                      </div>
                      <div className="space-y-2">
                        {dayAppointments.length === 0 ? (
                          <div className="rounded-2xl bg-white px-3 py-4 text-xs text-slate-400">Sin agenda</div>
                        ) : (
                          dayAppointments.map((appointment) => {
                            const patient = patients.find((item) => item.id === appointment.patientId)!;
                            return (
                              <button
                                key={appointment.id}
                                type="button"
                                onClick={() => {
                                  setSelectedAppointmentId(appointment.id);
                                  setDrawerOpen(true);
                                }}
                                className="w-full rounded-2xl border border-white bg-white px-3 py-3 text-left shadow-sm transition hover:border-slate-200"
                              >
                                <p className="text-sm font-medium text-slate-900">
                                  {appointment.scheduledStartAt.slice(11, 16)} · {getPatientFullName(patient)}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">{appointment.reasonForVisit || "Sin motivo"}</p>
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}

            {view === "list" ? (
              <div className="space-y-4">
                {filteredAppointments.map((appointment) => {
                  const patient = patients.find((item) => item.id === appointment.patientId)!;
                  const dentist = users.find((item) => item.id === appointment.attendingUserId) ?? null;
                  const specialty = specialties.find((item) => item.id === appointment.specialtyId) ?? null;
                  const visitType = visitTypes.find((item) => item.id === appointment.visitTypeId) ?? null;
                  const successor = appointments.find((item) => item.rescheduledFromAppointmentId === appointment.id) ?? null;
                  const successorLabel = successor
                    ? `${formatDate(successor.scheduledStartAt)} · ${formatTimeRange(
                        successor.scheduledStartAt,
                        successor.scheduledEndAt,
                      )}`
                    : null;

                  return (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      patient={patient}
                      dentist={dentist}
                      specialty={specialty}
                      visitType={visitType}
                      rescheduleTargetLabel={successorLabel}
                      onOpen={(appointmentId) => {
                        setSelectedAppointmentId(appointmentId);
                        setDrawerOpen(true);
                      }}
                      onAction={handleAction}
                    />
                  );
                })}
              </div>
            ) : null}
          </Card>
        </div>
      </div>

      <AppointmentDetailDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        appointment={selectedAppointment}
        patient={patients.find((item) => item.id === selectedAppointment?.patientId) ?? null}
        clinicalRecord={clinicalRecords.find((item) => item.id === selectedAppointment?.clinicalRecordId) ?? null}
        clinic={clinics.find((item) => item.id === selectedAppointment?.clinicId) ?? null}
        dentist={users.find((item) => item.id === selectedAppointment?.attendingUserId) ?? null}
        specialty={specialties.find((item) => item.id === selectedAppointment?.specialtyId) ?? null}
        visitType={visitTypes.find((item) => item.id === selectedAppointment?.visitTypeId) ?? null}
        successorAppointment={appointments.find((item) => item.rescheduledFromAppointmentId === selectedAppointment?.id) ?? null}
        createdByUser={users.find((item) => item.id === selectedAppointment?.createdByUserId) ?? null}
        cancelledByUser={users.find((item) => item.id === selectedAppointment?.cancelledByUserId) ?? null}
        noShowMarkedByUser={users.find((item) => item.id === selectedAppointment?.noShowMarkedByUserId) ?? null}
        onAction={handleAction}
      />

      <CreateAppointmentModal open={createOpen} onOpenChange={setCreateOpen} />
      <RescheduleAppointmentModal
        appointment={rescheduleAppointment}
        open={!!rescheduleAppointmentId}
        onOpenChange={(open) => {
          if (!open) {
            setRescheduleAppointmentId(null);
          }
        }}
      />
    </div>
  );
}
