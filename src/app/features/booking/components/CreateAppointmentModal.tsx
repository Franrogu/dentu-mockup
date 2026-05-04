import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Search, ShieldAlert } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "../../../components/ui/alert";
import { Badge } from "../../../components/ui/badge";
import { useBooking } from "../BookingContext";
import {
  addMinutesToTimeValue,
  buildDateTimeIso,
  findOverlappingAppointment,
  getPatientFullName,
  getPatientInitials,
  toDateInputValue,
} from "../bookingUtils";
import { BOOKING_REFERENCE_DATE } from "../mockData";

interface CreateAppointmentModalProps {
  open: boolean;
  initialPatientId?: string | null;
  onOpenChange: (open: boolean) => void;
}

export function CreateAppointmentModal({
  open,
  initialPatientId,
  onOpenChange,
}: CreateAppointmentModalProps) {
  const {
    appointments,
    clinics,
    patients,
    clinicalRecords,
    users,
    specialties,
    visitTypes,
    settings,
    createAppointment,
  } = useBooking();

  const dentistUsers = users.filter((user) => user.userCategory === "dentist");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [clinicId, setClinicId] = useState(clinics[0]?.id ?? "");
  const [attendingUserId, setAttendingUserId] = useState<string>("unassigned");
  const [specialtyId, setSpecialtyId] = useState<string>("none");
  const [visitTypeId, setVisitTypeId] = useState<string>(visitTypes[0]?.id ?? "");
  const [dateValue, setDateValue] = useState(BOOKING_REFERENCE_DATE);
  const [timeValue, setTimeValue] = useState("09:00");
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [reasonForVisit, setReasonForVisit] = useState("");
  const [patientNotes, setPatientNotes] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const selectedPatient = patients.find((patient) => patient.id === selectedPatientId) ?? null;
  const selectedRecord = clinicalRecords.find((record) => record.patientId === selectedPatientId) ?? null;
  const selectedClinicSettings = settings.find((setting) => setting.clinicId === clinicId) ?? null;
  const selectedDentist = dentistUsers.find((user) => user.id === attendingUserId) ?? null;

  useEffect(() => {
    if (!open) return;

    const defaultClinicId = clinics[0]?.id ?? "";
    const defaultDuration = settings.find((setting) => setting.clinicId === defaultClinicId)?.defaultSlotDurationMinutes ?? 30;

    setSearchTerm("");
    setSelectedPatientId(initialPatientId ?? "");
    setClinicId(defaultClinicId);
    setAttendingUserId("unassigned");
    setSpecialtyId("none");
    setVisitTypeId(visitTypes[0]?.id ?? "");
    setDateValue(BOOKING_REFERENCE_DATE);
    setTimeValue("09:00");
    setDurationMinutes(defaultDuration);
    setReasonForVisit("");
    setPatientNotes("");
    setInternalNotes("");
    setFormError(null);
  }, [open, clinics, initialPatientId, settings, visitTypes]);

  useEffect(() => {
    if (!selectedClinicSettings) return;
    setDurationMinutes(selectedClinicSettings.defaultSlotDurationMinutes);
  }, [selectedClinicSettings]);

  useEffect(() => {
    if (!selectedDentist) {
      setSpecialtyId("none");
      return;
    }

    const firstSpecialty = selectedDentist.specialtyIds[0];
    if (firstSpecialty) {
      setSpecialtyId(firstSpecialty);
    }
  }, [selectedDentist]);

  const filteredPatients = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();
    if (!normalizedTerm) {
      return patients;
    }

    return patients.filter((patient) => {
      return (
        getPatientFullName(patient).toLowerCase().includes(normalizedTerm) ||
        patient.patientCode.toLowerCase().includes(normalizedTerm) ||
        patient.phone?.toLowerCase().includes(normalizedTerm)
      );
    });
  }, [patients, searchTerm]);

  const scheduledStartAt = buildDateTimeIso(dateValue, timeValue);
  const endTimeValue = addMinutesToTimeValue(timeValue, durationMinutes);
  const scheduledEndAt = buildDateTimeIso(dateValue, endTimeValue);

  const overlappingAppointment = findOverlappingAppointment(
    appointments,
    attendingUserId === "unassigned" ? null : attendingUserId,
    scheduledStartAt,
    scheduledEndAt,
  );

  const isArchivedRecord = selectedRecord?.status === "archived";

  const handleSave = () => {
    const result = createAppointment({
      clinicId,
      patientId: selectedPatientId,
      clinicalRecordId: selectedRecord?.id ?? "",
      attendingUserId: attendingUserId === "unassigned" ? null : attendingUserId,
      specialtyId: specialtyId === "none" ? null : specialtyId,
      visitTypeId,
      scheduledStartAt,
      scheduledEndAt,
      reasonForVisit: reasonForVisit || null,
      patientNotes: patientNotes || null,
      internalNotes: internalNotes || null,
    });

    if (!result.ok) {
      setFormError(result.error ?? "No fue posible crear la cita.");
      return;
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-4xl overflow-y-auto rounded-3xl border-slate-200 p-0">
        <DialogHeader className="border-b border-slate-200 px-6 py-5">
          <DialogTitle>Nueva cita</DialogTitle>
          <DialogDescription>Crea una cita interna usando solo datos mock en memoria.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 px-6 py-6">
          <section className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">A. Paciente</h3>
              <p className="text-sm text-slate-500">Busca por nombre, telefono o codigo.</p>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar paciente"
                className="h-11 rounded-2xl pl-10"
              />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {filteredPatients.map((patient) => {
                const record = clinicalRecords.find((item) => item.patientId === patient.id);
                const isSelected = patient.id === selectedPatientId;

                return (
                  <button
                    key={patient.id}
                    type="button"
                    onClick={() => setSelectedPatientId(patient.id)}
                    className={`rounded-2xl border px-4 py-4 text-left transition ${
                      isSelected
                        ? "border-[#0F5F6D] bg-teal-50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">{getPatientFullName(patient)}</p>
                        <p className="text-sm text-slate-500">{patient.patientCode}</p>
                      </div>
                      <Badge variant="outline" className="rounded-full border-slate-200 bg-slate-50 text-slate-600">
                        {patient.status}
                      </Badge>
                    </div>
                    <div className="mt-3 text-sm text-slate-600">
                      <p>{patient.phone || "Sin telefono"}</p>
                      <p>{patient.email || "Sin email"}</p>
                      <p className="mt-2 text-xs uppercase tracking-wide text-slate-400">
                        {record?.recordNumber || "Sin expediente"}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {selectedPatient && selectedRecord ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-base font-semibold text-slate-900">{getPatientFullName(selectedPatient)}</p>
                    <p className="text-sm text-slate-500">
                      {selectedPatient.patientCode} · {selectedRecord.recordNumber}
                    </p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0F5F6D] text-sm font-semibold text-white">
                    {getPatientInitials(selectedPatient)}
                  </div>
                </div>
              </div>
            ) : null}

            {isArchivedRecord ? (
              <Alert className="border-amber-200 bg-amber-50 text-amber-900">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Expediente archivado</AlertTitle>
                <AlertDescription>Debes reactivar el expediente antes de guardar la cita.</AlertDescription>
              </Alert>
            ) : null}
          </section>

          <section className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">B. Fecha y horario</h3>
              <p className="text-sm text-slate-500">Valida disponibilidad local del dentista.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="dateValue">Fecha</Label>
                <Input
                  id="dateValue"
                  type="date"
                  value={dateValue}
                  min={toDateInputValue(`${BOOKING_REFERENCE_DATE}T00:00:00-06:00`)}
                  onChange={(event) => setDateValue(event.target.value)}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeValue">Hora inicio</Label>
                <Input
                  id="timeValue"
                  type="time"
                  value={timeValue}
                  onChange={(event) => setTimeValue(event.target.value)}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="durationMinutes">Duracion</Label>
                <Input
                  id="durationMinutes"
                  type="number"
                  min={5}
                  step={5}
                  value={durationMinutes}
                  onChange={(event) => setDurationMinutes(Number(event.target.value))}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Hora fin</Label>
                <div className="flex h-11 items-center rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700">
                  {endTimeValue}
                </div>
              </div>
            </div>

            {overlappingAppointment ? (
              <Alert variant="destructive" className="border-rose-200 bg-rose-50 text-rose-800">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Horario ocupado</AlertTitle>
                <AlertDescription>
                  El dentista ya tiene una cita activa en ese bloque.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="border-emerald-200 bg-emerald-50 text-emerald-800">
                <AlertTitle>Horario disponible</AlertTitle>
                <AlertDescription>El bloque puede reservarse en el mock local.</AlertDescription>
              </Alert>
            )}
          </section>

          <section className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">C. Atencion</h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Clinica</Label>
                <Select value={clinicId} onValueChange={setClinicId}>
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue placeholder="Selecciona una clinica" />
                  </SelectTrigger>
                  <SelectContent>
                    {clinics.map((clinic) => (
                      <SelectItem key={clinic.id} value={clinic.id}>
                        {clinic.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Dentista</Label>
                <Select value={attendingUserId} onValueChange={setAttendingUserId}>
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue placeholder="Selecciona un dentista" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Sin asignar</SelectItem>
                    {dentistUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Especialidad</Label>
                <Select value={specialtyId} onValueChange={setSpecialtyId}>
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue placeholder="Selecciona una especialidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin especialidad</SelectItem>
                    {specialties.map((specialty) => (
                      <SelectItem key={specialty.id} value={specialty.id}>
                        {specialty.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tipo de visita</Label>
                <Select value={visitTypeId} onValueChange={setVisitTypeId}>
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {visitTypes.map((visitType) => (
                      <SelectItem key={visitType.id} value={visitType.id}>
                        {visitType.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">D. Motivo</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reasonForVisit">Motivo de la visita</Label>
                <Input
                  id="reasonForVisit"
                  value={reasonForVisit}
                  onChange={(event) => setReasonForVisit(event.target.value)}
                  placeholder="Ej. Revision por sensibilidad"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientNotes">Notas del paciente</Label>
                <Textarea
                  id="patientNotes"
                  value={patientNotes}
                  onChange={(event) => setPatientNotes(event.target.value)}
                  placeholder="Preferencias u observaciones compartidas por el paciente"
                  className="rounded-2xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="internalNotes">Notas internas</Label>
                <Textarea
                  id="internalNotes"
                  value={internalNotes}
                  onChange={(event) => setInternalNotes(event.target.value)}
                  placeholder="Notas operativas para recepcion o dentista"
                  className="rounded-2xl"
                />
              </div>
            </div>
          </section>

          {formError ? (
            <Alert variant="destructive" className="border-rose-200 bg-rose-50 text-rose-800">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>No se pudo guardar</AlertTitle>
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          ) : null}
        </div>

        <DialogFooter className="border-t border-slate-200 px-6 py-5">
          <Button variant="outline" className="rounded-xl" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            className="rounded-xl bg-[#0F5F6D] hover:bg-[#0d4f5a]"
            onClick={handleSave}
            disabled={!selectedPatient || !selectedRecord || isArchivedRecord || !!overlappingAppointment}
          >
            Guardar cita
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
