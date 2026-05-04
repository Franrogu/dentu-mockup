import { useEffect, useState } from "react";
import { CalendarCog, Clock3, Globe, Info } from "lucide-react";
import { SettingsLayout } from "../../../layouts/SettingsLayout";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Switch } from "../../../components/ui/switch";
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
import type { WorkingHours } from "../bookingTypes";

const weekdayLabels: Array<{ key: keyof WorkingHours; label: string }> = [
  { key: "monday", label: "Lunes" },
  { key: "tuesday", label: "Martes" },
  { key: "wednesday", label: "Miercoles" },
  { key: "thursday", label: "Jueves" },
  { key: "friday", label: "Viernes" },
  { key: "saturday", label: "Sabado" },
  { key: "sunday", label: "Domingo" },
];

export function BookingSettingsPage() {
  const { clinics, settings, saveBookingSettings } = useBooking();
  const [selectedClinicId, setSelectedClinicId] = useState(clinics[0]?.id ?? "");
  const [formState, setFormState] = useState(() => settings[0]);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const selectedClinic = clinics.find((clinic) => clinic.id === selectedClinicId) ?? null;
  const selectedSettings = settings.find((setting) => setting.clinicId === selectedClinicId) ?? settings[0];

  useEffect(() => {
    setFormState(selectedSettings);
    setSavedMessage(null);
  }, [selectedSettings]);

  if (!formState) {
    return null;
  }

  const updateWorkingHour = (dayKey: string, field: "enabled" | "start" | "end", value: boolean | string) => {
    setFormState((previousState) => ({
      ...previousState,
      workingHoursJson: {
        ...previousState.workingHoursJson,
        [dayKey]: {
          ...previousState.workingHoursJson[dayKey],
          [field]: value,
        },
      },
    }));
  };

  const handleSave = () => {
    const result = saveBookingSettings({
      clinicId: selectedClinicId,
      defaultSlotDurationMinutes: formState.defaultSlotDurationMinutes,
      minNoticeMinutes: formState.minNoticeMinutes,
      maxDaysAhead: formState.maxDaysAhead,
      internalBookingEnabled: formState.internalBookingEnabled,
      externalBookingEnabled: formState.externalBookingEnabled,
      externalRequiresManualConfirmation: formState.externalRequiresManualConfirmation,
      workingHoursJson: formState.workingHoursJson,
    });

    if (result.ok) {
      setSavedMessage("Cambios guardados en el mock local.");
    } else {
      setSavedMessage(result.error ?? "No fue posible guardar.");
    }
  };

  return (
    <SettingsLayout
      title="Configuracion de agenda"
      description="Parametros operativos alineados a clinic_booking_settings."
    >
      <div className="max-w-5xl space-y-6">
        <Card className="rounded-3xl border-slate-200 p-6">
          <div className="grid gap-4 md:grid-cols-[260px_minmax(0,1fr)]">
            <div className="space-y-2">
              <Label>Clinica</Label>
              <Select value={selectedClinicId} onValueChange={setSelectedClinicId}>
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
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex items-center gap-2">
                <p className="font-medium text-slate-900">{selectedClinic?.name}</p>
                <Badge variant="outline" className="rounded-full border-slate-200 bg-white text-slate-600">
                  {selectedClinic?.code}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-slate-500">{selectedClinic?.addressText}</p>
            </div>
          </div>
        </Card>

        <Card className="rounded-3xl border-slate-200 p-6">
          <div className="flex items-center gap-2">
            <CalendarCog className="h-5 w-5 text-[#0F5F6D]" />
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Agenda interna</h2>
              <p className="text-sm text-slate-500">Estos cambios aplican a nuevas citas.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <div className="space-y-2">
              <Label>Agenda interna habilitada</Label>
              <div className="flex h-11 items-center rounded-xl border border-slate-200 px-3">
                <Switch
                  checked={formState.internalBookingEnabled}
                  onCheckedChange={(checked) => setFormState((previousState) => ({ ...previousState, internalBookingEnabled: checked }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Duracion default</Label>
              <Input
                type="number"
                min={5}
                value={formState.defaultSlotDurationMinutes}
                onChange={(event) =>
                  setFormState((previousState) => ({
                    ...previousState,
                    defaultSlotDurationMinutes: Number(event.target.value),
                  }))
                }
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Min notice minutes</Label>
              <Input
                type="number"
                min={0}
                value={formState.minNoticeMinutes}
                onChange={(event) =>
                  setFormState((previousState) => ({
                    ...previousState,
                    minNoticeMinutes: Number(event.target.value),
                  }))
                }
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Max days ahead</Label>
              <Input
                type="number"
                min={1}
                value={formState.maxDaysAhead}
                onChange={(event) =>
                  setFormState((previousState) => ({
                    ...previousState,
                    maxDaysAhead: Number(event.target.value),
                  }))
                }
                className="h-11 rounded-xl"
              />
            </div>
          </div>
        </Card>

        <Card className="rounded-3xl border-slate-200 p-6">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-slate-500" />
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Booking externo (futuro)</h2>
              <p className="text-sm text-slate-500">Visible para preparar la expansion, sin flujo real implementado.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Booking externo habilitado</p>
                  <p className="text-sm text-slate-500">Solo referencia visual.</p>
                </div>
                <Switch
                  checked={formState.externalBookingEnabled}
                  onCheckedChange={(checked) =>
                    setFormState((previousState) => ({ ...previousState, externalBookingEnabled: checked }))
                  }
                />
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Confirmacion manual requerida</p>
                  <p className="text-sm text-slate-500">Para solicitudes futuras desde canal externo.</p>
                </div>
                <Switch
                  checked={formState.externalRequiresManualConfirmation}
                  onCheckedChange={(checked) =>
                    setFormState((previousState) => ({
                      ...previousState,
                      externalRequiresManualConfirmation: checked,
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="rounded-3xl border-slate-200 p-6">
          <div className="flex items-center gap-2">
            <Clock3 className="h-5 w-5 text-slate-500" />
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Horario laboral</h2>
              <p className="text-sm text-slate-500">Rango semanal usado para calcular la capacidad del dia.</p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {weekdayLabels.map((day) => {
              const rule = formState.workingHoursJson[day.key];
              return (
                <div key={day.key} className="grid items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 md:grid-cols-[140px_120px_1fr_1fr]">
                  <p className="font-medium text-slate-900">{day.label}</p>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={rule.enabled}
                      onCheckedChange={(checked) => updateWorkingHour(day.key, "enabled", checked)}
                    />
                    <span className="text-sm text-slate-500">{rule.enabled ? "Activo" : "Cerrado"}</span>
                  </div>
                  <Input
                    type="time"
                    value={rule.start}
                    disabled={!rule.enabled}
                    onChange={(event) => updateWorkingHour(day.key, "start", event.target.value)}
                    className="h-11 rounded-xl"
                  />
                  <Input
                    type="time"
                    value={rule.end}
                    disabled={!rule.enabled}
                    onChange={(event) => updateWorkingHour(day.key, "end", event.target.value)}
                    className="h-11 rounded-xl"
                  />
                </div>
              );
            })}
          </div>
        </Card>

        <Alert className="border-sky-200 bg-sky-50 text-sky-900">
          <Info className="h-4 w-4" />
          <AlertTitle>Nota operativa</AlertTitle>
          <AlertDescription>Estos cambios aplican a nuevas citas. No se implementa booking externo real en este mock.</AlertDescription>
        </Alert>

        {savedMessage ? (
          <Alert className="border-emerald-200 bg-emerald-50 text-emerald-900">
            <AlertTitle>Estado</AlertTitle>
            <AlertDescription>{savedMessage}</AlertDescription>
          </Alert>
        ) : null}

        <div className="flex justify-end gap-3">
          <Button variant="outline" className="rounded-xl" onClick={() => setFormState(selectedSettings)}>
            Cancelar
          </Button>
          <Button className="rounded-xl bg-[#0F5F6D] hover:bg-[#0d4f5a]" onClick={handleSave}>
            Guardar cambios
          </Button>
        </div>
      </div>
    </SettingsLayout>
  );
}
