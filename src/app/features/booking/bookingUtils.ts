import type {
  Appointment,
  AppointmentActionKey,
  AppointmentStatus,
  Clinic,
  ClinicBookingSettings,
  Patient,
  WorkingHours,
} from "./bookingTypes";

export const activeAppointmentStatuses: AppointmentStatus[] = ["scheduled", "confirmed", "checked_in"];

export const appointmentStatusMeta: Record<
  AppointmentStatus,
  { label: string; badgeClassName: string; cardClassName: string }
> = {
  draft: {
    label: "Borrador",
    badgeClassName: "border-gray-200 bg-gray-100 text-gray-700",
    cardClassName: "border-l-gray-300",
  },
  scheduled: {
    label: "Programada",
    badgeClassName: "border-sky-200 bg-sky-50 text-sky-700",
    cardClassName: "border-l-sky-400",
  },
  confirmed: {
    label: "Confirmada",
    badgeClassName: "border-teal-200 bg-teal-50 text-teal-700",
    cardClassName: "border-l-teal-500",
  },
  checked_in: {
    label: "Ingreso registrado",
    badgeClassName: "border-amber-200 bg-amber-50 text-amber-700",
    cardClassName: "border-l-amber-400",
  },
  completed: {
    label: "Completada",
    badgeClassName: "border-emerald-200 bg-emerald-50 text-emerald-700",
    cardClassName: "border-l-emerald-500",
  },
  cancelled: {
    label: "Cancelada",
    badgeClassName: "border-rose-200 bg-rose-50 text-rose-700",
    cardClassName: "border-l-rose-400",
  },
  no_show: {
    label: "No asistio",
    badgeClassName: "border-slate-200 bg-slate-100 text-slate-700",
    cardClassName: "border-l-slate-400",
  },
  rescheduled: {
    label: "Reagendada",
    badgeClassName: "border-indigo-200 bg-indigo-50 text-indigo-700",
    cardClassName: "border-l-indigo-400",
  },
};

export const appointmentActionLabels: Record<AppointmentActionKey, string> = {
  confirm: "Confirmar",
  check_in: "Check-in",
  start_visit: "Iniciar visita",
  reschedule: "Reagendar",
  cancel: "Cancelar cita",
  mark_no_show: "Marcar no asistio",
  view_visit: "Ver visita",
  view_patient: "Ver paciente",
  view_successor: "Ver nueva cita",
};

export function getAvailableAppointmentActions(appointment: Appointment): AppointmentActionKey[] {
  switch (appointment.status) {
    case "scheduled":
      return ["confirm", "reschedule", "cancel", "mark_no_show", "view_patient"];
    case "confirmed":
      return ["start_visit", "reschedule", "cancel", "mark_no_show", "view_patient"];
    case "checked_in":
      return ["start_visit", "view_patient"];
    case "completed":
      return ["view_visit", "view_patient"];
    case "cancelled":
      return ["reschedule", "view_patient"];
    case "no_show":
      return ["reschedule", "view_patient"];
    case "rescheduled":
      return ["view_successor", "view_patient"];
    case "draft":
    default:
      return ["reschedule", "view_patient"];
  }
}

export function getPatientFullName(patient: Patient) {
  return [patient.firstName, patient.lastName, patient.secondLastName].filter(Boolean).join(" ");
}

export function getPatientInitials(patient: Patient) {
  return [patient.firstName, patient.lastName]
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function getPatientAge(birthDate: string | null) {
  if (!birthDate) return null;

  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const hasBirthdayPassed =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());

  if (!hasBirthdayPassed) {
    age -= 1;
  }

  return age;
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-MX", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function formatDateLong(value: string) {
  return new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export function formatTime(value: string) {
  return new Intl.DateTimeFormat("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value));
}

export function formatTimeRange(startAt: string, endAt: string) {
  return `${formatTime(startAt)} - ${formatTime(endAt)}`;
}

export function getDurationMinutes(startAt: string, endAt: string) {
  const start = new Date(startAt).getTime();
  const end = new Date(endAt).getTime();
  return Math.round((end - start) / 60000);
}

export function toDateInputValue(value: string) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function toTimeInputValue(value: string) {
  const date = new Date(value);
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function buildDateTimeIso(dateValue: string, timeValue: string) {
  return `${dateValue}T${timeValue}:00-06:00`;
}

export function addMinutesToIso(startAt: string, minutes: number) {
  const next = new Date(startAt);
  next.setMinutes(next.getMinutes() + minutes);
  return next.toISOString();
}

export function addMinutesToTimeValue(timeValue: string, minutes: number) {
  const [hours, mins] = timeValue.split(":").map(Number);
  const totalMinutes = hours * 60 + mins + minutes;
  const normalizedMinutes = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const nextHours = `${Math.floor(normalizedMinutes / 60)}`.padStart(2, "0");
  const nextMinutes = `${normalizedMinutes % 60}`.padStart(2, "0");
  return `${nextHours}:${nextMinutes}`;
}

export function isSameDay(left: string, right: string) {
  return toDateInputValue(left) === toDateInputValue(right);
}

export function sortAppointmentsByStart(appointments: Appointment[]) {
  return [...appointments].sort(
    (left, right) => new Date(left.scheduledStartAt).getTime() - new Date(right.scheduledStartAt).getTime(),
  );
}

export function sortAppointmentsByNewest(appointments: Appointment[]) {
  return [...appointments].sort(
    (left, right) => new Date(right.scheduledStartAt).getTime() - new Date(left.scheduledStartAt).getTime(),
  );
}

export function doesRangeOverlap(startA: string, endA: string, startB: string, endB: string) {
  const aStart = new Date(startA).getTime();
  const aEnd = new Date(endA).getTime();
  const bStart = new Date(startB).getTime();
  const bEnd = new Date(endB).getTime();
  return aStart < bEnd && bStart < aEnd;
}

export function findOverlappingAppointment(
  appointments: Appointment[],
  attendingUserId: string | null,
  scheduledStartAt: string,
  scheduledEndAt: string,
  excludeAppointmentId?: string,
) {
  if (!attendingUserId) {
    return null;
  }

  return appointments.find((appointment) => {
    if (appointment.id === excludeAppointmentId) return false;
    if (appointment.attendingUserId !== attendingUserId) return false;
    if (!activeAppointmentStatuses.includes(appointment.status)) return false;
    return doesRangeOverlap(
      appointment.scheduledStartAt,
      appointment.scheduledEndAt,
      scheduledStartAt,
      scheduledEndAt,
    );
  });
}

export function getDayKeyFromDateValue(dateValue: string) {
  const day = new Date(`${dateValue}T12:00:00-06:00`).getDay();
  return ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][day];
}

export function getClinicCapacity(
  settingsList: ClinicBookingSettings[],
  appointments: Appointment[],
  clinicId: string | "all",
  dateValue: string,
) {
  const relevantSettings =
    clinicId === "all" ? settingsList : settingsList.filter((setting) => setting.clinicId === clinicId);
  const relevantAppointments = appointments.filter((appointment) => {
    if (clinicId !== "all" && appointment.clinicId !== clinicId) return false;
    if (!isSameDay(appointment.scheduledStartAt, `${dateValue}T12:00:00-06:00`)) return false;
    return activeAppointmentStatuses.includes(appointment.status) || appointment.status === "completed";
  });

  const totalSlots = relevantSettings.reduce((sum, setting) => {
    return sum + getSlotsForDay(setting.workingHoursJson, dateValue, setting.defaultSlotDurationMinutes);
  }, 0);

  return {
    occupied: relevantAppointments.length,
    totalSlots,
    percentage: totalSlots > 0 ? Math.round((relevantAppointments.length / totalSlots) * 100) : 0,
  };
}

export function getSlotsForDay(workingHours: WorkingHours, dateValue: string, slotDurationMinutes: number) {
  const rule = workingHours[getDayKeyFromDateValue(dateValue)];
  if (!rule || !rule.enabled) {
    return 0;
  }

  const [startHour, startMinute] = rule.start.split(":").map(Number);
  const [endHour, endMinute] = rule.end.split(":").map(Number);
  const totalMinutes = endHour * 60 + endMinute - (startHour * 60 + startMinute);
  return Math.max(0, Math.floor(totalMinutes / slotDurationMinutes));
}

export function getDateLabel(dateValue: string) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${dateValue}T12:00:00-06:00`));
}

export function getShortDateLabel(dateValue: string) {
  return new Intl.DateTimeFormat("es-MX", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(`${dateValue}T12:00:00-06:00`));
}

export function getAppointmentDaySummary(appointments: Appointment[], dateValue: string) {
  const todaysAppointments = appointments.filter((appointment) => isSameDay(appointment.scheduledStartAt, `${dateValue}T12:00:00-06:00`));

  return {
    scheduled: todaysAppointments.filter((appointment) => appointment.status === "scheduled").length,
    readyToStart: todaysAppointments.filter((appointment) => appointment.status === "confirmed" || appointment.status === "checked_in").length,
    completed: todaysAppointments.filter((appointment) => appointment.status === "completed").length,
    noShow: todaysAppointments.filter((appointment) => appointment.status === "no_show").length,
    total: todaysAppointments.length,
  };
}

export function getUpcomingActionCounts(appointments: Appointment[], dateValue: string) {
  const todaysAppointments = appointments.filter((appointment) => isSameDay(appointment.scheduledStartAt, `${dateValue}T12:00:00-06:00`));

  return {
    pendingConfirmation: todaysAppointments.filter((appointment) => appointment.status === "scheduled").length,
    noShowFollowUp: todaysAppointments.filter((appointment) => appointment.status === "no_show").length,
    readyToStart: todaysAppointments.filter((appointment) => appointment.status === "confirmed" || appointment.status === "checked_in").length,
  };
}

export function getClinicLabel(clinic: Clinic) {
  return `${clinic.name} · ${clinic.code}`;
}
