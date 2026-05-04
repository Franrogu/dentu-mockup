import { type ReactNode, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { ChevronRight, Pill, ShieldAlert } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { ManageConditionsDrawer } from "../components/patient/ManageConditionsDrawer";
import {
  bloodTypeOptions,
  defaultPregnancyStatus,
  mockPatient,
  mockPatientConditions,
  mockPatientMedications,
  pregnancyStatusOptions,
  type PregnancyStatusOption,
} from "../components/patient/patient-record.mock";
import type { BloodType, MockCondition } from "../components/patient/types";
import { scopeColors } from "../components/patient/types";

function getConditionTone(condition: MockCondition) {
  if (condition.scope === "allergy") {
    return {
      badge: "border-red-200 bg-red-50 text-red-700",
      label: "Severa",
    };
  }

  if (condition.scope === "risk" || condition.scope === "pregnancy") {
    return {
      badge: "border-amber-200 bg-amber-50 text-amber-700",
      label: "Riesgo moderado",
    };
  }

  return {
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    label: condition.notes?.toLowerCase().includes("controlada") ? "Controlada" : "Activa",
  };
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <label className="mb-2 block text-sm font-medium text-gray-700">{children}</label>;
}

export function EditClinicalHistory() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const isNew = location.pathname.endsWith("/nueva");

  const backUrl = `/pacientes/${id}?tab=historia-clinica`;
  const currentMedications = mockPatientMedications.filter((medication) => medication.status === "current");

  const [bloodType, setBloodType] = useState<BloodType>(isNew ? "unknown" : mockPatient.bloodType);
  const [pregnancyStatus, setPregnancyStatus] = useState<PregnancyStatusOption>(defaultPregnancyStatus);
  const [clinicalSummary, setClinicalSummary] = useState(isNew ? "" : mockPatient.clinicalSummary);
  const [clinicalPrecautions, setClinicalPrecautions] = useState(
    isNew ? "" : mockPatient.clinicalPrecautionsNotes,
  );
  const [conditions, setConditions] = useState<MockCondition[]>(isNew ? [] : mockPatientConditions);
  const [isManageConditionsOpen, setIsManageConditionsOpen] = useState(false);

  const groupedConditions = [
    {
      title: "Alergias",
      items: conditions.filter((condition) => condition.scope === "allergy"),
    },
    {
      title: "Condiciones médicas",
      items: conditions.filter((condition) => condition.scope === "medical"),
    },
    {
      title: "Riesgos / contraindicaciones",
      items: conditions.filter(
        (condition) => condition.scope === "risk" || condition.scope === "pregnancy",
      ),
    },
    {
      title: "Condiciones dentales",
      items: conditions.filter((condition) => condition.scope === "dental"),
    },
    {
      title: "Hábitos",
      items: conditions.filter((condition) => condition.scope === "habit"),
    },
  ];

  const activeAlerts = conditions
    .filter(
      (condition) =>
        condition.status !== "resolved" &&
        (condition.scope === "allergy" || condition.scope === "risk" || condition.scope === "medical"),
    )
    .slice(0, 3);

  const handleCancel = () => navigate(backUrl);
  const handleSave = () => navigate(backUrl);

  return (
    <>
      <div className="space-y-5">
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-1.5 text-sm text-gray-500">
                <button
                  onClick={handleCancel}
                  className="transition-colors hover:text-[#0F5F6D]"
                >
                  Historia clínica
                </button>
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="font-medium text-gray-900">{mockPatient.fullName}</span>
              </div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {isNew ? "Nueva historia clínica" : "Editar historia clínica"}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button className="bg-[#0F5F6D] hover:bg-[#0d4f5a]" onClick={handleSave}>
                Guardar cambios
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-5">
            <Card className="rounded-2xl border-gray-200 p-6">
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-gray-900">Datos clínicos generales</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Información general del expediente clínico sin duplicar condiciones estructuradas.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <FieldLabel>Tipo de sangre</FieldLabel>
                  <Select value={bloodType} onValueChange={(value) => setBloodType(value as BloodType)}>
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {bloodTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{option.label}</span>
                            {option.description && (
                              <span className="text-xs text-gray-400">{option.description}</span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <FieldLabel>Estado de embarazo</FieldLabel>
                  <Select
                    value={pregnancyStatus}
                    onValueChange={(value) => setPregnancyStatus(value as PregnancyStatusOption)}
                  >
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {pregnancyStatusOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <FieldLabel>Resumen clínico</FieldLabel>
                  <Textarea
                    value={clinicalSummary}
                    onChange={(event) => setClinicalSummary(event.target.value)}
                    rows={5}
                    placeholder="Escribe un resumen clínico general del paciente."
                    className="rounded-2xl"
                  />
                </div>

                <div className="md:col-span-2">
                  <FieldLabel>Precauciones clínicas</FieldLabel>
                  <Textarea
                    value={clinicalPrecautions}
                    onChange={(event) => setClinicalPrecautions(event.target.value)}
                    rows={4}
                    placeholder="Ej. Monitorizar presión arterial en procedimientos extensos."
                    className="rounded-2xl"
                  />
                </div>
              </div>
            </Card>

            <Card className="rounded-2xl border-gray-200 p-6">
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-gray-900">Condiciones clínicas</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Los grupos se muestran como chips y se administran desde un único flujo de gestión.
                </p>
              </div>

              <div className="space-y-4">
                {groupedConditions.map((group) => (
                  <div key={group.title} className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-gray-900">{group.title}</p>
                        <p className="text-sm text-gray-500">
                          {group.items.length > 0
                            ? `${group.items.length} condición(es) seleccionada(s)`
                            : "Sin condiciones seleccionadas"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsManageConditionsOpen(true)}
                        className="text-sm font-medium text-[#0F5F6D] transition-colors hover:text-[#0d4f5a]"
                      >
                        Gestionar
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {group.items.length === 0 ? (
                        <span className="text-sm text-gray-400">Ninguna seleccionada.</span>
                      ) : (
                        group.items.map((condition) => (
                          <Badge
                            key={condition.id}
                            variant="outline"
                            className={`rounded-full px-3 py-1 text-xs ${scopeColors[condition.scope]}`}
                          >
                            {condition.name}
                          </Badge>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="rounded-2xl border-gray-200 p-6">
              <div className="mb-5">
                <div className="mb-2 flex items-center gap-2">
                  <Pill className="h-4 w-4 text-[#0F5F6D]" />
                  <h2 className="text-lg font-semibold text-gray-900">Medicamentos actuales</h2>
                </div>
                <p className="text-sm text-gray-500">
                  Se resumen aquí, pero su administración visual permanece en la tab de Medicamentos.
                </p>
              </div>

              <div className="space-y-3">
                {currentMedications.map((medication) => (
                  <div
                    key={medication.id}
                    className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3"
                  >
                    <p className="font-medium text-gray-900">
                      {medication.medicationName} {medication.dosage}, {medication.frequency}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => navigate(`/pacientes/${id}?tab=medicamentos`)}
                  className="text-sm font-medium text-[#0F5F6D] transition-colors hover:text-[#0d4f5a]"
                >
                  Gestionar medicamentos
                </button>
                <p className="text-xs text-gray-400">Se administran desde el tab Medicamentos.</p>
              </div>
            </Card>
          </div>

          <div className="xl:sticky xl:top-6 xl:self-start">
            <Card className="rounded-2xl border-gray-200 p-6">
              <div className="mb-5">
                <div className="mb-2 flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-[#0F5F6D]" />
                  <h2 className="text-lg font-semibold text-gray-900">Vista previa del resumen</h2>
                </div>
                <p className="text-sm text-gray-500">
                  La vista previa refleja los cambios que guardarás en la historia clínica del paciente.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Alertas activas
                  </p>
                  <div className="space-y-2">
                    {activeAlerts.length === 0 ? (
                      <p className="text-sm text-gray-400">Sin alertas activas.</p>
                    ) : (
                      activeAlerts.map((condition) => {
                        const tone = getConditionTone(condition);
                        return (
                          <div
                            key={condition.id}
                            className="rounded-2xl border border-gray-200 bg-gray-50 px-3 py-3"
                          >
                            <p className="font-medium text-gray-900">{condition.name}</p>
                            <Badge variant="outline" className={`mt-2 text-xs ${tone.badge}`}>
                              {tone.label}
                            </Badge>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Resumen clínico
                  </p>
                  <p className="text-sm leading-7 text-gray-700">
                    {clinicalSummary || "Sin resumen clínico capturado."}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 px-3 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Tipo de sangre
                    </p>
                    <p className="mt-1 font-medium text-gray-900">{bloodType}</p>
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 px-3 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Embarazo
                    </p>
                    <p className="mt-1 font-medium text-gray-900">{pregnancyStatus}</p>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Precauciones clínicas
                  </p>
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-3">
                    <p className="text-sm leading-7 text-amber-900">
                      {clinicalPrecautions || "Sin precauciones clínicas capturadas."}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Medicamentos actuales
                  </p>
                  <div className="space-y-2">
                    {currentMedications.map((medication) => (
                      <div
                        key={medication.id}
                        className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-3"
                      >
                        <p className="font-medium text-gray-900">
                          {medication.medicationName} {medication.dosage}
                        </p>
                        <p className="mt-1 text-sm text-emerald-800">{medication.frequency}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-teal-200 bg-teal-50 px-4 py-3">
                  <p className="text-sm text-teal-900">
                    La vista previa refleja los cambios que guardarás en la historia clínica del paciente.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <ManageConditionsDrawer
        isOpen={isManageConditionsOpen}
        onClose={() => setIsManageConditionsOpen(false)}
        initialConditions={conditions}
        onSave={setConditions}
      />
    </>
  );
}
