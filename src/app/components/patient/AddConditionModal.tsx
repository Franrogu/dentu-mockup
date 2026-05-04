import { useState } from "react";
import { X, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import type { ConditionScope, SeverityLevel } from "./types";
import { scopeLabels, scopeColors, severityLabels, severityColors } from "./types";
import { conditionCatalogByScope } from "./patient-record.mock";

interface AddConditionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (condition: {
    name: string;
    scope: ConditionScope;
    severityLevel: SeverityLevel | null;
    onsetDate: string | null;
    notes?: string;
  }) => void;
}

const predefinedConditions: Record<ConditionScope, string[]> = {
  ...conditionCatalogByScope,
  other: ["Condición personalizada"],
  mixed: [],
};

const defaultSeverity: Partial<Record<ConditionScope, SeverityLevel>> = {
  allergy: "high",
  risk: "high",
  medical: "medium",
  dental: "low",
  habit: "low",
  pregnancy: "medium",
};

export function AddConditionModal({ isOpen, onClose, onAdd }: AddConditionModalProps) {
  const [scope, setScope] = useState<ConditionScope>("medical");
  const [selectedCondition, setSelectedCondition] = useState<string>("");
  const [customCondition, setCustomCondition] = useState<string>("");
  const [severityLevel, setSeverityLevel] = useState<SeverityLevel | null>(null);
  const [onsetDate, setOnsetDate] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  if (!isOpen) return null;

  const filteredConditions = predefinedConditions[scope].filter((c) =>
    c.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleScopeChange = (value: ConditionScope) => {
    setScope(value);
    setSelectedCondition("");
    setSearchTerm("");
    setSeverityLevel(defaultSeverity[value] ?? null);
  };

  const handleSubmit = () => {
    const conditionName =
      selectedCondition === "Condición personalizada" ? customCondition : selectedCondition;
    if (!conditionName.trim()) return;

    onAdd({
      name: conditionName,
      scope,
      severityLevel,
      onsetDate: onsetDate.trim() || null,
      notes: notes.trim() || undefined,
    });

    setScope("medical");
    setSelectedCondition("");
    setCustomCondition("");
    setSeverityLevel(null);
    setOnsetDate("");
    setNotes("");
    setSearchTerm("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Nueva condición</h2>
            <p className="text-sm text-gray-500 mt-0.5">Registra una condición clínica del paciente</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Scope selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de condición</label>
            <Select value={scope} onValueChange={(v) => handleScopeChange(v as ConditionScope)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.entries(scopeLabels) as [ConditionScope, string][]).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`text-xs ${scopeColors[key]}`}>{label}</Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Buscar condición</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar condición..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0F5F6D] focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Condition list */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Condiciones disponibles</label>
            <div className="border border-gray-200 rounded-lg max-h-52 overflow-y-auto">
              {filteredConditions.map((condition, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedCondition(condition)}
                  className={`w-full text-left px-4 py-2.5 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors text-sm ${
                    selectedCondition === condition
                      ? "bg-[#0F5F6D]/10 border-l-2 border-l-[#0F5F6D] font-medium text-[#0F5F6D]"
                      : "text-gray-900"
                  }`}
                >
                  {condition}
                </button>
              ))}
            </div>
          </div>

          {/* Custom condition */}
          {selectedCondition === "Condición personalizada" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la condición</label>
              <input
                type="text"
                value={customCondition}
                onChange={(e) => setCustomCondition(e.target.value)}
                placeholder="Escribe el nombre de la condición..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0F5F6D] focus:border-transparent outline-none"
              />
            </div>
          )}

          {/* Severity + Onset date — side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Severidad <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {(["low", "medium", "high", "critical"] as SeverityLevel[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSeverityLevel(severityLevel === s ? null : s)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                      severityLevel === s
                        ? severityColors[s] + " border-current"
                        : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {severityLabels[s]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Inicio de la condición <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                type="text"
                value={onsetDate}
                onChange={(e) => setOnsetDate(e.target.value)}
                placeholder="Ej. Mar 2024, Desde infancia..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0F5F6D] focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas clínicas <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Detalles relevantes sobre esta condición, precauciones, observaciones..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0F5F6D] focus:border-transparent outline-none resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="text-sm text-gray-500">
            {selectedCondition && selectedCondition !== "Condición personalizada" && (
              <span>Seleccionada: <strong>{selectedCondition}</strong></span>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button
              className="bg-[#0F5F6D] hover:bg-[#0d4f5a]"
              onClick={handleSubmit}
              disabled={!selectedCondition || (selectedCondition === "Condición personalizada" && !customCondition.trim())}
            >
              Agregar condición
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
