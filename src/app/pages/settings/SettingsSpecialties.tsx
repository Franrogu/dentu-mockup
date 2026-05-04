import { Fragment, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Plus, Search } from "lucide-react";
import { SettingsLayout } from "../../layouts/SettingsLayout";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
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
  clinicRecordsMock,
  clinicSpecialtiesMock,
  organizationSpecialtiesMock,
  specialtyCatalogMock,
} from "../../mocks/tenant-baseline.mock";

export function SettingsSpecialties() {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const availableCatalog = useMemo(
    () =>
      specialtyCatalogMock.filter(
        (catalogItem) =>
          !organizationSpecialtiesMock.some(
            (specialty) => specialty.specialtyId === catalogItem.id
          ) &&
          catalogItem.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [searchTerm]
  );

  return (
    <SettingsLayout
      title="Especialidades"
      description="Mock alineado a clinical_specialties, organization_specialties y clinic_specialties."
    >
      <div className="space-y-8">
        <Card>
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Especialidades de la organizacion</h3>
            <p className="text-sm text-gray-600 mt-1">
              Cada fila representa una relacion de <code>dental.organization_specialties</code>.
            </p>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Codigo</TableHead>
                <TableHead>Especialidad</TableHead>
                <TableHead>is_active</TableHead>
                <TableHead>Clinicas asignadas</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organizationSpecialtiesMock.map((specialty) => {
                const clinicAssignments = clinicSpecialtiesMock.filter(
                  (assignment) => assignment.specialtyId === specialty.specialtyId
                );

                return (
                  <Fragment key={specialty.id}>
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
                        <div className="flex items-center gap-2">
                          <Switch checked={specialty.isActive} />
                          <span className="text-sm text-gray-600">
                            {specialty.isActive ? "true" : "false"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {clinicAssignments.map((assignment) => {
                            const clinic = clinicRecordsMock.find(
                              (record) => record.id === assignment.clinicId
                            );

                            return (
                              <Badge key={assignment.id} variant="secondary">
                                {clinic?.code} · {assignment.isActive ? "active" : "inactive"}
                              </Badge>
                            );
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setExpandedRow(
                              expandedRow === specialty.id ? null : specialty.id
                            )
                          }
                        >
                          {expandedRow === specialty.id ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>

                    {expandedRow === specialty.id && (
                      <TableRow>
                        <TableCell colSpan={5} className="bg-gray-50">
                          <div className="p-4 space-y-4">
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">
                                settings_json mock
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {Object.entries(specialty.settingsJson).map(([key, value]) => (
                                  <Badge key={key} variant="outline">
                                    {key}: {String(value)}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">
                                Activacion por clinica
                              </h4>
                              <div className="space-y-2">
                                {clinicRecordsMock.map((clinic) => {
                                  const assignment = clinicSpecialtiesMock.find(
                                    (item) =>
                                      item.clinicId === clinic.id &&
                                      item.specialtyId === specialty.specialtyId
                                  );

                                  return (
                                    <div
                                      key={clinic.id}
                                      className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3"
                                    >
                                      <div>
                                        <p className="font-medium text-gray-900">{clinic.name}</p>
                                        <p className="text-sm text-gray-500">{clinic.code}</p>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <Switch checked={assignment?.isActive ?? false} />
                                        <span className="text-sm text-gray-600">
                                          {assignment ? "Relacion creada" : "Sin relacion"}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                );
              })}
            </TableBody>
          </Table>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Catalogo global disponible</h3>
              <p className="text-sm text-gray-600">
                Fuente mock de <code>dental.clinical_specialties</code>.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="pl-10"
                placeholder="Buscar por nombre de especialidad..."
              />
            </div>

            <div className="space-y-3">
              {availableCatalog.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Todas las especialidades visibles del catalogo ya se agregaron al mock.
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
                      <Plus className="w-4 h-4 mr-1" />
                      Agregar al mock
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </Card>
      </div>
    </SettingsLayout>
  );
}
