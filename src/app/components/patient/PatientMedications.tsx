import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowRight, Pill, X } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  createLocalUuid,
  getMedicationStatusPresentation,
  medicationStatusColors,
  medicationStatusLabels,
} from "./types";
import type { MockMedication, MedicationStatus } from "./types";

interface PatientMedicationsProps {
  initialMedications?: MockMedication[];
}

interface MedicationDraftInput {
  medicationName: string;
  dosage: string | null;
  frequency: string | null;
  route: string | null;
  indication: string | null;
  startedOn: string | null;
  endedOn: string | null;
  status: MedicationStatus;
  notes?: string;
}

interface AddMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (medication: MedicationDraftInput) => void;
}

function AddMedicationModal({ isOpen, onClose, onAdd }: AddMedicationModalProps) {
  const [form, setForm] = useState({
    medicationName: "",
    dosage: "",
    frequency: "",
    route: "",
    indication: "",
    startedOn: "",
    endedOn: "",
    status: "current" as MedicationStatus,
    notes: "",
  });

  if (!isOpen) return null;

  const inputClass =
    "h-10 w-full rounded-xl border border-gray-300 px-3 text-sm text-gray-900 outline-none transition " +
    "focus:border-transparent focus:ring-2 focus:ring-[#0F5F6D]";

  const handleSubmit = () => {
    if (!form.medicationName.trim()) return;

    onAdd({
      medicationName: form.medicationName,
      dosage: form.dosage || null,
      frequency: form.frequency || null,
      route: form.route || null,
      indication: form.indication || null,
      startedOn: form.startedOn || null,
      endedOn: form.endedOn || null,
      status: form.status,
      notes: form.notes || undefined,
    });

    setForm({
      medicationName: "",
      dosage: "",
      frequency: "",
      route: "",
      indication: "",
      startedOn: "",
      endedOn: "",
      status: "current",
      notes: "",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-gray-200 bg-white px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Registrar medicamento</h2>
            <p className="mt-0.5 text-sm text-gray-500">
              Registro visual local manteniendo el shape compatible con `patient_medications`.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Medicamento</label>
            <input
              value={form.medicationName}
              onChange={(event) => setForm({ ...form, medicationName: event.target.value })}
              placeholder="Ej. Losartán"
              className={inputClass}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Dosis</label>
              <input
                value={form.dosage}
                onChange={(event) => setForm({ ...form, dosage: event.target.value })}
                placeholder="50 mg"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Frecuencia</label>
              <input
                value={form.frequency}
                onChange={(event) => setForm({ ...form, frequency: event.target.value })}
                placeholder="Una vez al día"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Vía</label>
              <input
                value={form.route}
                onChange={(event) => setForm({ ...form, route: event.target.value })}
                placeholder="Oral"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Indicación</label>
              <input
                value={form.indication}
                onChange={(event) => setForm({ ...form, indication: event.target.value })}
                placeholder="Hipertensión arterial"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Registrado por</label>
              <div className="flex h-10 items-center rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-500">
                Equipo clínico
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Inicio</label>
              <input
                value={form.startedOn}
                onChange={(event) => setForm({ ...form, startedOn: event.target.value })}
                placeholder="10 Mar 2025"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Fin</label>
              <input
                value={form.endedOn}
                onChange={(event) => setForm({ ...form, endedOn: event.target.value })}
                placeholder="Opcional"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Estado</label>
              <div className="flex flex-wrap gap-2">
                {(["current", "paused", "stopped", "unknown"] as MedicationStatus[]).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setForm({ ...form, status })}
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                      form.status === status
                        ? medicationStatusColors[status]
                        : "border-gray-200 bg-white text-gray-500 hover:border-gray-400"
                    }`}
                  >
                    {medicationStatusLabels[status]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Notas</label>
            <textarea
              value={form.notes}
              onChange={(event) => setForm({ ...form, notes: event.target.value })}
              rows={3}
              placeholder="Observaciones clínicas"
              className="w-full rounded-2xl border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-transparent focus:ring-2 focus:ring-[#0F5F6D]"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            className="bg-[#0F5F6D] hover:bg-[#0d4f5a]"
            onClick={handleSubmit}
            disabled={!form.medicationName.trim()}
          >
            Guardar medicamento
          </Button>
        </div>
      </div>
    </div>
  );
}

function toLocalMedication(
  medication: MedicationDraftInput,
  templateMedication: MockMedication | undefined,
): MockMedication {
  const nowIso = new Date().toISOString();
  const todayLabel = new Date().toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return {
    id: createLocalUuid(),
    orgId: templateMedication?.orgId ?? createLocalUuid(),
    patientId: templateMedication?.patientId ?? createLocalUuid(),
    clinicalRecordId: templateMedication?.clinicalRecordId ?? createLocalUuid(),
    medicationName: medication.medicationName,
    dosage: medication.dosage,
    frequency: medication.frequency,
    route: medication.route,
    indication: medication.indication,
    startedOn: medication.startedOn,
    endedOn: medication.endedOn,
    status: medication.status,
    notes: medication.notes,
    recordedByUserId: templateMedication?.recordedByUserId ?? createLocalUuid(),
    recordedByDisplayName: templateMedication?.recordedByDisplayName ?? "Equipo clínico",
    recordedAt: todayLabel,
    updatedAt: nowIso,
  };
}

export function PatientMedications({ initialMedications = [] }: PatientMedicationsProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [medications, setMedications] = useState<MockMedication[]>(initialMedications);

  const currentMedications = medications.filter((medication) => medication.status === "current");
  const historicalMedications = medications.filter((medication) => medication.status !== "current");
  const suspendedCount = medications.filter(
    (medication) => getMedicationStatusPresentation(medication).label === "Suspendido",
  ).length;

  const handleAddMedication = (medication: MedicationDraftInput) => {
    setMedications((current) => [toLocalMedication(medication, current[0]), ...current]);
    setIsAddModalOpen(false);
  };

  return (
    <>
      <div className="space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Medicamentos</h2>
            <p className="mt-1 text-sm text-gray-500">
              Medicación actual e histórica del paciente con una presentación consistente con la historia clínica.
            </p>
          </div>
          <Button className="bg-[#0F5F6D] hover:bg-[#0d4f5a]" onClick={() => setIsAddModalOpen(true)}>
            Registrar medicamento
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="rounded-2xl border-emerald-200 bg-emerald-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Activos</p>
            <p className="mt-2 text-3xl font-bold text-emerald-700">{currentMedications.length}</p>
          </Card>
          <Card className="rounded-2xl border-orange-200 bg-orange-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">Suspendidos</p>
            <p className="mt-2 text-3xl font-bold text-orange-700">{suspendedCount}</p>
          </Card>
          <Card className="rounded-2xl border-violet-200 bg-violet-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">Históricos</p>
            <p className="mt-2 text-3xl font-bold text-violet-700">{historicalMedications.length}</p>
          </Card>
        </div>

        <div className="rounded-2xl border border-teal-200 bg-teal-50/80 px-4 py-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-teal-900">
              Las condiciones clínicas se gestionan desde Historia clínica para evitar duplicados.
            </p>
            <button
              type="button"
              onClick={() => navigate(`/pacientes/${id}?tab=historia-clinica`)}
              className="inline-flex items-center gap-1 text-sm font-medium text-[#0F5F6D] transition-colors hover:text-[#0d4f5a]"
            >
              Ir a Historia clínica
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <Card className="rounded-2xl border-gray-200 p-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Pill className="h-4 w-4 text-[#0F5F6D]" />
                  <h3 className="text-lg font-semibold text-gray-900">Medicamentos actuales</h3>
                </div>
                <p className="text-sm text-gray-500">
                  Registro visual principal para los tratamientos activos del paciente.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsAddModalOpen(true)}>
                Registrar medicamento
              </Button>
            </div>

            <div className="space-y-3">
              {currentMedications.map((medication) => {
                const statusPresentation = getMedicationStatusPresentation(medication);

                return (
                  <div
                    key={medication.id}
                    className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4"
                  >
                    <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-gray-900">
                            {medication.medicationName} {medication.dosage}
                          </p>
                          <Badge variant="outline" className={`text-xs ${statusPresentation.className}`}>
                            {statusPresentation.label}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">{medication.frequency}</p>
                      </div>
                      <Badge variant="outline" className="border-teal-200 bg-white text-xs text-[#0F5F6D]">
                        {medication.route}
                      </Badge>
                    </div>

                    <div className="grid gap-3 text-sm text-gray-600 md:grid-cols-2">
                      <p>Inicio: <span className="text-gray-900">{medication.startedOn}</span></p>
                      <p>Indicación: <span className="text-gray-900">{medication.indication}</span></p>
                      <p>Registrado por: <span className="text-gray-900">{medication.recordedByDisplayName ?? "Equipo clínico"}</span></p>
                      <p>Notas: <span className="text-gray-900">{medication.notes}</span></p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="rounded-2xl border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900">Alertas relacionadas</h3>
            <p className="mt-1 text-sm text-gray-500">
              Relación visual entre medicación activa y alertas clínicas relevantes.
            </p>

            <div className="mt-5 space-y-3">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                <p className="font-medium text-gray-900">Losartán</p>
                <p className="mt-1 text-sm text-emerald-800">
                  Está relacionado con: Hipertensión arterial.
                </p>
              </div>
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="font-medium text-gray-900">Alergia a penicilina</p>
                <p className="mt-1 text-sm text-red-800">
                  Permanece como alerta activa independiente.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate(`/pacientes/${id}?tab=historia-clinica`)}
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#0F5F6D] transition-colors hover:text-[#0d4f5a]"
            >
              Ver alertas en Historia clínica
              <ArrowRight className="h-4 w-4" />
            </button>
          </Card>
        </div>

        <Card className="rounded-2xl border-gray-200 p-6">
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-gray-900">Historial de medicamentos</h3>
            <p className="mt-1 text-sm text-gray-500">
              Resumen liviano de tratamientos previos sin convertirlo en una tabla pesada.
            </p>
          </div>

          <div className="space-y-3">
            {historicalMedications.map((medication) => {
              const statusPresentation = getMedicationStatusPresentation(medication);

              return (
                <div
                  key={medication.id}
                  className="rounded-2xl border border-gray-200 bg-white px-4 py-4"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-gray-900">
                          {medication.medicationName} {medication.dosage}
                        </p>
                        <Badge variant="outline" className={`text-xs ${statusPresentation.className}`}>
                          {statusPresentation.label}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{medication.notes}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {medication.startedOn}
                      {medication.endedOn ? ` · ${medication.endedOn}` : ""}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <AddMedicationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddMedication}
      />
    </>
  );
}
