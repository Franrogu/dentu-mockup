import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createInitialBookingState } from "./mockData";
import { findOverlappingAppointment } from "./bookingUtils";
import type {
  Appointment,
  BookingMockState,
  ClinicBookingSettings,
  CreateAppointmentInput,
  MutationResult,
  RescheduleAppointmentInput,
  UpdateBookingSettingsInput,
  Visit,
} from "./bookingTypes";

interface BookingContextValue extends BookingMockState {
  currentUser: BookingMockState["users"][number];
  createAppointment: (input: CreateAppointmentInput) => MutationResult<Appointment>;
  confirmAppointment: (appointmentId: string) => MutationResult<Appointment>;
  checkInAppointment: (appointmentId: string) => MutationResult<Appointment>;
  startVisitFromAppointment: (appointmentId: string) => MutationResult<{ appointment: Appointment; visit: Visit }>;
  cancelAppointment: (appointmentId: string, reason: string) => MutationResult<Appointment>;
  markNoShow: (appointmentId: string, reason: string) => MutationResult<Appointment>;
  rescheduleAppointment: (input: RescheduleAppointmentInput) => MutationResult<{
    originalAppointment: Appointment;
    newAppointment: Appointment;
  }>;
  saveBookingSettings: (input: UpdateBookingSettingsInput) => MutationResult<ClinicBookingSettings>;
}

const BookingContext = createContext<BookingContextValue | null>(null);

function nowIso() {
  return new Date().toISOString();
}

function ensureBaseAppointmentRules(
  state: BookingMockState,
  input: CreateAppointmentInput,
  excludeAppointmentId?: string,
) {
  if (!input.patientId) {
    return "Selecciona un paciente.";
  }

  if (!input.clinicalRecordId) {
    return "La cita requiere un expediente.";
  }

  if (!input.clinicId) {
    return "Selecciona una clinica.";
  }

  if (!input.scheduledStartAt || !input.scheduledEndAt) {
    return "Selecciona fecha y horario.";
  }

  if (new Date(input.scheduledEndAt).getTime() <= new Date(input.scheduledStartAt).getTime()) {
    return "La hora final debe ser mayor a la hora inicial.";
  }

  const record = state.clinicalRecords.find((item) => item.id === input.clinicalRecordId);
  if (!record) {
    return "No se encontro el expediente seleccionado.";
  }

  if (record.status === "archived") {
    return "El expediente esta archivado y no permite nuevas citas.";
  }

  const overlappingAppointment = findOverlappingAppointment(
    state.appointments,
    input.attendingUserId,
    input.scheduledStartAt,
    input.scheduledEndAt,
    excludeAppointmentId,
  );

  if (overlappingAppointment) {
    return "El dentista ya tiene una cita activa que se empalma con ese horario.";
  }

  return null;
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BookingMockState>(() => createInitialBookingState());

  const value = useMemo<BookingContextValue>(() => {
    const currentUser = state.users.find((user) => user.id === state.currentUserId) ?? state.users[0];

    return {
      ...state,
      currentUser,
      createAppointment: (input) => {
        const error = ensureBaseAppointmentRules(state, input);
        if (error) {
          return { ok: false, error };
        }

        const timestamp = nowIso();
        const appointment: Appointment = {
          id: crypto.randomUUID(),
          orgId: state.organization.id,
          clinicId: input.clinicId,
          patientId: input.patientId,
          clinicalRecordId: input.clinicalRecordId,
          createdByUserId: state.currentUserId,
          updatedByUserId: state.currentUserId,
          attendingUserId: input.attendingUserId,
          specialtyId: input.specialtyId,
          visitTypeId: input.visitTypeId,
          visitId: null,
          rescheduledFromAppointmentId: null,
          bookingSource: "internal",
          status: "scheduled",
          scheduledStartAt: input.scheduledStartAt,
          scheduledEndAt: input.scheduledEndAt,
          reasonForVisit: input.reasonForVisit,
          patientNotes: input.patientNotes,
          internalNotes: input.internalNotes,
          confirmedAt: null,
          checkedInAt: null,
          completedAt: null,
          cancelledAt: null,
          cancelledByUserId: null,
          cancellationReason: null,
          noShowMarkedAt: null,
          noShowMarkedByUserId: null,
          noShowReason: null,
          externalReference: null,
          metadataJson: {},
          createdAt: timestamp,
          updatedAt: timestamp,
        };

        setState((previousState) => ({
          ...previousState,
          appointments: [...previousState.appointments, appointment],
        }));

        return { ok: true, data: appointment };
      },
      confirmAppointment: (appointmentId) => {
        const appointment = state.appointments.find((item) => item.id === appointmentId);
        if (!appointment) {
          return { ok: false, error: "No se encontro la cita." };
        }

        if (appointment.status !== "scheduled") {
          return { ok: false, error: "Solo las citas programadas se pueden confirmar." };
        }

        const confirmedAt = nowIso();
        const nextAppointment = {
          ...appointment,
          status: "confirmed" as const,
          confirmedAt,
          updatedAt: confirmedAt,
          updatedByUserId: state.currentUserId,
        };

        setState((previousState) => ({
          ...previousState,
          appointments: previousState.appointments.map((item) => (item.id === appointmentId ? nextAppointment : item)),
        }));

        return { ok: true, data: nextAppointment };
      },
      checkInAppointment: (appointmentId) => {
        const appointment = state.appointments.find((item) => item.id === appointmentId);
        if (!appointment) {
          return { ok: false, error: "No se encontro la cita." };
        }

        if (appointment.status !== "confirmed") {
          return { ok: false, error: "Solo las citas confirmadas permiten check-in." };
        }

        const checkedInAt = nowIso();
        const nextAppointment = {
          ...appointment,
          status: "checked_in" as const,
          checkedInAt,
          updatedAt: checkedInAt,
          updatedByUserId: state.currentUserId,
        };

        setState((previousState) => ({
          ...previousState,
          appointments: previousState.appointments.map((item) => (item.id === appointmentId ? nextAppointment : item)),
        }));

        return { ok: true, data: nextAppointment };
      },
      startVisitFromAppointment: (appointmentId) => {
        const appointment = state.appointments.find((item) => item.id === appointmentId);
        if (!appointment) {
          return { ok: false, error: "No se encontro la cita." };
        }

        if (!["confirmed", "checked_in"].includes(appointment.status)) {
          return { ok: false, error: "Solo las citas confirmadas pueden iniciar visita." };
        }

        if (appointment.status === "cancelled" || appointment.status === "no_show" || appointment.status === "rescheduled") {
          return { ok: false, error: "La cita no puede iniciar visita en su estado actual." };
        }

        const timestamp = nowIso();
        const checkedInAt = appointment.checkedInAt ?? timestamp;
        const visit: Visit = {
          id: crypto.randomUUID(),
          orgId: appointment.orgId,
          clinicId: appointment.clinicId,
          patientId: appointment.patientId,
          clinicalRecordId: appointment.clinicalRecordId,
          createdByUserId: state.currentUserId,
          attendingUserId: appointment.attendingUserId,
          specialtyId: appointment.specialtyId,
          visitTypeId: appointment.visitTypeId,
          reasonForVisit: appointment.reasonForVisit,
          startedAt: checkedInAt,
          endedAt: null,
          status: "open",
          sourceType: "appointment",
          createdAt: timestamp,
          updatedAt: timestamp,
        };

        const nextAppointment: Appointment = {
          ...appointment,
          visitId: visit.id,
          status: "completed",
          checkedInAt,
          completedAt: timestamp,
          updatedAt: timestamp,
          updatedByUserId: state.currentUserId,
        };

        setState((previousState) => ({
          ...previousState,
          visits: [...previousState.visits, visit],
          appointments: previousState.appointments.map((item) => (item.id === appointmentId ? nextAppointment : item)),
        }));

        return { ok: true, data: { appointment: nextAppointment, visit } };
      },
      cancelAppointment: (appointmentId, reason) => {
        const appointment = state.appointments.find((item) => item.id === appointmentId);
        if (!appointment) {
          return { ok: false, error: "No se encontro la cita." };
        }

        if (!["scheduled", "confirmed"].includes(appointment.status)) {
          return { ok: false, error: "Solo las citas programadas o confirmadas se pueden cancelar." };
        }

        if (appointment.visitId) {
          return { ok: false, error: "No se puede cancelar una cita que ya genero visita." };
        }

        const cancelledAt = nowIso();
        const nextAppointment: Appointment = {
          ...appointment,
          status: "cancelled",
          cancelledAt,
          cancelledByUserId: state.currentUserId,
          cancellationReason: reason,
          updatedAt: cancelledAt,
          updatedByUserId: state.currentUserId,
        };

        setState((previousState) => ({
          ...previousState,
          appointments: previousState.appointments.map((item) => (item.id === appointmentId ? nextAppointment : item)),
        }));

        return { ok: true, data: nextAppointment };
      },
      markNoShow: (appointmentId, reason) => {
        const appointment = state.appointments.find((item) => item.id === appointmentId);
        if (!appointment) {
          return { ok: false, error: "No se encontro la cita." };
        }

        if (!["scheduled", "confirmed"].includes(appointment.status)) {
          return { ok: false, error: "Solo las citas programadas o confirmadas permiten no-show." };
        }

        if (appointment.visitId) {
          return { ok: false, error: "No se puede marcar no-show si la cita ya tiene visita." };
        }

        const noShowMarkedAt = nowIso();
        const nextAppointment: Appointment = {
          ...appointment,
          status: "no_show",
          noShowMarkedAt,
          noShowMarkedByUserId: state.currentUserId,
          noShowReason: reason,
          updatedAt: noShowMarkedAt,
          updatedByUserId: state.currentUserId,
        };

        setState((previousState) => ({
          ...previousState,
          appointments: previousState.appointments.map((item) => (item.id === appointmentId ? nextAppointment : item)),
        }));

        return { ok: true, data: nextAppointment };
      },
      rescheduleAppointment: (input) => {
        const appointment = state.appointments.find((item) => item.id === input.appointmentId);
        if (!appointment) {
          return { ok: false, error: "No se encontro la cita original." };
        }

        if (appointment.visitId || appointment.status === "completed" || appointment.status === "checked_in") {
          return { ok: false, error: "La cita actual no puede reagendarse desde este estado." };
        }

        const error = ensureBaseAppointmentRules(
          state,
          {
            clinicId: appointment.clinicId,
            patientId: appointment.patientId,
            clinicalRecordId: appointment.clinicalRecordId,
            attendingUserId: appointment.attendingUserId,
            specialtyId: appointment.specialtyId,
            visitTypeId: appointment.visitTypeId,
            scheduledStartAt: input.scheduledStartAt,
            scheduledEndAt: input.scheduledEndAt,
            reasonForVisit: appointment.reasonForVisit,
            patientNotes: appointment.patientNotes,
            internalNotes: appointment.internalNotes,
          },
          appointment.id,
        );

        if (error) {
          return { ok: false, error };
        }

        const timestamp = nowIso();
        const originalAppointment: Appointment = {
          ...appointment,
          status: "rescheduled",
          updatedAt: timestamp,
          updatedByUserId: state.currentUserId,
          internalNotes: [appointment.internalNotes, input.changeReason ? `Reagenda: ${input.changeReason}` : null]
            .filter(Boolean)
            .join(" · "),
        };

        const newAppointment: Appointment = {
          ...appointment,
          id: crypto.randomUUID(),
          rescheduledFromAppointmentId: appointment.id,
          status: "scheduled",
          scheduledStartAt: input.scheduledStartAt,
          scheduledEndAt: input.scheduledEndAt,
          visitId: null,
          confirmedAt: null,
          checkedInAt: null,
          completedAt: null,
          cancelledAt: null,
          cancelledByUserId: null,
          cancellationReason: null,
          noShowMarkedAt: null,
          noShowMarkedByUserId: null,
          noShowReason: null,
          externalReference: null,
          createdByUserId: state.currentUserId,
          updatedByUserId: state.currentUserId,
          createdAt: timestamp,
          updatedAt: timestamp,
          internalNotes: [appointment.internalNotes, input.changeReason ? `Motivo del cambio: ${input.changeReason}` : null]
            .filter(Boolean)
            .join(" · "),
        };

        setState((previousState) => ({
          ...previousState,
          appointments: previousState.appointments
            .map((item) => (item.id === appointment.id ? originalAppointment : item))
            .concat(newAppointment),
        }));

        return { ok: true, data: { originalAppointment, newAppointment } };
      },
      saveBookingSettings: (input) => {
        const currentSettings = state.settings.find((setting) => setting.clinicId === input.clinicId);
        if (!currentSettings) {
          return { ok: false, error: "No se encontro la configuracion de la clinica." };
        }

        if (input.defaultSlotDurationMinutes < 5 || input.defaultSlotDurationMinutes > 480) {
          return { ok: false, error: "La duracion por defecto debe estar entre 5 y 480 minutos." };
        }

        if (input.maxDaysAhead < 1 || input.maxDaysAhead > 730) {
          return { ok: false, error: "El maximo de dias debe estar entre 1 y 730." };
        }

        const nextSettings: ClinicBookingSettings = {
          ...currentSettings,
          ...input,
          updatedAt: nowIso(),
        };

        setState((previousState) => ({
          ...previousState,
          settings: previousState.settings.map((setting) =>
            setting.clinicId === input.clinicId ? nextSettings : setting,
          ),
        }));

        return { ok: true, data: nextSettings };
      },
    };
  }, [state]);

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within BookingProvider");
  }

  return context;
}
