import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Plus, Filter } from "lucide-react";
import { AddConditionModal } from "./AddConditionModal";
import { createLocalUuid } from "./types";
import type { MockCondition, ConditionStatus, ConditionScope, SeverityLevel } from "./types";
import {
  scopeLabels, scopeColors, statusLabels, statusColors,
  severityLabels, severityColors,
} from "./types";

interface PatientConditionsProps {
  initialConditions?: MockCondition[];
}

const SeverityBadge = ({ level }: { level: SeverityLevel | null }) => {
  if (!level) return null;
  return (
    <Badge variant="outline" className={`text-xs font-semibold ${severityColors[level]}`}>
      {severityLabels[level]}
    </Badge>
  );
};

export function PatientConditions({ initialConditions = [] }: PatientConditionsProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [conditions, setConditions] = useState<MockCondition[]>(initialConditions);
  const [filterStatus, setFilterStatus] = useState<ConditionStatus | "all">("all");
  const [filterScope, setFilterScope] = useState<ConditionScope | "all">("all");

  const handleAddCondition = (data: {
    name: string;
    scope: ConditionScope;
    severityLevel: SeverityLevel | null;
    onsetDate: string | null;
    notes?: string;
  }) => {
    const templateCondition = conditions[0];
    const newCondition: MockCondition = {
      id: createLocalUuid(),
      orgId: templateCondition?.orgId ?? createLocalUuid(),
      patientId: templateCondition?.patientId ?? createLocalUuid(),
      clinicalRecordId: templateCondition?.clinicalRecordId ?? createLocalUuid(),
      conditionId: createLocalUuid(),
      code: data.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^A-Za-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "")
        .toUpperCase()
        .slice(0, 32),
      name: data.name,
      scope: data.scope,
      status: "present",
      severityLevel: data.severityLevel,
      onsetDate: data.onsetDate,
      resolutionDate: null,
      notes: data.notes,
      sourceVisitId: null,
      recordedByUserId: templateCondition?.recordedByUserId ?? createLocalUuid(),
      recordedByDisplayName: templateCondition?.recordedByDisplayName,
      recordedAt: new Date().toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" }),
      updatedAt: new Date().toISOString(),
    };
    setConditions([newCondition, ...conditions]);
    setIsAddModalOpen(false);
  };

  const handleUpdateStatus = (id: string, status: ConditionStatus) => {
    setConditions(
      conditions.map((c) =>
        c.id === id
          ? {
              ...c,
              status,
              resolutionDate:
                status === "resolved"
                  ? new Date().toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })
                  : null,
            }
          : c
      )
    );
  };

  const filteredConditions = conditions.filter((c) => {
    if (filterStatus !== "all" && c.status !== filterStatus) return false;
    if (filterScope !== "all" && c.scope !== filterScope) return false;
    return true;
  });

  const presentCount = conditions.filter((c) => c.status === "present").length;
  const suspectedCount = conditions.filter((c) => c.status === "suspected").length;
  const resolvedCount = conditions.filter((c) => c.status === "resolved").length;
  const highRiskCount = conditions.filter(
    (c) => c.status !== "resolved" && (c.severityLevel === "high" || c.severityLevel === "critical")
  ).length;

  const scopesWithConditions = Array.from(new Set(conditions.map((c) => c.scope)));

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Condiciones</h2>
            <p className="text-sm text-gray-500 mt-1">
              Condiciones activas, sospechadas y resueltas del paciente con seguimiento clínico.
            </p>
          </div>
          <Button className="bg-[#0F5F6D] hover:bg-[#0d4f5a]" size="sm" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva condición
          </Button>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Presentes</p>
            <p className="text-3xl font-bold text-emerald-600">{presentCount}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Sospechadas</p>
            <p className="text-3xl font-bold text-yellow-600">{suspectedCount}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Resueltas</p>
            <p className="text-3xl font-bold text-gray-500">{resolvedCount}</p>
          </Card>
          <Card className={`p-4 ${highRiskCount > 0 ? "border-red-200 bg-red-50" : ""}`}>
            <p className={`text-xs uppercase tracking-wide mb-1 ${highRiskCount > 0 ? "text-red-600" : "text-gray-500"}`}>
              Alto / Crítico
            </p>
            <p className={`text-3xl font-bold ${highRiskCount > 0 ? "text-red-600" : "text-gray-500"}`}>
              {highRiskCount}
            </p>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filtros</span>
          </div>
          <div className="flex flex-wrap gap-4">
            {/* Status filter */}
            <div>
              <p className="text-xs text-gray-500 mb-2">Estado</p>
              <div className="flex flex-wrap gap-1.5">
                {(["all", "present", "suspected", "resolved"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                      filterStatus === s
                        ? "bg-[#0F5F6D] text-white border-[#0F5F6D]"
                        : "bg-white text-gray-600 border-gray-200 hover:border-[#0F5F6D] hover:text-[#0F5F6D]"
                    }`}
                  >
                    {s === "all" ? "Todas" : statusLabels[s]}
                  </button>
                ))}
              </div>
            </div>
            {/* Scope filter */}
            <div>
              <p className="text-xs text-gray-500 mb-2">Tipo</p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setFilterScope("all")}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    filterScope === "all"
                      ? "bg-[#0F5F6D] text-white border-[#0F5F6D]"
                      : "bg-white text-gray-600 border-gray-200 hover:border-[#0F5F6D] hover:text-[#0F5F6D]"
                  }`}
                >
                  Todos
                </button>
                {scopesWithConditions.map((scope) => (
                  <button
                    key={scope}
                    onClick={() => setFilterScope(scope)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                      filterScope === scope
                        ? "bg-[#0F5F6D] text-white border-[#0F5F6D]"
                        : "bg-white text-gray-600 border-gray-200 hover:border-[#0F5F6D] hover:text-[#0F5F6D]"
                    }`}
                  >
                    {scopeLabels[scope]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {(filterStatus !== "all" || filterScope !== "all") && (
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
              <span>{filteredConditions.length} condición(es) encontrada(s)</span>
              <button
                onClick={() => { setFilterStatus("all"); setFilterScope("all"); }}
                className="text-[#0F5F6D] hover:underline"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </Card>

        {/* Conditions list */}
        <div className="space-y-3">
          {filteredConditions.length === 0 ? (
            <Card className="p-12">
              <div className="text-center">
                <p className="text-sm text-gray-500">No hay condiciones que coincidan con los filtros.</p>
                <button
                  onClick={() => { setFilterStatus("all"); setFilterScope("all"); }}
                  className="text-[#0F5F6D] text-sm hover:underline mt-2"
                >
                  Limpiar filtros
                </button>
              </div>
            </Card>
          ) : (
            filteredConditions.map((condition) => (
              <Card
                key={condition.id}
                className={`p-5 ${
                  condition.status === "resolved"
                    ? "opacity-70 bg-gray-50"
                    : condition.severityLevel === "critical" || condition.severityLevel === "high"
                    ? "border-orange-200"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Badge row */}
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <Badge variant="outline" className={`text-xs ${scopeColors[condition.scope]}`}>
                        {scopeLabels[condition.scope]}
                      </Badge>
                      <Badge variant="outline" className={`text-xs ${statusColors[condition.status]}`}>
                        {statusLabels[condition.status]}
                      </Badge>
                      {condition.severityLevel && condition.status !== "resolved" && (
                        <SeverityBadge level={condition.severityLevel} />
                      )}
                    </div>

                    {/* Name */}
                    <h3 className="font-semibold text-gray-900 mb-1">{condition.name}</h3>

                    {/* Notes */}
                    {condition.notes && (
                      <p className="text-sm text-gray-600 mb-2 leading-relaxed">{condition.notes}</p>
                    )}

                    {/* Dates */}
                    <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap">
                      {condition.onsetDate && (
                        <span>Inicio: <span className="text-gray-600">{condition.onsetDate}</span></span>
                      )}
                      <span>Registrado: <span className="text-gray-600">{condition.recordedAt}</span></span>
                      {condition.resolutionDate && (
                        <span>Resuelto: <span className="text-gray-600">{condition.resolutionDate}</span></span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-1.5 flex-shrink-0">
                    {condition.status === "present" && (
                      <>
                        <Button variant="outline" size="sm" className="text-xs h-7"
                          onClick={() => handleUpdateStatus(condition.id, "suspected")}>
                          Marcar sospechada
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs h-7"
                          onClick={() => handleUpdateStatus(condition.id, "resolved")}>
                          Resolver
                        </Button>
                      </>
                    )}
                    {condition.status === "suspected" && (
                      <>
                        <Button variant="outline" size="sm" className="text-xs h-7"
                          onClick={() => handleUpdateStatus(condition.id, "present")}>
                          Confirmar
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs h-7"
                          onClick={() => handleUpdateStatus(condition.id, "resolved")}>
                          Resolver
                        </Button>
                      </>
                    )}
                    {condition.status === "resolved" && (
                      <Button variant="outline" size="sm" className="text-xs h-7"
                        onClick={() => handleUpdateStatus(condition.id, "present")}>
                        Reactivar
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      <AddConditionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddCondition}
      />
    </>
  );
}
