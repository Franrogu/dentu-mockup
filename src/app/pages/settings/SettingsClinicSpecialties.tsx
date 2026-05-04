import { useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Plus } from "lucide-react";
import { SettingsLayout } from "../../layouts/SettingsLayout";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Switch } from "../../components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  getClinicById,
  getClinicSubNav,
  getSpecialtiesForClinic,
  specialtyCatalogMock,
} from "../../mocks/tenant-baseline.mock";

export function SettingsClinicSpecialties() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const clinic = getClinicById(id);

  const clinicSpecialties = useMemo(() => getSpecialtiesForClinic(id), [id]);
  const availableCatalog = useMemo(
    () =>
      specialtyCatalogMock.filter(
        (catalogItem) =>
          !clinicSpecialties.some(
            (organizationSpecialty) =>
              organizationSpecialty.specialtyId === catalogItem.id
          )
      ),
    [clinicSpecialties]
  );

  if (!clinic) {
    return (
      <SettingsLayout title="Clinica no encontrada">
        <Card className="p-6">
          <p className="text-gray-600 mb-4">
            No pudimos resolver la clinica solicitada dentro del mock.
          </p>
          <Button onClick={() => navigate("/settings/clinics")}>Volver a clinicas</Button>
        </Card>
      </SettingsLayout>
    );
  }

  return (
    <SettingsLayout
      title={`${clinic.name} · Especialidades`}
      description="Vista mock para dental.clinic_specialties y dental.organization_specialties."
      subNav={getClinicSubNav(clinic.id)}
    >
      <div className="space-y-8">
        <Button
          variant="ghost"
          onClick={() => navigate(`/settings/clinics/${clinic.id}`)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a datos generales
        </Button>

        <Card>
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Asignaciones de clinica</h3>
            <p className="text-sm text-gray-600 mt-1">
              Cada fila representa una relacion clinic_id + specialty_id con su flag is_active.
            </p>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Codigo</TableHead>
                <TableHead>Especialidad</TableHead>
                <TableHead>Activa en organizacion</TableHead>
                <TableHead>Activa en clinica</TableHead>
                <TableHead>settings_json mock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clinicSpecialties.map((specialty) => (
                <TableRow key={specialty.id}>
                  <TableCell>
                    <Badge variant="outline">{specialty.code}</Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{specialty.name}</p>
                      <p className="text-sm text-gray-500">{specialty.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        specialty.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {specialty.isActive ? "true" : "false"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Switch checked={specialty.clinicIsActive} />
                      <span className="text-sm text-gray-600">
                        {specialty.clinicIsActive ? "true" : "false"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(specialty.settingsJson).map(([key, value]) => (
                        <Badge key={key} variant="secondary">
                          {key}: {String(value)}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Catalogo global disponible</h3>
              <p className="text-sm text-gray-600">
                Estas especialidades existen en <code>dental.clinical_specialties</code> pero aun
                no estan agregadas a la organizacion.
              </p>
            </div>
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Agregar a organizacion
            </Button>
          </div>

          <div className="space-y-3">
            {availableCatalog.length === 0 ? (
              <p className="text-sm text-gray-500">
                Todas las especialidades del catalogo visible ya tienen relacion mock.
              </p>
            ) : (
              availableCatalog.map((specialty) => (
                <div
                  key={specialty.id}
                  className="flex items-start justify-between gap-4 rounded-lg border border-gray-200 p-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{specialty.name}</p>
                      <Badge variant="outline">{specialty.code}</Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{specialty.description}</p>
                  </div>
                  <Button size="sm" className="bg-[#0F5F6D] hover:bg-[#0d4f5a]">
                    Crear relacion mock
                  </Button>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </SettingsLayout>
  );
}
