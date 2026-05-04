import { useState } from "react";
import { Activity, Smile, Clock, Info, Pencil, Check, X } from "lucide-react";
import type { MockCondition, MockPatient } from "./types";
import { statusLabels } from "./types";

interface Props {
  patient: MockPatient;
  conditions: MockCondition[];
}

function dotColor(c: MockCondition): string {
  if (c.scope === "allergy") return "bg-red-500";
  if (c.scope === "risk" || c.status === "suspected") return "bg-amber-400";
  return "bg-emerald-500";
}

function displayStatus(c: MockCondition): string {
  if (c.scope === "risk" && c.status === "present") return "Activa";
  return statusLabels[c.status];
}

function ConditionRow({ c }: { c: MockCondition }) {
  const meta = [
    c.onsetDate ? `Desde: ${c.onsetDate}` : null,
    c.resolutionDate ? `Resuelto: ${c.resolutionDate}` : null,
    c.scope !== "allergy" ? `Estado: ${displayStatus(c)}` : null,
  ]
    .filter(Boolean)
    .join("  ·  ");

  return (
    <div className="flex items-start gap-3">
      <span className={`w-2 h-2 rounded-full mt-[5px] flex-shrink-0 ${dotColor(c)}`} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900">{c.name}</p>
        {c.notes && (
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{c.notes}</p>
        )}
        {meta && <p className="text-xs text-gray-400 mt-1">{meta}</p>}
      </div>
    </div>
  );
}

interface CardSection {
  title: string;
  items: MockCondition[];
}

function HistoryCard({
  icon,
  title,
  sections,
  updatedAt,
}: {
  icon: React.ReactNode;
  title: string;
  sections: CardSection[];
  updatedAt: string;
}) {
  const filled = sections.filter((s) => s.items.length > 0);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-[#0F5F6D]">{icon}</span>
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      </div>

      {filled.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8 flex-1">
          Sin antecedentes registrados.
        </p>
      ) : (
        <div className="flex-1">
          {filled.map((section, idx) => (
            <div key={section.title}>
              {idx > 0 && <div className="border-t border-gray-100 my-4" />}
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                {section.title}
              </p>
              <div className="space-y-3.5">
                {section.items.map((c) => (
                  <ConditionRow key={c.id} c={c} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-5 pt-4 border-t border-gray-100">
        <Clock className="w-3.5 h-3.5 flex-shrink-0" />
        <span>Última actualización: {updatedAt}</span>
      </div>
    </div>
  );
}

const RECORD_UPDATED = "20 Mar 2026";

export function PatientClinicalSummary({ patient, conditions }: Props) {
  const [summary, setSummary] = useState(patient.clinicalSummary);
  const [draft, setDraft] = useState(patient.clinicalSummary);
  const [editing, setEditing] = useState(false);

  const medicalSections: CardSection[] = [
    { title: "Alergias",                    items: conditions.filter((c) => c.scope === "allergy") },
    { title: "Condiciones médicas",          items: conditions.filter((c) => c.scope === "medical") },
    { title: "Riesgos / Contraindicaciones", items: conditions.filter((c) => c.scope === "risk") },
  ];

  const dentalSections: CardSection[] = [
    {
      title: "Condiciones dentales",
      items: conditions.filter(
        (c) => ["dental", "habit"].includes(c.scope) && c.status !== "resolved"
      ),
    },
    {
      title: "Antecedentes dentales",
      items: conditions.filter(
        (c) => ["dental", "habit"].includes(c.scope) && c.status === "resolved"
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Resumen clínico</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Antecedentes médicos y dentales relevantes del paciente.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <HistoryCard
          icon={<Activity className="w-4 h-4" />}
          title="Historial médico"
          sections={medicalSections}
          updatedAt={RECORD_UPDATED}
        />
        <HistoryCard
          icon={<Smile className="w-4 h-4" />}
          title="Historial dental"
          sections={dentalSections}
          updatedAt={RECORD_UPDATED}
        />
      </div>

      {/* Nota clínica — clinical_records.clinical_summary */}
      <div className="bg-[#EEF8FA] border border-[#C2DFE6] rounded-xl p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#0F5F6D] flex-shrink-0" />
            <p className="text-sm font-semibold text-gray-800">Nota clínica</p>
          </div>
          {!editing ? (
            <button
              onClick={() => { setDraft(summary); setEditing(true); }}
              className="flex items-center gap-1 text-xs text-[#0F5F6D] hover:opacity-70 flex-shrink-0 transition-opacity"
            >
              <Pencil className="w-3.5 h-3.5" />
              Editar nota
            </button>
          ) : (
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={() => setEditing(false)}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
              >
                <X className="w-3 h-3" /> Cancelar
              </button>
              <button
                onClick={() => { setSummary(draft); setEditing(false); }}
                className="flex items-center gap-1 text-xs font-medium text-[#0F5F6D] hover:opacity-70"
              >
                <Check className="w-3 h-3" /> Guardar
              </button>
            </div>
          )}
        </div>
        <div className="mt-3">
          {editing ? (
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={3}
              className="w-full px-3 py-2.5 border border-[#C2DFE6] bg-white rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-[#0F5F6D] focus:border-transparent outline-none resize-none"
              placeholder="Escribe el resumen clínico del paciente..."
            />
          ) : summary ? (
            <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
          ) : (
            <p className="text-sm text-gray-400 italic">Sin nota clínica registrada.</p>
          )}
        </div>
      </div>
    </div>
  );
}
