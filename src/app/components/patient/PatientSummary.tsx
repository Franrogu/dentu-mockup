import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Calendar, FileText, DollarSign, AlertTriangle, Droplets, Pill, ChevronRight } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import type { MockPatient, MockCondition, MockMedication } from "./types";
import { scopeColors, scopeLabels, severityColors, severityLabels, medicationStatusColors, medicationStatusLabels } from "./types";

interface PatientSummaryProps {
  patient: MockPatient;
  conditions: MockCondition[];
  medications: MockMedication[];
}

const mockRecentVisits = [
  { id: 1, date: "20 Mar 2026", type: "Ajuste de brackets", clinic: "Centro", status: "completed" },
  { id: 2, date: "15 Mar 2026", type: "Consulta de rutina", clinic: "Norte", status: "completed" },
  { id: 3, date: "10 Mar 2026", type: "Tratamiento de conducto", clinic: "Centro", status: "completed" },
];

export function PatientSummary({ patient, conditions, medications }: PatientSummaryProps) {
  const navigate = useNavigate();
  const { id } = useParams();

  const activeConditions = conditions.filter((c) => c.status !== "resolved");
  const highRiskConditions = activeConditions.filter(
    (c) => c.severityLevel === "high" || c.severityLevel === "critical"
  );
  const currentMedications = medications.filter((m) => m.status === "current");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main column */}
      <div className="lg:col-span-2 space-y-6">

        {/* Clinical snapshot */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Resumen clínico</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate(`/pacientes/${id}?tab=expediente`)}>
              <FileText className="w-4 h-4 mr-1.5" />
              Ver expediente
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Tipo de sangre</p>
              <div className="flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-red-500" />
                <p className="font-bold text-gray-900">{patient.bloodType}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Estado del expediente</p>
              <Badge
                variant="outline"
                className={
                  patient.recordStatus === "open"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 text-xs"
                    : "bg-gray-100 text-gray-600 border-gray-200 text-xs"
                }
              >
                {patient.recordStatus === "open" ? "Abierto" : "Archivado"}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Condiciones activas</p>
              <p className="font-semibold text-gray-900">{activeConditions.length}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Medicamentos actuales</p>
              <p className="font-semibold text-gray-900">{currentMedications.length}</p>
            </div>
          </div>

          {patient.clinicalSummary && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Notas del expediente</p>
              <p className="text-sm text-gray-700 leading-relaxed">{patient.clinicalSummary}</p>
            </div>
          )}
        </Card>

        {/* High risk / alerts */}
        {highRiskConditions.length > 0 && (
          <Card className="p-6 border-orange-200 bg-orange-50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <h2 className="text-base font-semibold text-orange-900">Alertas clínicas activas</h2>
              </div>
              <Button variant="ghost" size="sm" className="text-orange-700 hover:bg-orange-100"
                onClick={() => navigate(`/pacientes/${id}?tab=condiciones`)}>
                Ver todas →
              </Button>
            </div>
            <div className="space-y-2">
              {highRiskConditions.map((c) => (
                <div key={c.id} className="bg-white border border-orange-200 rounded-lg p-3 flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className={`text-xs ${scopeColors[c.scope]}`}>
                        {scopeLabels[c.scope]}
                      </Badge>
                      {c.severityLevel && (
                        <Badge variant="outline" className={`text-xs font-semibold ${severityColors[c.severityLevel]}`}>
                          {severityLabels[c.severityLevel]}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-900">{c.name}</p>
                    {c.notes && <p className="text-xs text-gray-500 mt-0.5">{c.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Active conditions (non-high-risk) */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Condiciones activas</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate(`/pacientes/${id}?tab=condiciones`)}>
              Ver todas →
            </Button>
          </div>
          {activeConditions.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">Sin condiciones activas registradas.</p>
          ) : (
            <div className="space-y-2">
              {activeConditions.slice(0, 5).map((c) => (
                <div key={c.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className={`text-xs ${scopeColors[c.scope]}`}>
                      {scopeLabels[c.scope]}
                    </Badge>
                    <span className="text-sm text-gray-800">{c.name}</span>
                  </div>
                  {c.severityLevel && (
                    <Badge variant="outline" className={`text-xs ml-2 flex-shrink-0 ${severityColors[c.severityLevel]}`}>
                      {severityLabels[c.severityLevel]}
                    </Badge>
                  )}
                </div>
              ))}
              {activeConditions.length > 5 && (
                <p className="text-xs text-gray-400 pt-1">
                  +{activeConditions.length - 5} más
                </p>
              )}
            </div>
          )}
        </Card>

        {/* Current medications */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Pill className="w-4 h-4 text-gray-500" />
              <h2 className="text-lg font-semibold text-gray-900">Medicamentos actuales</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate(`/pacientes/${id}?tab=medicamentos`)}>
              Ver todos →
            </Button>
          </div>
          {currentMedications.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">Sin medicamentos activos registrados.</p>
          ) : (
            <div className="space-y-2">
              {currentMedications.map((m) => (
                <div key={m.id} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{m.medicationName}</p>
                    {(m.dosage || m.frequency) && (
                      <p className="text-xs text-gray-500">
                        {[m.dosage, m.frequency].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </div>
                  <Badge variant="outline" className={`text-xs ml-2 flex-shrink-0 ${medicationStatusColors[m.status]}`}>
                    {medicationStatusLabels[m.status]}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Right sidebar */}
      <div className="space-y-6">
        {/* Quick actions */}
        <Card className="p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Acciones rápidas</h3>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-between text-sm"
              size="sm"
              onClick={() => navigate(`/visitas/nueva?patientId=${id}`)}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#0F5F6D]" />
                Agendar cita
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Button>
            <Button variant="outline" className="w-full justify-between text-sm" size="sm">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0F5F6D]" />
                Registrar visita
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Button>
            <Button variant="outline" className="w-full justify-between text-sm" size="sm">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0F5F6D]" />
                Subir archivo
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Button>
            <Button variant="outline" className="w-full justify-between text-sm" size="sm">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#0F5F6D]" />
                Registrar pago
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Button>
          </div>
        </Card>

        {/* Recent visits */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Visitas recientes</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate(`/pacientes/${id}?tab=historia-clinica`)}>
              Ver todas →
            </Button>
          </div>
          <div className="space-y-3">
            {mockRecentVisits.map((visit) => (
              <div key={visit.id} className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0">
                <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{visit.type}</p>
                  <p className="text-xs text-gray-500">{visit.date} · {visit.clinic}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Precautions */}
        {patient.clinicalPrecautionsNotes && (
          <Card className="p-5 border-amber-200 bg-amber-50">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="font-semibold text-amber-900 text-sm">Precauciones clínicas</h3>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">{patient.clinicalPrecautionsNotes}</p>
          </Card>
        )}
      </div>
    </div>
  );
}
