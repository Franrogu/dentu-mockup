import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, Search, Stethoscope } from "lucide-react";
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
import { Badge } from "../../../components/ui/badge";
import { useBooking } from "../BookingContext";
import { formatDate, formatTimeRange, getPatientFullName } from "../bookingUtils";

export function VisitsPage() {
  const navigate = useNavigate();
  const { clinics, patients, specialties, users, visitTypes, visits } = useBooking();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredVisits = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return visits.filter((visit) => {
      if (statusFilter !== "all" && visit.status !== statusFilter) return false;

      if (!normalizedSearch) return true;
      const patient = patients.find((item) => item.id === visit.patientId);
      const patientName = patient ? getPatientFullName(patient).toLowerCase() : "";
      const reason = visit.reasonForVisit?.toLowerCase() ?? "";
      return patientName.includes(normalizedSearch) || reason.includes(normalizedSearch);
    });
  }, [patients, searchTerm, statusFilter, visits]);

  return (
    <div className="min-h-full bg-[#f4f7f7] p-6 md:p-8">
      <div className="mx-auto max-w-[1320px] space-y-6">
        <div className="rounded-[28px] border border-slate-200 bg-white px-6 py-5 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-slate-950">Visitas</h1>
              <p className="mt-1 text-sm text-slate-500">Visitas creadas desde el flujo de agenda interna o como mock clinico minimo.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Card className="rounded-2xl border-slate-200 p-4">
                <p className="text-sm text-slate-500">Total</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">{visits.length}</p>
              </Card>
              <Card className="rounded-2xl border-slate-200 p-4">
                <p className="text-sm text-slate-500">Abiertas</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">{visits.filter((visit) => visit.status === "open").length}</p>
              </Card>
              <Card className="rounded-2xl border-slate-200 p-4">
                <p className="text-sm text-slate-500">Completadas</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">{visits.filter((visit) => visit.status === "completed").length}</p>
              </Card>
            </div>
          </div>
        </div>

        <Card className="rounded-[28px] border-slate-200 p-5 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar paciente o motivo"
                className="h-11 rounded-2xl bg-slate-50 pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-11 w-[200px] rounded-xl">
                <SelectValue placeholder="Estado" />
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
          </div>

          <div className="mt-5 space-y-4">
            {filteredVisits.map((visit) => {
              const patient = patients.find((item) => item.id === visit.patientId);
              const clinic = clinics.find((item) => item.id === visit.clinicId);
              const dentist = users.find((item) => item.id === visit.attendingUserId);
              const specialty = specialties.find((item) => item.id === visit.specialtyId);
              const visitType = visitTypes.find((item) => item.id === visit.visitTypeId);

              return (
                <div key={visit.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-base font-semibold text-slate-900">{patient ? getPatientFullName(patient) : "Paciente"}</p>
                        <Badge variant="outline" className="rounded-full border-slate-200 bg-white text-slate-600">
                          {visit.status}
                        </Badge>
                        <Badge variant="outline" className="rounded-full border-slate-200 bg-white text-slate-600">
                          {visit.sourceType}
                        </Badge>
                      </div>

                      <div className="grid gap-2 text-sm text-slate-600 md:grid-cols-2 xl:grid-cols-4">
                        <p>{formatDate(visit.startedAt)}</p>
                        <p>{formatTimeRange(visit.startedAt, visit.endedAt || visit.startedAt)}</p>
                        <p>{clinic?.name || "Sin clinica"} · {specialty?.name || "Sin especialidad"}</p>
                        <p>{dentist?.displayName || "Sin dentista"} · {visitType?.name || "Sin tipo"}</p>
                      </div>

                      <p className="text-sm text-slate-500">{visit.reasonForVisit || "Sin motivo capturado"}</p>
                    </div>

                    <Button className="rounded-xl bg-[#0F5F6D] hover:bg-[#0d4f5a]" onClick={() => navigate(`/visitas/${visit.id}`)}>
                      Ver detalle
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}

            {filteredVisits.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <Stethoscope className="h-6 w-6" />
                </div>
                <p className="mt-4 font-medium text-slate-900">Sin visitas para este filtro</p>
                <p className="mt-1 text-sm">Ajusta el estado o la busqueda para volver a ver resultados.</p>
              </div>
            ) : null}
          </div>
        </Card>
      </div>
    </div>
  );
}
