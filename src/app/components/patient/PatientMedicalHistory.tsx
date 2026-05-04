import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  AlertTriangle,
  ClipboardList,
  FilePenLine,
  Pill,
  ShieldAlert,
  Stethoscope,
} from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ManageConditionsDrawer } from "./ManageConditionsDrawer";
import type { MockCondition, MockMedication, MockPatient } from "./types";
import { severityLabels, statusLabels } from "./types";

interface PatientMedicalHistoryProps {
  patient: MockPatient;
  conditions: MockCondition[];
  medications: MockMedication[];
}

function toneByCondition(condition: MockCondition) {
  if (condition.scope === "allergy") {
    return {
      dot: "bg-red-500",
      chip: "border-red-200 bg-red-50 text-red-700",
      summary: "Severa",
    };
  }

  if (condition.scope === "risk" || condition.scope === "pregnancy") {
    return {
      dot: "bg-amber-400",
      chip: "border-amber-200 bg-amber-50 text-amber-700",
      summary: condition.severityLevel ? `Riesgo ${severityLabels[condition.severityLevel].toLowerCase()}` : "Riesgo moderado",
    };
  }

  return {
    dot: "bg-emerald-500",
    chip: "border-emerald-200 bg-emerald-50 text-emerald-700",
    summary: condition.notes?.toLowerCase().includes("controlada") ? "Controlada" : statusLabels[condition.status],
  };
}

function ConditionListItem({ condition }: { condition: MockCondition }) {
  const tone = toneByCondition(condition);

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-gray-50/80 px-4 py-3">
      <span className={`mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full ${tone.dot}`} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium text-gray-900">{condition.name}</p>
          <Badge variant="outline" className={`text-[11px] ${tone.chip}`}>
            {condition.status === "resolved" ? "Resuelta" : tone.summary}
          </Badge>
        </div>
        {condition.notes && (
          <p className="mt-1 text-sm leading-relaxed text-gray-600">{condition.notes}</p>
        )}
        <p className="mt-1.5 text-xs text-gray-400">
          {condition.onsetDate ? `Desde ${condition.onsetDate}` : "Sin fecha de inicio"}
          <span className="mx-1.5 text-gray-300">·</span>
          {statusLabels[condition.status]}
        </p>
      </div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return <p className="text-sm text-gray-400">{label}</p>;
}

export function PatientMedicalHistory({
  patient,
  conditions,
  medications,
}: PatientMedicalHistoryProps) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [currentConditions, setCurrentConditions] = useState<MockCondition[]>(conditions);
  const [isManageConditionsOpen, setIsManageConditionsOpen] = useState(false);

  const allergyConditions = currentConditions.filter((condition) => condition.scope === "allergy");
  const medicalConditions = currentConditions.filter((condition) => condition.scope === "medical");
  const riskConditions = currentConditions.filter(
    (condition) => condition.scope === "risk" || condition.scope === "pregnancy",
  );
  const dentalConditions = currentConditions.filter(
    (condition) =>
      (condition.scope === "dental" || condition.scope === "habit") &&
      condition.status !== "resolved",
  );
  const dentalHistory = currentConditions.filter(
    (condition) =>
      (condition.scope === "dental" || condition.scope === "habit") &&
      condition.status === "resolved",
  );

  const currentMedications = medications.filter((medication) => medication.status === "current");
  const summaryMedication = currentMedications[0];

  const alertConditions = currentConditions.filter(
    (condition) =>
      condition.status !== "resolved" &&
      (condition.scope === "allergy" || condition.scope === "risk" || condition.scope === "medical"),
  );

  const alerts = alertConditions.slice(0, 3).map((condition) => ({
    id: condition.id,
    title: condition.name,
    subtitle: toneByCondition(condition).summary,
    chipClassName: toneByCondition(condition).chip,
  }));

  return (
    <>
      <div className="space-y-5">
        <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <Card className="rounded-2xl border-gray-200 p-6">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-[#0F5F6D]">
                <Stethoscope className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Resumen rápido</h2>
                <p className="text-sm text-gray-500">
                  Vista clínica consolidada del expediente del paciente.
                </p>
              </div>
            </div>
            <p className="text-sm leading-7 text-gray-700">{patient.clinicalSummary}</p>
          </Card>

          <Card className="rounded-2xl border-gray-200 p-6">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Alertas importantes</h2>
                <p className="text-sm text-gray-500">Se muestran primero para evitar omisiones clínicas.</p>
              </div>
            </div>

            <div className="grid gap-3">
              {alerts.length === 0 ? (
                <EmptyState label="Sin alertas activas registradas." />
              ) : (
                alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3"
                  >
                    <p className="font-medium text-gray-900">{alert.title}</p>
                    <Badge variant="outline" className={`mt-2 text-xs ${alert.chipClassName}`}>
                      {alert.subtitle}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <Card className="rounded-2xl border-gray-200 p-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Condiciones clínicas</h3>
                <p className="text-sm text-gray-500">
                  Condiciones estructuradas derivadas de alergias, médicas y riesgos clínicos.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsManageConditionsOpen(true)}>
                Gestionar condiciones
              </Button>
            </div>

            <div className="space-y-5">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Alergias
                </p>
                <div className="space-y-3">
                  {allergyConditions.length === 0 ? (
                    <EmptyState label="Sin alergias registradas." />
                  ) : (
                    allergyConditions.map((condition) => (
                      <ConditionListItem key={condition.id} condition={condition} />
                    ))
                  )}
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Condiciones médicas
                </p>
                <div className="space-y-3">
                  {medicalConditions.length === 0 ? (
                    <EmptyState label="Sin condiciones médicas registradas." />
                  ) : (
                    medicalConditions.map((condition) => (
                      <ConditionListItem key={condition.id} condition={condition} />
                    ))
                  )}
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Riesgos / contraindicaciones
                </p>
                <div className="space-y-3">
                  {riskConditions.length === 0 ? (
                    <EmptyState label="Sin riesgos ni contraindicaciones registradas." />
                  ) : (
                    riskConditions.map((condition) => (
                      <ConditionListItem key={condition.id} condition={condition} />
                    ))
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card className="rounded-2xl border-gray-200 p-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Historial dental</h3>
                <p className="text-sm text-gray-500">
                  Hábitos, condiciones dentales activas y antecedentes del tratamiento.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/pacientes/${id}/historia-clinica/editar`)}
              >
                Editar historial dental
              </Button>
            </div>

            <div className="space-y-5">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Condiciones dentales
                </p>
                <div className="space-y-3">
                  {dentalConditions.length === 0 ? (
                    <EmptyState label="Sin condiciones dentales activas." />
                  ) : (
                    dentalConditions.map((condition) => (
                      <ConditionListItem key={condition.id} condition={condition} />
                    ))
                  )}
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Antecedentes dentales
                </p>
                <div className="space-y-3">
                  {dentalHistory.length === 0 ? (
                    <EmptyState label="Sin antecedentes dentales resueltos." />
                  ) : (
                    dentalHistory.map((condition) => (
                      <ConditionListItem key={condition.id} condition={condition} />
                    ))
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <Card className="rounded-2xl border-gray-200 p-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Pill className="h-4 w-4 text-[#0F5F6D]" />
                  <h3 className="text-lg font-semibold text-gray-900">Medicamentos actuales</h3>
                </div>
                <p className="text-sm text-gray-500">
                  Solo se muestra un resumen breve para evitar duplicar la administración.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/pacientes/${id}?tab=medicamentos`)}
              >
                Gestionar medicamentos
              </Button>
            </div>

            {summaryMedication ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                <p className="font-medium text-gray-900">
                  {summaryMedication.medicationName} {summaryMedication.dosage}
                </p>
                <p className="mt-1 text-sm text-emerald-700">{summaryMedication.frequency}</p>
                {currentMedications.length > 1 && (
                  <p className="mt-2 text-xs text-emerald-700">
                    +{currentMedications.length - 1} medicamento activo adicional en el tab Medicamentos.
                  </p>
                )}
              </div>
            ) : (
              <EmptyState label="Sin medicamentos actuales registrados." />
            )}

            <p className="mt-4 text-xs text-gray-400">
              Se administran desde el tab Medicamentos.
            </p>
          </Card>

          <Card className="rounded-2xl border-gray-200 p-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Notas clínicas / precauciones
                  </h3>
                </div>
                <p className="text-sm text-gray-500">
                  Indicaciones generales visibles para el equipo clínico.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/pacientes/${id}/historia-clinica/editar`)}
              >
                Editar nota
              </Button>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4">
              <p className="text-sm leading-7 text-amber-900">{patient.clinicalPrecautionsNotes}</p>
            </div>
          </Card>
        </div>

        <Card className="rounded-2xl border-dashed border-teal-200 bg-teal-50/60 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-[#0F5F6D]" />
                <p className="font-semibold text-gray-900">Historia clínica</p>
              </div>
              <p className="text-sm text-gray-600">
                Edita el resumen, precauciones y la organización visual de las condiciones desde una sola vista.
              </p>
            </div>
            <Button
              className="bg-[#0F5F6D] hover:bg-[#0d4f5a]"
              onClick={() => navigate(`/pacientes/${id}/historia-clinica/editar`)}
            >
              <FilePenLine className="mr-1.5 h-4 w-4" />
              Editar historia clínica
            </Button>
          </div>
        </Card>
      </div>

      <ManageConditionsDrawer
        isOpen={isManageConditionsOpen}
        onClose={() => setIsManageConditionsOpen(false)}
        initialConditions={currentConditions}
        onSave={setCurrentConditions}
      />
    </>
  );
}
