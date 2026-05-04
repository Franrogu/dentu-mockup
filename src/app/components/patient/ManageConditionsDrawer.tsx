import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  GripVertical,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import {
  createLocalUuid,
  scopeColors,
  scopeLabels,
  severityColors,
  severityLabels,
  statusColors,
  statusLabels,
} from "./types";
import type {
  ConditionScope,
  ConditionStatus,
  MockCondition,
  SeverityLevel,
  Uuid,
} from "./types";
import {
  conditionCatalogByScope,
  conditionCatalogDisplayCount,
  defaultSeverityByScope,
  frequentConditions,
} from "./patient-record.mock";

interface ManageConditionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialConditions?: MockCondition[];
  onSave?: (conditions: MockCondition[]) => void;
}

interface SelectedConditionDraft {
  id: Uuid;
  orgId: Uuid;
  patientId: Uuid;
  clinicalRecordId: Uuid;
  conditionId: Uuid;
  code: string;
  name: string;
  scope: ConditionScope;
  severityLevel: SeverityLevel | null;
  status: ConditionStatus;
  onsetDate: string | null;
  notes: string;
  sourceVisitId: Uuid | null;
  recordedByUserId: Uuid;
  recordedAt: string;
  updatedAt: string;
  recordedByDisplayName?: string;
}

const scopeFilters: Array<{ value: ConditionScope | "all"; label: string }> = [
  { value: "all", label: "Todas" },
  { value: "allergy", label: "Alergias" },
  { value: "medical", label: "Médicas" },
  { value: "dental", label: "Dentales" },
  { value: "habit", label: "Hábitos" },
  { value: "risk", label: "Riesgos" },
  { value: "pregnancy", label: "Embarazo" },
];

const catalogOrder: ConditionScope[] = [
  "allergy",
  "medical",
  "dental",
  "habit",
  "risk",
  "pregnancy",
];

const catalogSectionLabels: Record<ConditionScope, string> = {
  allergy: "Alergias",
  medical: "Médicas",
  dental: "Dentales",
  habit: "Hábitos",
  risk: "Riesgos / Contraindicaciones",
  pregnancy: "Embarazo",
  other: "Otro",
  mixed: "Mixtas",
};

function getTodayLabel() {
  return new Date().toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function normalizeCode(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toUpperCase()
    .slice(0, 32);
}

function buildDrafts(initialConditions: MockCondition[]) {
  return initialConditions.map<SelectedConditionDraft>((condition) => ({
    id: condition.id,
    orgId: condition.orgId,
    patientId: condition.patientId,
    clinicalRecordId: condition.clinicalRecordId,
    conditionId: condition.conditionId,
    code: condition.code,
    name: condition.name,
    scope: condition.scope,
    severityLevel: condition.severityLevel,
    status: condition.status,
    onsetDate: condition.onsetDate,
    notes: condition.notes ?? "",
    sourceVisitId: condition.sourceVisitId,
    recordedByUserId: condition.recordedByUserId,
    recordedAt: condition.recordedAt,
    updatedAt: condition.updatedAt,
    recordedByDisplayName: condition.recordedByDisplayName,
  }));
}

export function ManageConditionsDrawer({
  isOpen,
  onClose,
  initialConditions = [],
  onSave,
}: ManageConditionsDrawerProps) {
  const [scopeFilter, setScopeFilter] = useState<ConditionScope | "all">("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<SelectedConditionDraft[]>(() => buildDrafts(initialConditions));
  const [expandedScopes, setExpandedScopes] = useState<Record<ConditionScope, boolean>>({
    allergy: true,
    medical: true,
    dental: true,
    habit: true,
    risk: true,
    pregnancy: true,
    other: true,
    mixed: true,
  });

  useEffect(() => {
    if (!isOpen) return;
    setScopeFilter("all");
    setSearch("");
    setSelected(buildDrafts(initialConditions));
    setExpandedScopes({
      allergy: true,
      medical: true,
      dental: true,
      habit: true,
      risk: true,
      pregnancy: true,
      other: true,
      mixed: true,
    });
  }, [initialConditions, isOpen]);

  if (!isOpen) return null;

  const selectedByName = new Map(selected.map((item) => [item.name, item]));
  const visibleScopes = scopeFilter === "all" ? catalogOrder : [scopeFilter];

  const addCondition = (name: string, scope: ConditionScope) => {
    if (selectedByName.has(name)) return;

    const templateCondition = selected[0] ?? initialConditions[0];

    setSelected((current) => [
      ...current,
      {
        id: createLocalUuid(),
        orgId: templateCondition?.orgId ?? createLocalUuid(),
        patientId: templateCondition?.patientId ?? createLocalUuid(),
        clinicalRecordId: templateCondition?.clinicalRecordId ?? createLocalUuid(),
        conditionId: createLocalUuid(),
        code: normalizeCode(name),
        name,
        scope,
        severityLevel: defaultSeverityByScope[scope],
        status: "present",
        onsetDate: "",
        notes: "",
        sourceVisitId: null,
        recordedByUserId: templateCondition?.recordedByUserId ?? createLocalUuid(),
        recordedAt: getTodayLabel(),
        updatedAt: new Date().toISOString(),
        recordedByDisplayName: templateCondition?.recordedByDisplayName,
      },
    ]);
  };

  const removeCondition = (id: Uuid) => {
    setSelected((current) => current.filter((item) => item.id !== id));
  };

  const updateCondition = (id: Uuid, patch: Partial<SelectedConditionDraft>) => {
    setSelected((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  };

  const toggleScope = (scope: ConditionScope) => {
    setExpandedScopes((current) => ({ ...current, [scope]: !current[scope] }));
  };

  const handleSave = () => {
    const nextConditions: MockCondition[] = selected.map((item) => ({
      id: item.id,
      orgId: item.orgId,
      patientId: item.patientId,
      clinicalRecordId: item.clinicalRecordId,
      conditionId: item.conditionId,
      code: item.code,
      name: item.name,
      scope: item.scope,
      status: item.status,
      severityLevel: item.severityLevel,
      onsetDate: item.onsetDate?.trim() ? item.onsetDate : null,
      resolutionDate: item.status === "resolved" ? getTodayLabel() : null,
      notes: item.notes.trim() || undefined,
      sourceVisitId: item.sourceVisitId,
      recordedByUserId: item.recordedByUserId,
      recordedByDisplayName: item.recordedByDisplayName,
      recordedAt: item.recordedAt || getTodayLabel(),
      updatedAt: item.updatedAt,
    }));

    onSave?.(nextConditions);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/45">
      <div className="flex h-full w-full max-w-[1180px] flex-col bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Gestionar condiciones</h2>
            <p className="mt-0.5 text-sm text-gray-500">
              Puedes agregar varias condiciones en un solo paso.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 border-b border-gray-100 px-6 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar condición"
              className="h-11 w-full rounded-xl border border-gray-300 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-transparent focus:ring-2 focus:ring-[#0F5F6D]"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {scopeFilters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setScopeFilter(filter.value)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  scopeFilter === filter.value
                    ? "border-[#0F5F6D] bg-[#0F5F6D] text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-[#0F5F6D] hover:text-[#0F5F6D]"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Frecuentes
            </p>
            <div className="flex flex-wrap gap-2">
              {frequentConditions.map((item) => {
                const isSelected = selectedByName.has(item.name);
                return (
                  <button
                    key={item.name}
                    type="button"
                    disabled={isSelected}
                    onClick={() => addCondition(item.name, item.scope)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      isSelected
                        ? "cursor-default border-teal-200 bg-teal-50 text-teal-700"
                        : "border-gray-200 bg-white text-gray-700 hover:border-[#0F5F6D] hover:text-[#0F5F6D]"
                    }`}
                  >
                    {isSelected ? "✓ " : "+ "}
                    {item.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid min-h-0 flex-1 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="min-h-0 overflow-y-auto border-r border-gray-200 px-6 py-5">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">Catálogo disponible</p>
                <p className="text-sm text-gray-500">{conditionCatalogDisplayCount} condiciones</p>
              </div>
            </div>

            <div className="space-y-4">
              {visibleScopes.map((scope) => {
                const items = conditionCatalogByScope[scope].filter((item) =>
                  !search || item.toLowerCase().includes(search.toLowerCase()),
                );

                if (items.length === 0) return null;

                return (
                  <div key={scope} className="rounded-2xl border border-gray-200 bg-white">
                    <button
                      type="button"
                      onClick={() => toggleScope(scope)}
                      className="flex w-full items-center justify-between px-4 py-3 text-left"
                    >
                      <div className="flex items-center gap-2">
                        {expandedScopes[scope] ? (
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        )}
                        <Badge variant="outline" className={`text-xs ${scopeColors[scope]}`}>
                          {catalogSectionLabels[scope] ?? scopeLabels[scope]}
                        </Badge>
                      </div>
                      <span className="text-xs text-gray-400">{items.length}</span>
                    </button>

                    {expandedScopes[scope] && (
                      <div className="space-y-1 border-t border-gray-100 p-3">
                        {items.map((item) => {
                          const selectedItem = selectedByName.get(item);
                          const isSelected = Boolean(selectedItem);

                          return (
                            <label
                              key={item}
                              className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                                isSelected
                                  ? "border border-teal-200 bg-teal-50 text-teal-800"
                                  : "border border-transparent text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() =>
                                  isSelected
                                    ? removeCondition(selectedItem!.id)
                                    : addCondition(item, scope)
                                }
                              />
                              <span className="flex-1">{item}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="min-h-0 overflow-y-auto px-6 py-5">
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-900">
                Seleccionadas para el paciente ({selected.length})
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-400">
                <GripVertical className="h-3.5 w-3.5" />
                Arrastra para reordenar las condiciones. El orden se reflejará en la historia clínica.
              </p>
            </div>

            {selected.length === 0 ? (
              <div className="flex h-36 items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 text-center text-sm text-gray-400">
                Selecciona condiciones del catálogo disponible para construir la historia clínica del paciente.
              </div>
            ) : (
              <div className="space-y-3">
                {selected.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2">
                        <GripVertical className="mt-0.5 h-4 w-4 text-gray-300" />
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <Badge variant="outline" className={`mt-1 text-xs ${scopeColors[item.scope]}`}>
                            {catalogSectionLabels[item.scope] ?? scopeLabels[item.scope]}
                          </Badge>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCondition(item.id)}
                        className="rounded-md p-1 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="mb-2 text-xs font-medium text-gray-500">Severidad</p>
                        <div className="flex flex-wrap gap-2">
                          {(["low", "medium", "high", "critical"] as SeverityLevel[]).map((level) => (
                            <button
                              key={level}
                              type="button"
                              onClick={() => updateCondition(item.id, { severityLevel: level })}
                              className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                                item.severityLevel === level
                                  ? severityColors[level]
                                  : "border-gray-200 bg-white text-gray-500 hover:border-gray-400"
                              }`}
                            >
                              {severityLabels[level]}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="mb-2 text-xs font-medium text-gray-500">Estado</p>
                        <div className="flex flex-wrap gap-2">
                          {(["present", "suspected", "resolved"] as ConditionStatus[]).map((status) => (
                            <button
                              key={status}
                              type="button"
                              onClick={() => updateCondition(item.id, { status })}
                              className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                                item.status === status
                                  ? statusColors[status]
                                  : "border-gray-200 bg-white text-gray-500 hover:border-gray-400"
                              }`}
                            >
                              {statusLabels[status]}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="mb-2 text-xs font-medium text-gray-500">Desde</p>
                        <input
                          type="text"
                          value={item.onsetDate ?? ""}
                          onChange={(event) => updateCondition(item.id, { onsetDate: event.target.value })}
                          placeholder="Ej. Ene 2025"
                          className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm text-gray-700 outline-none transition focus:border-transparent focus:ring-2 focus:ring-[#0F5F6D]"
                        />
                      </div>

                      <div>
                        <p className="mb-2 text-xs font-medium text-gray-500">Notas</p>
                        <input
                          type="text"
                          value={item.notes}
                          onChange={(event) => updateCondition(item.id, { notes: event.target.value })}
                          placeholder="Observaciones clínicas"
                          className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm text-gray-700 outline-none transition focus:border-transparent focus:ring-2 focus:ring-[#0F5F6D]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button className="bg-[#0F5F6D] hover:bg-[#0d4f5a]" onClick={handleSave}>
            Guardar condiciones
          </Button>
        </div>
      </div>
    </div>
  );
}
