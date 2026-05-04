import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Mail, MapPin, Phone, Plus, Settings, Users } from "lucide-react";
import { SettingsLayout } from "../../layouts/SettingsLayout";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { clinicRecordsMock } from "../../mocks/tenant-baseline.mock";

export function SettingsClinics() {
  const navigate = useNavigate();
  const [showNewClinic, setShowNewClinic] = useState(false);
  const [draftClinic, setDraftClinic] = useState({
    name: "",
    code: "CDV-003",
    addressText: "",
    phone: "",
    email: "",
    status: "active",
  });

  const clinics = useMemo(() => clinicRecordsMock, []);

  return (
    <SettingsLayout
      title="Clinicas"
      description="Mock alineado a dental.clinics: code, name, status, address_text, phone, email y deactivated_at."
    >
      <div className="space-y-6">
        <div className="flex justify-end">
          <Dialog open={showNewClinic} onOpenChange={setShowNewClinic}>
            <DialogTrigger asChild>
              <Button className="bg-[#0F5F6D] hover:bg-[#0d4f5a]">
                <Plus className="w-4 h-4 mr-2" />
                Agregar clinica
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nueva clinica</DialogTitle>
                <DialogDescription>
                  Formulario mock alineado a las columnas visibles del baseline.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="new-clinic-name">name</Label>
                  <Input
                    id="new-clinic-name"
                    value={draftClinic.name}
                    onChange={(event) =>
                      setDraftClinic({ ...draftClinic, name: event.target.value })
                    }
                    placeholder="Clinica Satelite"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-clinic-code">code</Label>
                  <Input
                    id="new-clinic-code"
                    value={draftClinic.code}
                    onChange={(event) =>
                      setDraftClinic({
                        ...draftClinic,
                        code: event.target.value.toUpperCase(),
                      })
                    }
                  />
                  <p className="text-xs text-gray-500">
                    En baseline el codigo es unico por organizacion y se guarda en mayusculas.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-clinic-status">status</Label>
                  <Select
                    value={draftClinic.status}
                    onValueChange={(value) =>
                      setDraftClinic({ ...draftClinic, status: value })
                    }
                  >
                    <SelectTrigger id="new-clinic-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">active</SelectItem>
                      <SelectItem value="inactive">inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-clinic-address">address_text</Label>
                  <Input
                    id="new-clinic-address"
                    value={draftClinic.addressText}
                    onChange={(event) =>
                      setDraftClinic({
                        ...draftClinic,
                        addressText: event.target.value,
                      })
                    }
                    placeholder="Direccion completa"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-clinic-phone">phone</Label>
                    <Input
                      id="new-clinic-phone"
                      value={draftClinic.phone}
                      onChange={(event) =>
                        setDraftClinic({ ...draftClinic, phone: event.target.value })
                      }
                      placeholder="+52 55 1234 5678"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-clinic-email">email</Label>
                    <Input
                      id="new-clinic-email"
                      type="email"
                      value={draftClinic.email}
                      onChange={(event) =>
                        setDraftClinic({ ...draftClinic, email: event.target.value })
                      }
                      placeholder="sucursal@clinica.com"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowNewClinic(false)}>
                  Cancelar
                </Button>
                <Button className="bg-[#0F5F6D] hover:bg-[#0d4f5a]">
                  Crear mock
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          {clinics.map((clinic) => (
            <Card key={clinic.id} className="p-6">
              <div className="flex items-start justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#0F5F6D]/10 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-[#0F5F6D]" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{clinic.name}</h3>
                      <Badge variant="outline">{clinic.code}</Badge>
                      <Badge
                        className={
                          clinic.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {clinic.status}
                      </Badge>
                    </div>

                    <div className="grid gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{clinic.addressText}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4">
                        <span className="inline-flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {clinic.phone}
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {clinic.email}
                        </span>
                      </div>
                      {clinic.deactivatedAt && (
                        <p className="text-xs text-amber-700">
                          deactivated_at: {new Intl.DateTimeFormat("es-MX", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          }).format(new Date(clinic.deactivatedAt))}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => navigate(`/settings/clinics/${clinic.id}`)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Configurar
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-4 mt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-gray-900">{clinic.specialtyCount}</span>{" "}
                  clinic_specialties visibles
                </div>
                <div className="inline-flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>
                    <span className="font-medium text-gray-900">{clinic.teamMemberCount}</span>{" "}
                    user_clinic_roles activos
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </SettingsLayout>
  );
}
