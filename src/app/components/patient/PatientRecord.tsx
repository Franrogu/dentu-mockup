import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Pencil, AlertTriangle, Phone, MapPin, User, Check, X, StickyNote } from "lucide-react";
import type { MockPatient, MockCondition } from "./types";
import { scopeColors, scopeLabels, severityColors, severityLabels, statusLabels } from "./types";

interface PatientRecordProps {
  patient: MockPatient;
  conditions: MockCondition[];
}

export function PatientRecord({ patient, conditions }: PatientRecordProps) {
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [clinicalSummary, setClinicalSummary] = useState(patient.clinicalSummary);
  const [summaryDraft, setSummaryDraft] = useState(patient.clinicalSummary);

  const [isEditingPrecautions, setIsEditingPrecautions] = useState(false);
  const [precautions, setPrecautions] = useState(patient.clinicalPrecautionsNotes);
  const [precautionsDraft, setPrecautionsDraft] = useState(patient.clinicalPrecautionsNotes);

  const riskConditions = conditions.filter(
    (c) => c.status !== "resolved" &&
    (c.scope === "risk" || c.scope === "allergy" || c.severityLevel === "high" || c.severityLevel === "critical")
  );

  const bloodTypeLabels: Record<string, string> = {
    "A+": "A positivo", "A-": "A negativo",
    "B+": "B positivo", "B-": "B negativo",
    "AB+": "AB positivo", "AB-": "AB negativo",
    "O+": "O positivo", "O-": "O negativo",
    "unknown": "Desconocido",
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main content */}
      <div className="lg:col-span-2 space-y-6">

        {/* Administrative data */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Expediente longitudinal</h2>
              <p className="text-sm text-gray-500">Base administrativa y clínica del paciente a nivel organización.</p>
            </div>
            <Button variant="outline" size="sm">
              <Pencil className="w-4 h-4 mr-1.5" />
              Editar datos
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-5">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Número de expediente</p>
              <p className="font-mono font-medium text-gray-900">{patient.recordNumber}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Estado</p>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                {patient.recordStatus === "open" ? "Abierto" : "Archivado"}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Fecha de apertura</p>
              <p className="font-medium text-gray-900">{patient.openedDate}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Fecha de archivo</p>
              <p className="font-medium text-gray-900">{patient.archivedDate ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Tipo de sangre</p>
              <p className="font-medium text-gray-900">
                {patient.bloodType} <span className="text-gray-400 font-normal text-sm">· {bloodTypeLabels[patient.bloodType]}</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Código de paciente</p>
              <p className="font-mono text-xs text-gray-600">{patient.code}</p>
            </div>
          </div>
        </Card>

        {/* Contact & emergency */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">Datos de contacto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Paciente</p>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-900">{patient.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-4 h-4 flex-shrink-0 text-gray-400 text-center text-xs">@</span>
                  <span className="text-gray-900">{patient.email}</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-900 leading-snug">{patient.addressText}</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Contacto de emergencia</p>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-900 font-medium">{patient.emergencyContactName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-900">{patient.emergencyContactPhone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* patients.notes — campo texto general del paciente */}
          {patient.notes && (
            <div className="mt-5 pt-5 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <StickyNote className="w-4 h-4 text-gray-400" />
                <p className="text-xs text-gray-400 uppercase tracking-wide">Notas del paciente</p>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{patient.notes}</p>
            </div>
          )}
        </Card>

        {/* Clinical summary */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Resumen clínico</h2>
              <p className="text-sm text-gray-500">Narrativa longitudinal del expediente.</p>
            </div>
            {!isEditingSummary ? (
              <Button variant="outline" size="sm" onClick={() => { setSummaryDraft(clinicalSummary); setIsEditingSummary(true); }}>
                <Pencil className="w-4 h-4 mr-1.5" />
                Editar
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsEditingSummary(false)}>
                  <X className="w-4 h-4 mr-1" />
                  Cancelar
                </Button>
                <Button size="sm" className="bg-[#0F5F6D] hover:bg-[#0d4f5a]"
                  onClick={() => { setClinicalSummary(summaryDraft); setIsEditingSummary(false); }}>
                  <Check className="w-4 h-4 mr-1" />
                  Guardar
                </Button>
              </div>
            )}
          </div>
          {isEditingSummary ? (
            <textarea
              value={summaryDraft}
              onChange={(e) => setSummaryDraft(e.target.value)}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0F5F6D] focus:border-transparent outline-none resize-none"
              placeholder="Escribe el resumen clínico del paciente..."
            />
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[100px]">
              {clinicalSummary ? (
                <p className="text-sm text-gray-700 leading-relaxed">{clinicalSummary}</p>
              ) : (
                <p className="text-sm text-gray-400 italic">Sin resumen clínico registrado.</p>
              )}
            </div>
          )}
        </Card>

        {/* Precautions notes */}
        <Card className="p-6 border-amber-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Precauciones clínicas</h2>
                <p className="text-sm text-gray-500">Notas de precaución visibles para todo el equipo clínico.</p>
              </div>
            </div>
            {!isEditingPrecautions ? (
              <Button variant="outline" size="sm" onClick={() => { setPrecautionsDraft(precautions); setIsEditingPrecautions(true); }}>
                <Pencil className="w-4 h-4 mr-1.5" />
                Editar
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsEditingPrecautions(false)}>
                  <X className="w-4 h-4 mr-1" />
                  Cancelar
                </Button>
                <Button size="sm" className="bg-[#0F5F6D] hover:bg-[#0d4f5a]"
                  onClick={() => { setPrecautions(precautionsDraft); setIsEditingPrecautions(false); }}>
                  <Check className="w-4 h-4 mr-1" />
                  Guardar
                </Button>
              </div>
            )}
          </div>
          {isEditingPrecautions ? (
            <textarea
              value={precautionsDraft}
              onChange={(e) => setPrecautionsDraft(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-amber-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none bg-amber-50"
              placeholder="Ej. No usar vasoconstrictores. Alergia a penicilina — usar clindamicina..."
            />
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 min-h-[80px]">
              {precautions ? (
                <p className="text-sm text-amber-900 leading-relaxed">{precautions}</p>
              ) : (
                <p className="text-sm text-amber-500 italic">Sin precauciones clínicas registradas.</p>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* Right sidebar */}
      <div className="space-y-6">

        {/* Risk flags — derived from conditions */}
        <Card className="p-5">
          <h3 className="font-semibold text-gray-900 mb-1">Banderas de riesgo</h3>
          <p className="text-xs text-gray-500 mb-4">Condiciones de riesgo y alergias activas.</p>
          {riskConditions.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm text-gray-400">Sin banderas de riesgo activas.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {riskConditions.map((c) => (
                <div key={c.id} className={`rounded-lg p-3 border ${
                  c.severityLevel === "critical" || c.severityLevel === "high"
                    ? "bg-red-50 border-red-200"
                    : "bg-orange-50 border-orange-200"
                }`}>
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
                  {c.notes && <p className="text-xs text-gray-600 mt-0.5 leading-snug">{c.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Record activity — derivado de patient_conditions.recorded_at */}
        <Card className="p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Actividad del expediente</h3>
          <div className="space-y-3">
            {/* Apertura del expediente — clinical_records.opened_at */}
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0F5F6D] mt-2 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-700">Expediente abierto</p>
                <p className="text-xs text-gray-400">{patient.openedDate}</p>
              </div>
            </div>
            {/* Eventos de condiciones — patient_conditions.recorded_at */}
            {[...conditions]
              .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt))
              .map((c) => (
                <div key={c.id} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-700">
                      {c.status === "resolved"
                        ? `Condición resuelta: ${c.name}`
                        : `Condición registrada: ${c.name}`}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <p className="text-xs text-gray-400">{c.recordedAt}</p>
                      <span className="text-xs text-gray-300">·</span>
                      <p className="text-xs text-gray-400">{statusLabels[c.status]}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
