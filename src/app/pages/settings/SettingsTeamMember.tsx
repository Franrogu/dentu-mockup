import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { SettingsLayout } from "../../layouts/SettingsLayout";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
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
  getFullName,
  getTeamMemberById,
  organizationSpecialtiesMock,
  roleCatalogMock,
} from "../../mocks/tenant-baseline.mock";

export function SettingsTeamMember() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const member = getTeamMemberById(id);
  const [activeTab, setActiveTab] = useState("personal");

  if (!member) {
    return (
      <SettingsLayout title="Miembro no encontrado">
        <Card className="p-6">
          <p className="text-gray-600 mb-4">
            El miembro solicitado no existe en el mock alineado al baseline.
          </p>
          <Button onClick={() => navigate("/settings/team")}>Volver al equipo</Button>
        </Card>
      </SettingsLayout>
    );
  }

  const [formData, setFormData] = useState({
    firstName: member.user.firstName,
    lastName: member.user.lastName,
    secondLastName: member.user.secondLastName ?? "",
    email: member.user.email,
    phone: member.user.phone,
    professionalTitle: member.clinicianProfile?.professionalTitle ?? "",
    professionalLicense: member.clinicianProfile?.professionalLicense ?? "",
    licenseCountryCode: member.clinicianProfile?.licenseCountryCode ?? "MX",
    defaultSpecialtyId:
      member.clinicianProfile?.defaultSpecialtyId ??
      organizationSpecialtiesMock[0]?.specialtyId ??
      "spec-general",
    profileStatus: member.clinicianProfile?.profileStatus ?? "active",
  });

  const clinicRoles = roleCatalogMock.filter((role) => role.assignmentScope === "clinic");
  const orgRoles = roleCatalogMock.filter((role) => role.assignmentScope === "org");
  const initials = `${member.user.firstName[0] ?? ""}${member.user.lastName[0] ?? ""}`;

  return (
    <SettingsLayout title="Perfil del miembro">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/settings/team")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al equipo
        </Button>

        <div className="flex items-center gap-4 mb-6">
          <Avatar className="w-16 h-16">
            <AvatarFallback className="bg-[#0F5F6D] text-white text-xl">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">{getFullName(member.user)}</h2>
            <p className="text-gray-600">{member.user.email}</p>
          </div>
          <Badge
            className={
              member.user.status === "active"
                ? "ml-auto bg-green-100 text-green-800"
                : "ml-auto bg-gray-100 text-gray-800"
            }
          >
            {member.user.status}
          </Badge>
        </div>

        <div className="border-b border-gray-200">
          <nav className="flex gap-6">
            {[
              { value: "personal", label: "app_user" },
              { value: "roles", label: "roles y acceso" },
              { value: "clinical", label: "perfil clinico" },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setActiveTab(item.value)}
                className={`pb-3 border-b-2 transition-colors ${
                  item.value === activeTab
                    ? "border-[#0F5F6D] text-[#0F5F6D] font-medium"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-4xl space-y-8">
        {activeTab === "personal" && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900">Campos de app_users</h3>
              <Button size="sm" className="bg-[#0F5F6D] hover:bg-[#0d4f5a]">
                Guardar cambios
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">first_name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(event) =>
                    setFormData({ ...formData, firstName: event.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">last_name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(event) =>
                    setFormData({ ...formData, lastName: event.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondLastName">second_last_name</Label>
                <Input
                  id="secondLastName"
                  value={formData.secondLastName}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      secondLastName: event.target.value,
                    })
                  }
                />
              </div>

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

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email">email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(event) =>
                    setFormData({ ...formData, email: event.target.value })
                  }
                />
                <p className="text-xs text-gray-500">
                  email_normalized se deriva de este valor en el backend real.
                </p>
              </div>
            </div>
          </Card>
        )}

        {activeTab === "roles" && (
          <>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900">user_org_roles</h3>
                <Button size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar rol org
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rol</TableHead>
                    <TableHead>status</TableHead>
                    <TableHead>Vigencia</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {member.orgRoles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-sm text-gray-500">
                        Este usuario no tiene asignaciones org-level en el mock.
                      </TableCell>
                    </TableRow>
                  ) : (
                    member.orgRoles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell>
                          <Select defaultValue={role.roleCode}>
                            <SelectTrigger className="w-[220px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {orgRoles.map((option) => (
                                <SelectItem key={option.code} value={option.code}>
                                  {option.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{role.status}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {role.validFrom ?? "Sin inicio"} - {role.validTo ?? "Abierto"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900">user_clinic_roles</h3>
                <Button size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar clinica
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Clinica</TableHead>
                    <TableHead>Rol en clinica</TableHead>
                    <TableHead>status</TableHead>
                    <TableHead className="w-[100px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {member.clinicRoles.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell>
                        <Select defaultValue={assignment.clinicId}>
                          <SelectTrigger className="w-[220px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {clinicRecordsMock.map((clinic) => (
                              <SelectItem key={clinic.id} value={clinic.id}>
                                {clinic.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select defaultValue={assignment.roleCode}>
                          <SelectTrigger className="w-[220px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {clinicRoles.map((role) => (
                              <SelectItem key={role.code} value={role.code}>
                                {role.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{assignment.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-red-100 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">user_identities</h3>
              <div className="space-y-3">
                {member.identities.map((identity) => (
                  <div
                    key={identity.id}
                    className="rounded-lg border border-gray-200 p-4 flex items-center justify-between gap-4"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{identity.providerType}</p>
                      <p className="text-sm text-gray-500">
                        login_email_normalized: {identity.loginEmailNormalized ?? "NULL"}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">primary: {String(identity.isPrimary)}</Badge>
                      <Badge variant="outline">verified: {String(identity.isVerified)}</Badge>
                      <Badge variant="secondary">status: {identity.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

        {activeTab === "clinical" && (
          <>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900">clinician_profiles</h3>
                <Button size="sm" className="bg-[#0F5F6D] hover:bg-[#0d4f5a]">
                  Guardar cambios
                </Button>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="professionalTitle">professional_title</Label>
                  <Input
                    id="professionalTitle"
                    value={formData.professionalTitle}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        professionalTitle: event.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="professionalLicense">professional_license</Label>
                  <Input
                    id="professionalLicense"
                    value={formData.professionalLicense}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        professionalLicense: event.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="licenseCountryCode">license_country_code</Label>
                  <Select
                    value={formData.licenseCountryCode}
                    onValueChange={(value) =>
                      setFormData({ ...formData, licenseCountryCode: value })
                    }
                  >
                    <SelectTrigger id="licenseCountryCode">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MX">MX</SelectItem>
                      <SelectItem value="CO">CO</SelectItem>
                      <SelectItem value="AR">AR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profileStatus">profile_status</Label>
                  <Select
                    value={formData.profileStatus}
                    onValueChange={(value) =>
                      setFormData({ ...formData, profileStatus: value })
                    }
                  >
                    <SelectTrigger id="profileStatus">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">active</SelectItem>
                      <SelectItem value="inactive">inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="defaultSpecialtyId">default_specialty_id</Label>
                  <Select
                    value={formData.defaultSpecialtyId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, defaultSpecialtyId: value })
                    }
                  >
                    <SelectTrigger id="defaultSpecialtyId">
                      <SelectValue placeholder="Seleccionar especialidad" />
                    </SelectTrigger>
                    <SelectContent>
                      {organizationSpecialtiesMock.map((specialty) => (
                        <SelectItem key={specialty.specialtyId} value={specialty.specialtyId}>
                          {specialty.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900">clinician_specialties</h3>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar especialidad
                </Button>
              </div>

              <div className="space-y-3">
                {member.clinicianSpecialties.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    Este usuario no tiene registro clinico ni especialidades asignadas.
                  </p>
                ) : (
                  member.clinicianSpecialties.map((specialty) => (
                    <div
                      key={specialty.id}
                      className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-900">{specialty.name}</span>
                        <Badge variant="outline">{specialty.code}</Badge>
                        {specialty.isPrimary && (
                          <Badge className="bg-[#0F5F6D]">Principal</Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`primary-${specialty.id}`} className="text-sm">
                            is_primary
                          </Label>
                          <Switch
                            id={`primary-${specialty.id}`}
                            checked={specialty.isPrimary}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`active-${specialty.id}`} className="text-sm">
                            is_active
                          </Label>
                          <Switch
                            id={`active-${specialty.id}`}
                            checked={specialty.isActive}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </>
        )}
      </div>
    </SettingsLayout>
  );
}
