import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { SettingsLayout } from "../../layouts/SettingsLayout";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";
import {
  formatDateTime,
  getClinicById,
  getClinicSubNav,
} from "../../mocks/tenant-baseline.mock";

export function SettingsClinicDetail() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const clinic = getClinicById(id);

  const [formData, setFormData] = useState({
    name: clinic?.name ?? "Clinica",
    code: clinic?.code ?? "CDV-000",
    status: clinic?.status ?? "active",
    addressText: clinic?.addressText ?? "",
    phone: clinic?.phone ?? "",
    email: clinic?.email ?? "",
  });

  if (!clinic) {
    return (
      <SettingsLayout title="Clinica no encontrada">
        <Card className="p-6">
          <p className="text-gray-600 mb-4">
            La clinica solicitada no existe dentro del mock alineado al baseline.
          </p>
          <Button onClick={() => navigate("/settings/clinics")}>Volver a clinicas</Button>
        </Card>
      </SettingsLayout>
    );
  }

  return (
    <SettingsLayout
      title={clinic.name}
      description="Campos visibles alineados a dental.clinics."
      subNav={getClinicSubNav(clinic.id)}
    >
      <div className="max-w-3xl space-y-8">
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate("/settings/clinics")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a clinicas
          </Button>
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">Registro dental.clinics</h3>
              <Badge variant="outline">{clinic.code}</Badge>
            </div>
            <Button size="sm" className="bg-[#0F5F6D] hover:bg-[#0d4f5a]">
              Guardar cambios
            </Button>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(event) =>
                  setFormData({ ...formData, name: event.target.value })
                }
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="code">code</Label>
                <Input id="code" value={formData.code} readOnly className="bg-gray-50" />
                <p className="text-xs text-gray-500">
                  En baseline es unico por organizacion y permanece estable.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">active</SelectItem>
                    <SelectItem value="inactive">inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="addressText">address_text</Label>
              <Textarea
                id="addressText"
                value={formData.addressText}
                onChange={(event) =>
                  setFormData({ ...formData, addressText: event.target.value })
                }
                rows={3}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(event) =>
                    setFormData({ ...formData, phone: event.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(event) =>
                    setFormData({ ...formData, email: event.target.value })
                  }
                />
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">org_id:</span> {clinic.orgId}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium text-gray-900">deactivated_at:</span>{" "}
                {clinic.deactivatedAt ? formatDateTime(clinic.deactivatedAt) : "NULL"}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-red-200 bg-red-50">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">Cambio de estado</h3>
              <p className="text-sm text-gray-700 mb-4">
                El baseline no elimina clinicas. La vista trabaja sobre <code>status</code> y
                <code>deactivated_at</code>.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    {clinic.status === "active" ? "Desactivar clinica" : "Reactivar mock"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar cambio de estado</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta accion en el mock representa actualizar <code>status</code> y, si
                      aplica, <code>deactivated_at</code>.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                      Confirmar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </Card>
      </div>
    </SettingsLayout>
  );
}
