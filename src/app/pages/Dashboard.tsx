import { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Calendar, Users, Stethoscope, TrendingUp, Clock, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { ClinicBadge } from "../components/ClinicBadge";
import { getClinicColor } from "../constants/clinics";
import { cn } from "../components/ui/utils";

const mockClinics = [
  {
    id: 1,
    name: "Centro",
    fullName: "Clínica Del Valle Centro",
    colorKey: "teal" as const,
    appointmentsToday: 5,
    completed: 4,
    newPatients: 1,
    completionRate: 80,
  },
  {
    id: 2,
    name: "Norte",
    fullName: "Clínica Del Valle Norte",
    colorKey: "violet" as const,
    appointmentsToday: 4,
    completed: 3,
    newPatients: 1,
    completionRate: 75,
  },
  {
    id: 3,
    name: "Sur",
    fullName: "Clínica Del Valle Sur",
    colorKey: "amber" as const,
    appointmentsToday: 3,
    completed: 1,
    newPatients: 1,
    completionRate: 33,
  },
];

const mockAgenda = [
  { time: "09:00", patient: "Juan Pérez", dentist: "Dr. García", specialty: "Ortodoncia", status: "Confirmada", clinic: mockClinics[0] },
  { time: "09:00", patient: "Ana Martínez", dentist: "Dra. López", specialty: "General", status: "Programada", clinic: mockClinics[1] },
  { time: "09:30", patient: "Carlos Ruiz", dentist: "Dr. Mendez", specialty: "Endodoncia", status: "En consulta", clinic: mockClinics[2] },
  { time: "10:00", patient: "María García", dentist: "Dr. García", specialty: "General", status: "Confirmada", clinic: mockClinics[0] },
];

export function Dashboard() {
  const [metricsExpanded, setMetricsExpanded] = useState(false);
  const [clinicFilter, setClinicFilter] = useState<number | "all">("all");

  const totalAppointments = mockClinics.reduce((sum, c) => sum + c.appointmentsToday, 0);
  const totalCompleted = mockClinics.reduce((sum, c) => sum + c.completed, 0);
  const totalNewPatients = mockClinics.reduce((sum, c) => sum + c.newPatients, 0);

  const filteredAgenda = clinicFilter === "all" 
    ? mockAgenda 
    : mockAgenda.filter(a => a.clinic.id === clinicFilter);

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Bienvenido de vuelta, Ana</p>
      </div>

      {/* Metrics Widget - Expandable */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Resumen de hoy</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMetricsExpanded(!metricsExpanded)}
          >
            {metricsExpanded ? (
              <>
                Colapsar <ChevronUp className="w-4 h-4 ml-1" />
              </>
            ) : (
              <>
                Expandir <ChevronDown className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </div>

        {!metricsExpanded ? (
          <div className="flex items-center gap-8">
            <div>
              <p className="text-sm text-gray-600 mb-1">Citas hoy</p>
              <p className="text-3xl font-semibold text-gray-900">{totalAppointments}</p>
            </div>
            <div className="h-12 w-px bg-gray-200" />
            <div>
              <p className="text-sm text-gray-600 mb-1">Completadas</p>
              <p className="text-3xl font-semibold text-gray-900">{totalCompleted}</p>
            </div>
            <div className="h-12 w-px bg-gray-200" />
            <div>
              <p className="text-sm text-gray-600 mb-1">Nuevos pacientes</p>
              <p className="text-3xl font-semibold text-gray-900">{totalNewPatients}</p>
            </div>
            <div className="flex-1 flex justify-end">
              <Badge variant="secondary" className="text-xs">
                ● todas las clínicas
              </Badge>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Total */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">TOTAL ORG</p>
              <p className="text-gray-900">
                {totalAppointments} citas · {totalCompleted} completadas · {totalNewPatients} nuevos pacientes
              </p>
            </div>

            {/* Per clinic breakdown */}
            {mockClinics.map((clinic) => {
              const colors = getClinicColor(clinic.colorKey);
              return (
                <div key={clinic.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={cn("w-3 h-3 rounded-sm", colors.dot)} />
                    <span className="font-medium text-gray-900">{clinic.fullName}</span>
                    <Badge variant="outline" className={cn("text-xs", colors.bg, colors.text, colors.border)}>
                      {clinic.name}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 ml-5">
                    {clinic.appointmentsToday} citas · {clinic.completed} completadas · {clinic.newPatients} nuevo
                  </p>
                  <div className="ml-5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={cn("h-full", colors.dot)}
                          style={{ width: `${clinic.completionRate}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{clinic.completionRate}% completadas</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Main content */}
      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">
              Agenda de hoy — {clinicFilter === "all" ? "todas las clínicas" : mockClinics.find(c => c.id === clinicFilter)?.fullName}
            </h3>
          </div>

          {/* Filter pills */}
          {clinicFilter === "all" && (
            <div className="flex items-center gap-2 mb-4">
              <Button
                variant={clinicFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setClinicFilter("all")}
                className={clinicFilter === "all" ? "bg-[#0F5F6D] hover:bg-[#0d4f5a]" : ""}
              >
                Todas ●
              </Button>
              {mockClinics.map((clinic) => {
                const colors = getClinicColor(clinic.colorKey);
                return (
                  <Button
                    key={clinic.id}
                    variant="outline"
                    size="sm"
                    onClick={() => setClinicFilter(clinic.id)}
                    className={cn(colors.border, colors.text)}
                  >
                    <span className={cn("w-2 h-2 rounded-sm mr-1.5", colors.dot)} />
                    {clinic.name}
                  </Button>
                );
              })}
            </div>
          )}

          <div className="space-y-3">
            {filteredAgenda.map((item, i) => {
              const colors = getClinicColor(item.clinic.colorKey);
              return (
                <div key={i} className={cn("flex items-center gap-4 p-4 bg-gray-50 rounded-lg border-l-4", colors.borderLeft)}>
                  <div className="text-sm font-medium text-gray-900 w-16">{item.time}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900">{item.patient}</p>
                      {clinicFilter === "all" && (
                        <Badge variant="outline" size="sm" className={cn("text-xs", colors.bg, colors.text, colors.border)}>
                          <span className={cn("w-2 h-2 rounded-sm mr-1", colors.dot)} />
                          {item.clinic.name}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {item.dentist} · {item.specialty} · {item.status}
                    </p>
                  </div>
                  <Button size="sm" variant="outline">Ver</Button>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Estadísticas rápidas</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Citas hoy</p>
                  <p className="text-xl font-semibold text-gray-900">{totalAppointments}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Completadas</p>
                  <p className="text-xl font-semibold text-gray-900">{totalCompleted}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Nuevos pacientes</p>
                  <p className="text-xl font-semibold text-gray-900">{totalNewPatients}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Accesos rápidos</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Nueva cita
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Nuevo paciente
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}