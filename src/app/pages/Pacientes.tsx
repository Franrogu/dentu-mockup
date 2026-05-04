import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { CalendarDays, FileText, Phone, Plus, Search, ShieldAlert, UserRound } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { CreateAppointmentModal } from "../features/booking/components/CreateAppointmentModal";
import { useBooking } from "../features/booking/BookingContext";
import {
  formatDate,
  getPatientAge,
  getPatientFullName,
  getPatientInitials,
  sortAppointmentsByStart,
} from "../features/booking/bookingUtils";

export function Pacientes() {
  const navigate = useNavigate();
  const { appointments, clinicalRecords, patients } = useBooking();
  const [searchTerm, setSearchTerm] = useState("");
  const [createPatientId, setCreatePatientId] = useState<string | null>(null);

  const filteredPatients = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) {
      return patients;
    }

    return patients.filter((patient) => {
      return (
        getPatientFullName(patient).toLowerCase().includes(normalizedSearch) ||
        patient.patientCode.toLowerCase().includes(normalizedSearch) ||
        patient.phone?.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [patients, searchTerm]);

  const openRecordsCount = clinicalRecords.filter((record) => record.status === "open").length;
  const alertsCount = clinicalRecords.filter((record) => record.alertFlagsJson.length > 0).length;
  const todayAppointmentsCount = appointments.filter((appointment) => appointment.scheduledStartAt.slice(0, 10) === "2026-05-04").length;

  return (
    <div className="min-h-full bg-[#f4f7f7] p-6 md:p-8">
      <div className="mx-auto max-w-[1320px] space-y-6">
        <div className="rounded-[28px] border border-slate-200 bg-white px-6 py-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-slate-950">Pacientes</h1>
              <p className="mt-1 text-sm text-slate-500">Busca pacientes, revisa su expediente base y crea citas internas desde el mock.</p>
            </div>
            <Button className="rounded-xl bg-[#0F5F6D] hover:bg-[#0d4f5a]" onClick={() => setCreatePatientId("")}>
              <Plus className="mr-2 h-4 w-4" />
              Nueva cita
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total pacientes", value: patients.length, icon: UserRound },
            { label: "Citas hoy", value: todayAppointmentsCount, icon: CalendarDays },
            { label: "Expedientes abiertos", value: openRecordsCount, icon: FileText },
            { label: "Alertas de expediente", value: alertsCount, icon: ShieldAlert },
          ].map((metric) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.label} className="rounded-3xl border-slate-200 p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0F5F6D]/10 text-[#0F5F6D]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-slate-900">{metric.value}</p>
                    <p className="text-sm text-slate-500">{metric.label}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Card className="rounded-[28px] border-slate-200 p-5 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar por nombre, codigo o telefono"
              className="h-11 rounded-2xl bg-slate-50 pl-10"
            />
          </div>

          <div className="mt-5 space-y-4">
            {filteredPatients.map((patient) => {
              const record = clinicalRecords.find((item) => item.patientId === patient.id) ?? null;
              const nextAppointment = sortAppointmentsByStart(
                appointments.filter((appointment) =>
                  appointment.patientId === patient.id && ["draft", "scheduled", "confirmed", "checked_in"].includes(appointment.status),
                ),
              )[0] ?? null;
              const age = getPatientAge(patient.birthDate);

              return (
                <div key={patient.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0F5F6D] text-sm font-semibold text-white">
                        {getPatientInitials(patient)}
                      </div>
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-slate-900">{getPatientFullName(patient)}</h3>
                          <Badge variant="outline" className="rounded-full border-slate-200 bg-white text-slate-600">
                            {patient.status}
                          </Badge>
                          <Badge variant="outline" className="rounded-full border-slate-200 bg-white text-slate-600">
                            {patient.patientCode}
                          </Badge>
                        </div>

                        <div className="grid gap-2 text-sm text-slate-600 md:grid-cols-2 xl:grid-cols-4">
                          <p>{age ? `${age} anos` : "Edad no capturada"}</p>
                          <p className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-slate-400" />
                            {patient.phone || "Sin telefono"}
                          </p>
                          <p>{patient.email || "Sin email"}</p>
                          <p>{record?.recordNumber || "Sin expediente"}</p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                          {nextAppointment ? (
                            <>
                              <span className="font-medium text-slate-900">Proxima cita:</span>{" "}
                              {formatDate(nextAppointment.scheduledStartAt)}
                            </>
                          ) : (
                            "Sin cita activa programada"
                          )}
                        </div>

                        {record?.alertFlagsJson.length ? (
                          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                            {record.alertFlagsJson.join(" · ")}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" className="rounded-xl" onClick={() => navigate(`/pacientes/${patient.id}`)}>
                        Ver paciente
                      </Button>
                      <Button variant="outline" className="rounded-xl" onClick={() => navigate(`/pacientes/${patient.id}?tab=historia-clinica`)}>
                        Ver expediente
                      </Button>
                      <Button className="rounded-xl bg-[#0F5F6D] hover:bg-[#0d4f5a]" onClick={() => setCreatePatientId(patient.id)}>
                        Nueva cita
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredPatients.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500">
                No se encontraron pacientes para esta busqueda.
              </div>
            ) : null}
          </div>
        </Card>
      </div>

      <CreateAppointmentModal
        open={createPatientId !== null}
        initialPatientId={createPatientId || undefined}
        onOpenChange={(open) => {
          if (!open) {
            setCreatePatientId(null);
          }
        }}
      />
    </div>
  );
}
