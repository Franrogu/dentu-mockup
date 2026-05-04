import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  MoreHorizontal,
  Plus,
  Search,
  Stethoscope,
  UserRound,
  XCircle,
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
import { cn } from "../../../components/ui/utils";
import { canOpenPatientProfile, mockGlobalWorklistVisits, mockVisitStats, mockWorklistDateLabel } from "../visits.mock";
import { formatVisitTime } from "../visit-utils";
import { MiniOdontogramPreview, PaymentStatusBadge, SummaryMetricCard, VisitStatusBadge } from "./VisitPrimitives";

const dateFilterValue = "2026-05-15";

export function VisitWorklist() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [clinicFilter, setClinicFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dentistFilter, setDentistFilter] = useState("all");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");
  const [selectedVisitId, setSelectedVisitId] = useState(mockGlobalWorklistVisits[0]?.id ?? "");

  const visits = [...mockGlobalWorklistVisits].sort(
    (left, right) => new Date(left.startedAt).getTime() - new Date(right.startedAt).getTime(),
  );
  const filteredVisits = visits.filter((visit) => {
    if (clinicFilter !== "all" && visit.clinic.id !== clinicFilter) return false;
    if (statusFilter !== "all" && visit.status !== statusFilter) return false;
    if (dentistFilter !== "all" && visit.attendingDentist.name !== dentistFilter) return false;
    if (specialtyFilter !== "all" && visit.specialty.name !== specialtyFilter) return false;

    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (normalizedSearch.length > 0 && !visit.patient.fullName.toLowerCase().includes(normalizedSearch)) return false;

    return true;
  });

  useEffect(() => {
    if (!filteredVisits.some((visit) => visit.id === selectedVisitId)) {
      setSelectedVisitId(filteredVisits[0]?.id ?? "");
    }
  }, [filteredVisits, selectedVisitId]);

  const selectedVisit = filteredVisits.find((visit) => visit.id === selectedVisitId) ?? filteredVisits[0];

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Visitas</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona y da seguimiento a las visitas de todas las clínicas.
          </p>
        </div>

        <Button className="rounded-xl bg-[#0F5F6D] hover:bg-[#0d4f5a]" onClick={() => navigate("/visitas/nueva")}>
          <Plus className="h-4 w-4" />
          Nueva visita
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryMetricCard
          title="Hoy"
          value={mockVisitStats.global.today}
          icon={CalendarDays}
          accentClassName="bg-teal-50 text-[#0F5F6D]"
        />
        <SummaryMetricCard
          title="Abiertas"
          value={mockVisitStats.global.open}
          icon={Clock3}
          accentClassName="bg-amber-50 text-amber-700"
        />
        <SummaryMetricCard
          title="Completadas"
          value={mockVisitStats.global.completed}
          icon={CheckCircle2}
          accentClassName="bg-emerald-50 text-emerald-700"
        />
        <SummaryMetricCard
          title="Canceladas"
          value={mockVisitStats.global.cancelled}
          icon={XCircle}
          accentClassName="bg-rose-50 text-rose-700"
        />
      </div>

      <Card className="rounded-2xl border-gray-200 p-4">
        <div className="grid gap-3 xl:grid-cols-[150px_190px_190px_220px_220px_minmax(0,1fr)]">
          <Select value={dateFilterValue}>
            <SelectTrigger className="h-10 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={dateFilterValue}>{mockWorklistDateLabel}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={clinicFilter} onValueChange={setClinicFilter}>
            <SelectTrigger className="h-10 rounded-xl">
              <SelectValue placeholder="Todas las clínicas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las clínicas</SelectItem>
              <SelectItem value="clinic-matriz">Clínica Matriz</SelectItem>
              <SelectItem value="clinic-satelite">Clínica Satélite</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-10 rounded-xl">
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

          <Select value={dentistFilter} onValueChange={setDentistFilter}>
            <SelectTrigger className="h-10 rounded-xl">
              <SelectValue placeholder="Todos los dentistas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los dentistas</SelectItem>
              <SelectItem value="Dr. Luis Hernández">Dr. Luis Hernández</SelectItem>
              <SelectItem value="Dra. Sofía Ramírez">Dra. Sofía Ramírez</SelectItem>
              <SelectItem value="Dra. Elena Vargas">Dra. Elena Vargas</SelectItem>
            </SelectContent>
          </Select>

          <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
            <SelectTrigger className="h-10 rounded-xl">
              <SelectValue placeholder="Todas las especialidades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las especialidades</SelectItem>
              <SelectItem value="Odontología general">Odontología general</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar paciente"
              className="h-10 rounded-xl pl-9"
            />
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_420px]">
        <Card className="overflow-hidden rounded-2xl border-gray-200">
          <div className="grid grid-cols-[84px_1.8fr_1.25fr_1.35fr_1.1fr_0.95fr] gap-3 border-b border-gray-200 bg-gray-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <span>Hora</span>
            <span>Paciente</span>
            <span>Clínica</span>
            <span>Tratante</span>
            <span>Tipo</span>
            <span>Estado</span>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredVisits.map((visit) => (
              <button
                key={visit.id}
                type="button"
                onClick={() => setSelectedVisitId(visit.id)}
                className={cn(
                  "grid w-full grid-cols-[84px_1.8fr_1.25fr_1.35fr_1.1fr_0.95fr] gap-3 px-5 py-4 text-left transition-colors hover:bg-gray-50",
                  selectedVisit?.id === visit.id ? "bg-teal-50/70" : "bg-white",
                )}
              >
                <div className="text-sm font-semibold text-gray-900">{formatVisitTime(visit.startedAt).replace(" AM", "").replace(" PM", "")}</div>

                <div className="min-w-0">
                  <p className="truncate font-medium text-gray-900">{visit.patient.fullName}</p>
                  <p className="text-sm text-gray-500">{visit.patient.age} años</p>
                </div>

                <div className="text-sm text-gray-600">{visit.clinic.name}</div>
                <div className="text-sm text-gray-600">{visit.attendingDentist.name}</div>
                <div className="text-sm text-gray-600">{visit.visitType.label}</div>
                <div>
                  <VisitStatusBadge status={visit.status} />
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card className="rounded-2xl border-gray-200 p-5 xl:sticky xl:top-8 xl:self-start">
          {selectedVisit ? (
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <VisitStatusBadge status={selectedVisit.status} />
                  <p className="text-sm text-gray-500">Hoy, {mockWorklistDateLabel} · {formatVisitTime(selectedVisit.startedAt)}</p>
                </div>
                <Button variant="ghost" size="icon" className="rounded-xl">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0F5F6D] text-sm font-semibold text-white">
                    {selectedVisit.patient.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900">{selectedVisit.patient.fullName}</p>
                    <p className="mt-1 text-sm text-gray-500">
                      {selectedVisit.patient.age} años · {selectedVisit.patient.sex}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">{selectedVisit.patient.recordNumber}</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Clínica</p>
                  <p className="mt-2 text-sm text-gray-800">{selectedVisit.clinic.name}</p>
                </div>
                <div className="rounded-2xl border border-gray-200 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Dentista tratante</p>
                  <p className="mt-2 text-sm text-gray-800">{selectedVisit.attendingDentist.name}</p>
                </div>
                <div className="rounded-2xl border border-gray-200 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Especialidad</p>
                  <p className="mt-2 text-sm text-gray-800">{selectedVisit.specialty.name}</p>
                </div>
                <div className="rounded-2xl border border-gray-200 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Tipo</p>
                  <p className="mt-2 text-sm text-gray-800">{selectedVisit.visitType.label}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Motivo de la visita</p>
                  <p className="mt-2 text-sm leading-6 text-gray-700">{selectedVisit.reasonForVisit}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Queja principal</p>
                  <p className="mt-2 text-sm leading-6 text-gray-700">{selectedVisit.chiefComplaint || "—"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Diagnóstico</p>
                  <p className="mt-2 text-sm leading-6 text-gray-700">{selectedVisit.diagnosisNotes || "—"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Procedimientos planificados</p>
                  <p className="mt-2 text-sm leading-6 text-gray-700">{selectedVisit.proceduresSummary || "—"}</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Condiciones detectadas</p>
                  <p className="mt-2 text-sm text-gray-800">{selectedVisit.related.conditionsCount} condición</p>
                </div>
                <div className="rounded-2xl border border-gray-200 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Adjuntos</p>
                  <p className="mt-2 text-sm text-gray-800">{selectedVisit.related.attachmentsCount} archivos</p>
                </div>
                <div className="rounded-2xl border border-gray-200 p-3 sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Odontograma</p>
                  <div className="mt-3">
                    <MiniOdontogramPreview
                      compact
                      highlightedTeeth={selectedVisit.related.odontogramTeeth}
                      label={selectedVisit.related.odontogramLabel}
                    />
                  </div>
                </div>
                <div className="rounded-2xl border border-gray-200 p-3 sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Pago asociado</p>
                  <div className="mt-2 flex items-center gap-2">
                    {selectedVisit.related.paymentStatus ? <PaymentStatusBadge status={selectedVisit.related.paymentStatus} /> : null}
                    <span className="text-sm font-medium text-gray-800">{selectedVisit.related.paymentAmount || "Sin pago registrado"}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={canOpenPatientProfile(selectedVisit) ? () => navigate(`/pacientes/${selectedVisit.patient.routeId}?tab=historia-clinica`) : undefined}
                >
                  <UserRound className="h-4 w-4" />
                  Ver paciente
                </Button>
                <Button
                  className="rounded-xl bg-[#0F5F6D] hover:bg-[#0d4f5a]"
                  onClick={() => navigate(`/visitas/${selectedVisit.id}/editar`)}
                >
                  <Stethoscope className="h-4 w-4" />
                  Continuar visita
                </Button>
                <Button variant="ghost" size="icon" className="rounded-xl">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
                <p>Creada: {mockWorklistDateLabel}, 09:45 AM por {selectedVisit.createdByUser}</p>
                <p className="mt-1">Última actualización: {mockWorklistDateLabel}, 09:45 AM por {selectedVisit.updatedByUser}</p>
              </div>
            </div>
          ) : (
            <div className="py-10 text-center">
              <p className="text-sm text-gray-500">No hay visitas que coincidan con el filtro actual.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
