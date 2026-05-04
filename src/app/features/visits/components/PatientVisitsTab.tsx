import { useState } from "react";
import { useNavigate } from "react-router";
import { CalendarDays, CheckCircle2, Clock3, Filter, FolderClock, Stethoscope, XCircle } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { cn } from "../../../components/ui/utils";
import { SummaryMetricCard, VisitClinicBadge, VisitStatusBadge } from "./VisitPrimitives";
import { formatVisitDate, formatVisitTime, getPatientVisitCounts, sortVisitsDesc, visitStatusMeta } from "../visit-utils";
import { mockPatientVisits } from "../visits.mock";

const defaultDateRange = "q1-2026";

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-1 text-sm text-gray-700">{value}</p>
    </div>
  );
}

export function PatientVisitsTab() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("all");
  const [clinicFilter, setClinicFilter] = useState("all");
  const [dateRangeFilter, setDateRangeFilter] = useState(defaultDateRange);

  const visits = sortVisitsDesc(mockPatientVisits);
  const counts = getPatientVisitCounts(visits);
  const filteredVisits = visits.filter((visit) => {
    if (statusFilter !== "all" && visit.status !== statusFilter) return false;
    if (clinicFilter !== "all" && visit.clinic.id !== clinicFilter) return false;
    if (dateRangeFilter !== defaultDateRange) return false;
    return true;
  });

  const hasActiveFilters = statusFilter !== "all" || clinicFilter !== "all" || dateRangeFilter !== defaultDateRange;

  const clearFilters = () => {
    setStatusFilter("all");
    setClinicFilter("all");
    setDateRangeFilter(defaultDateRange);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Visitas del paciente</h2>
        <p className="mt-1 text-sm text-gray-500">Historial de todas las visitas y atenciones realizadas.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryMetricCard
          title="Total visitas"
          value={counts.total}
          icon={FolderClock}
          accentClassName="bg-teal-50 text-[#0F5F6D]"
        />
        <SummaryMetricCard
          title="Abiertas"
          value={counts.open}
          icon={Clock3}
          accentClassName="bg-amber-50 text-amber-700"
        />
        <SummaryMetricCard
          title="Completadas"
          value={counts.completed}
          icon={CheckCircle2}
          accentClassName="bg-emerald-50 text-emerald-700"
        />
        <SummaryMetricCard
          title="Canceladas / anuladas"
          value={counts.cancelledOrVoided}
          icon={XCircle}
          accentClassName="bg-rose-50 text-rose-700"
        />
      </div>

      <Card className="rounded-2xl border-gray-200 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Filter className="h-4 w-4" />
            <span>Filtros</span>
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-10 w-full rounded-xl lg:w-[190px]">
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="draft">Borrador</SelectItem>
              <SelectItem value="open">Abierta</SelectItem>
              <SelectItem value="completed">Completada</SelectItem>
              <SelectItem value="cancelled">Cancelada</SelectItem>
              <SelectItem value="voided">Anulada</SelectItem>
            </SelectContent>
          </Select>

          <Select value={clinicFilter} onValueChange={setClinicFilter}>
            <SelectTrigger className="h-10 w-full rounded-xl lg:w-[190px]">
              <SelectValue placeholder="Todas las clínicas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las clínicas</SelectItem>
              <SelectItem value="clinic-matriz">Clínica Matriz</SelectItem>
              <SelectItem value="clinic-satelite">Clínica Satélite</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateRangeFilter} onValueChange={setDateRangeFilter}>
            <SelectTrigger className="h-10 w-full rounded-xl lg:w-[220px]">
              <SelectValue placeholder="Rango de fechas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="q1-2026">01 Ene 2026 - 31 Mar 2026</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="ghost" className="h-10 rounded-xl lg:ml-auto" onClick={clearFilters}>
            Limpiar filtros
          </Button>
        </div>
      </Card>

      {filteredVisits.length === 0 ? (
        <Card className="rounded-2xl border-dashed border-gray-200 p-10 text-center">
          <CalendarDays className="mx-auto h-8 w-8 text-gray-300" />
          <h3 className="mt-4 text-base font-semibold text-gray-900">Sin visitas para este filtro</h3>
          <p className="mt-1 text-sm text-gray-500">Ajusta el estado o la clínica para volver a ver el historial.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredVisits.map((visit, index) => {
            const statusTone = visitStatusMeta[visit.status];
            const primaryAction =
              visit.status === "open"
                ? {
                    label: "Continuar visita",
                    onClick: () => navigate(`/visitas/${visit.id}/editar`),
                    className: "bg-[#0F5F6D] text-white hover:bg-[#0d4f5a]",
                  }
                : {
                    label: "Ver detalle",
                    onClick: () => navigate(`/visitas/${visit.id}`),
                    className: "",
                  };

            return (
              <div key={visit.id} className="relative pl-12">
                {index < filteredVisits.length - 1 ? (
                  <div className="absolute left-[15px] top-10 h-[calc(100%+16px)] w-px bg-gray-200" />
                ) : null}

                <div
                  className={cn(
                    "absolute left-0 top-6 flex h-8 w-8 items-center justify-center rounded-full border bg-white",
                    statusTone.ringClassName,
                  )}
                >
                  <Stethoscope className="h-4 w-4" />
                </div>

                <Card className="rounded-2xl border-gray-200 p-5">
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0 flex-1 space-y-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-base font-semibold text-gray-900">{formatVisitDate(visit.startedAt)}</p>
                        <Badge variant="outline" className="rounded-full border-gray-200 bg-gray-50 text-gray-600">
                          {formatVisitTime(visit.startedAt)}
                        </Badge>
                        <VisitStatusBadge status={visit.status} />
                        <Badge variant="outline" className="rounded-full border-gray-200 bg-white text-gray-700">
                          {visit.visitType.label}
                        </Badge>
                        <VisitClinicBadge clinic={visit.clinic} />
                      </div>

                      <div className="grid gap-4 md:grid-cols-3">
                        <InfoBlock label="Tratante" value={visit.attendingDentist.name} />
                        <InfoBlock label="Especialidad" value={visit.specialty.name} />
                        <InfoBlock label="Motivo" value={visit.reasonForVisit} />
                      </div>

                      <div className="grid gap-4 lg:grid-cols-3">
                        <InfoBlock label="Diagnóstico" value={visit.diagnosisNotes || "—"} />
                        <InfoBlock label="Procedimientos" value={visit.proceduresSummary || "—"} />
                        <InfoBlock
                          label="Relaciones"
                          value={`${visit.related.conditionsCount} condiciones · ${visit.related.attachmentsCount} adjuntos`}
                        />
                      </div>
                    </div>

                    <div className="flex w-full flex-col gap-2 xl:w-auto">
                      <Button
                        variant={visit.status === "open" ? "default" : "outline"}
                        className={cn("rounded-xl", primaryAction.className)}
                        onClick={primaryAction.onClick}
                      >
                        {primaryAction.label}
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      )}

      {hasActiveFilters ? (
        <p className="text-xs text-gray-400">
          Mostrando {filteredVisits.length} de {visits.length} visitas del paciente.
        </p>
      ) : null}
    </div>
  );
}
