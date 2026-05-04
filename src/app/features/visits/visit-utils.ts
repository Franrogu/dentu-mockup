import type { PaymentStatus, VisitMock, VisitStatus } from "./visits.mock";

const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

export const visitStatusMeta: Record<
  VisitStatus,
  { label: string; className: string; dotClassName: string; ringClassName: string }
> = {
  draft: {
    label: "Borrador",
    className: "border-gray-200 bg-gray-100 text-gray-700",
    dotClassName: "bg-gray-500",
    ringClassName: "border-gray-200 text-gray-500",
  },
  open: {
    label: "Abierta",
    className: "border-amber-200 bg-amber-50 text-amber-800",
    dotClassName: "bg-amber-500",
    ringClassName: "border-amber-200 text-amber-600",
  },
  completed: {
    label: "Completada",
    className: "border-emerald-200 bg-emerald-50 text-emerald-800",
    dotClassName: "bg-emerald-500",
    ringClassName: "border-emerald-200 text-emerald-600",
  },
  cancelled: {
    label: "Cancelada",
    className: "border-rose-200 bg-rose-50 text-rose-800",
    dotClassName: "bg-rose-500",
    ringClassName: "border-rose-200 text-rose-600",
  },
  voided: {
    label: "Anulada",
    className: "border-slate-300 bg-slate-100 text-slate-700",
    dotClassName: "bg-slate-500",
    ringClassName: "border-slate-300 text-slate-600",
  },
};

export const paymentStatusMeta: Record<PaymentStatus, { label: string; className: string }> = {
  pending: { label: "Pendiente", className: "border-amber-200 bg-amber-50 text-amber-800" },
  recorded: { label: "Registrado", className: "border-sky-200 bg-sky-50 text-sky-800" },
  voided: { label: "Anulado", className: "border-slate-300 bg-slate-100 text-slate-700" },
  refunded: { label: "Reembolsado", className: "border-violet-200 bg-violet-50 text-violet-800" },
  paid: { label: "Pagado", className: "border-emerald-200 bg-emerald-50 text-emerald-800" },
};

function toDate(value: string) {
  return new Date(value);
}

export function sortVisitsDesc(visits: VisitMock[]) {
  return [...visits].sort((left, right) => toDate(right.startedAt).getTime() - toDate(left.startedAt).getTime());
}

export function formatVisitDate(value: string) {
  const date = toDate(value);
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatVisitDay(value: string) {
  return String(toDate(value).getDate()).padStart(2, "0");
}

export function formatVisitMonthYear(value: string) {
  const date = toDate(value);
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatVisitTime(value: string) {
  const date = toDate(value);
  const hour = date.getHours();
  const normalizedHour = hour % 12 || 12;
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const suffix = hour >= 12 ? "PM" : "AM";
  return `${normalizedHour}:${minutes} ${suffix}`;
}

export function formatVisitDateTime(value: string) {
  return `${formatVisitDate(value)} · ${formatVisitTime(value)}`;
}

export function formatVisitTimeRange(startedAt: string, endedAt?: string) {
  if (!endedAt) return formatVisitTime(startedAt);
  return `${formatVisitTime(startedAt)} - ${formatVisitTime(endedAt)}`;
}

export function getPatientVisitCounts(visits: VisitMock[]) {
  return visits.reduce(
    (accumulator, visit) => {
      accumulator.total += 1;

      if (visit.status === "open") accumulator.open += 1;
      if (visit.status === "completed") accumulator.completed += 1;
      if (visit.status === "cancelled" || visit.status === "voided") accumulator.cancelledOrVoided += 1;

      return accumulator;
    },
    { total: 0, open: 0, completed: 0, cancelledOrVoided: 0 },
  );
}
