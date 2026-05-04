import { useState } from "react";
import { useNavigate } from "react-router";
import { Mail, MoreVertical, Plus } from "lucide-react";
import { SettingsLayout } from "../../layouts/SettingsLayout";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
  clinicRecordsMock,
  formatDateOnly,
  formatDateTime,
  getFullName,
  invitationExpiryOptionsMock,
  pendingInvitationsMock,
  roleCatalogMock,
  teamMembersMock,
} from "../../mocks/tenant-baseline.mock";

export function SettingsTeam() {
  const navigate = useNavigate();
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteDraft, setInviteDraft] = useState({
    emailInvited: "",
    intendedRoleCode: "DENTIST",
    intendedClinicId: clinicRecordsMock[0]?.id ?? "",
    expiresIn: "7d",
  });

  const orgRoles = roleCatalogMock.filter((role) => role.assignmentScope === "org");
  const clinicRoles = roleCatalogMock.filter((role) => role.assignmentScope === "clinic");

  return (
    <SettingsLayout
      title="Equipo"
      description="Mock alineado a app_users, user_identities, user_org_roles, user_clinic_roles y user_invitations."
    >
      <div className="space-y-6">
        <div className="flex justify-end">
          <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
            <DialogTrigger asChild>
              <Button className="bg-[#0F5F6D] hover:bg-[#0d4f5a]">
                <Plus className="w-4 h-4 mr-2" />
                Invitar miembro
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear invitacion mock</DialogTitle>
                <DialogDescription>
                  Campos visibles alineados a <code>dental.user_invitations</code>.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="invite-email">email_invited</Label>
                  <Input
                    id="invite-email"
                    type="email"
                    value={inviteDraft.emailInvited}
                    onChange={(event) =>
                      setInviteDraft({
                        ...inviteDraft,
                        emailInvited: event.target.value,
                      })
                    }
                    placeholder="persona@clinica.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="invite-role">intended_role_id</Label>
                  <Select
                    value={inviteDraft.intendedRoleCode}
                    onValueChange={(value) =>
                      setInviteDraft({ ...inviteDraft, intendedRoleCode: value })
                    }
                  >
                    <SelectTrigger id="invite-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {orgRoles.concat(clinicRoles).map((role) => (
                        <SelectItem key={role.code} value={role.code}>
                          {role.name} · {role.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="invite-clinic">intended_clinic_id</Label>
                  <Select
                    value={inviteDraft.intendedClinicId}
                    onValueChange={(value) =>
                      setInviteDraft({ ...inviteDraft, intendedClinicId: value })
                    }
                  >
                    <SelectTrigger id="invite-clinic">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {clinicRecordsMock.map((clinic) => (
                        <SelectItem key={clinic.id} value={clinic.id}>
                          {clinic.name} · {clinic.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="invite-expiry">expires_at</Label>
                  <Select
                    value={inviteDraft.expiresIn}
                    onValueChange={(value) =>
                      setInviteDraft({ ...inviteDraft, expiresIn: value })
                    }
                  >
                    <SelectTrigger id="invite-expiry">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {invitationExpiryOptionsMock.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                  Cancelar
                </Button>
                <Button className="bg-[#0F5F6D] hover:bg-[#0d4f5a]">
                  Generar invitacion mock
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="members" className="space-y-6">
          <TabsList>
            <TabsTrigger value="members">Miembros</TabsTrigger>
            <TabsTrigger value="pending">
              Invitaciones
              <Badge className="ml-2 bg-[#0F5F6D]">{pendingInvitationsMock.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Rol org</TableHead>
                    <TableHead>Roles de clinica</TableHead>
                    <TableHead>Identidad principal</TableHead>
                    <TableHead>user.status</TableHead>
                    <TableHead className="w-[100px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembersMock.map((member) => {
                    const initials = `${member.user.firstName[0] ?? ""}${member.user.lastName[0] ?? ""}`;
                    const primaryIdentity = member.identities.find((identity) => identity.isPrimary);

                    return (
                      <TableRow key={member.user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback className="bg-[#0F5F6D] text-white">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-900">{getFullName(member.user)}</p>
                              <p className="text-sm text-gray-500">{member.user.email}</p>
                              <p className="text-xs text-gray-400">
                                last_login_at: {formatDateTime(member.user.lastLoginAt)}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {member.orgRoles.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {member.orgRoles.map((role) => (
                                <Badge key={role.id} variant="secondary">
                                  {role.roleName}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">Sin user_org_roles</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            {member.clinicRoles.map((role) => (
                              <Badge key={role.id} variant="outline">
                                {role.clinicCode} · {role.roleName}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          {primaryIdentity ? (
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {primaryIdentity.providerType}
                              </p>
                              <p className="text-xs text-gray-500">
                                verified: {String(primaryIdentity.isVerified)}
                              </p>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">Sin identidad</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              member.user.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {member.user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/settings/team/${member.user.id}`)}
                            >
                              Ver perfil
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Editar app_user</DropdownMenuItem>
                                <DropdownMenuItem>Editar roles</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  Cambiar status
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="pending">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol destino</TableHead>
                    <TableHead>Clinica destino</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Vence</TableHead>
                    <TableHead className="w-[180px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingInvitationsMock.map((invite) => (
                    <TableRow key={invite.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <Mail className="w-5 h-5 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{invite.emailInvited}</p>
                            <p className="text-sm text-gray-500">{invite.emailInvitedNormalized}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{invite.intendedRoleName}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">{invite.intendedClinicName}</p>
                          <p className="text-sm text-gray-500">{invite.intendedClinicCode}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{invite.status}</Badge>
                      </TableCell>
                      <TableCell>{formatDateOnly(invite.expiresAt)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Reenviar
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Revocar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SettingsLayout>
  );
}
