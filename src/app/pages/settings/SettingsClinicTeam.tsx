import { useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Mail, UserPlus } from "lucide-react";
import { SettingsLayout } from "../../layouts/SettingsLayout";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  formatDateOnly,
  getClinicAssignmentsForClinic,
  getClinicById,
  getClinicSubNav,
  getFullName,
  pendingInvitationsMock,
} from "../../mocks/tenant-baseline.mock";

export function SettingsClinicTeam() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const clinic = getClinicById(id);

  const assignedMembers = useMemo(() => getClinicAssignmentsForClinic(id), [id]);
  const clinicInvitations = useMemo(
    () => pendingInvitationsMock.filter((invite) => invite.intendedClinicId === id),
    [id]
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
      title={`${clinic.name} · Equipo`}
      description="Vista mock para user_clinic_roles, perfiles clinicos e invitaciones dirigidas a la clinica."
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
          <div className="p-6 border-b border-gray-200 flex items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-gray-900">Asignaciones activas</h3>
              <p className="text-sm text-gray-600 mt-1">
                Filtradas por <code>clinic_id</code> en <code>dental.user_clinic_roles</code>.
              </p>
            </div>
            <Button className="bg-[#0F5F6D] hover:bg-[#0d4f5a]">
              <UserPlus className="w-4 h-4 mr-2" />
              Asignar miembro
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Miembro</TableHead>
                <TableHead>user.status</TableHead>
                <TableHead>Rol de clinica</TableHead>
                <TableHead>Rol org</TableHead>
                <TableHead>Perfil clinico</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignedMembers.map((member) => {
                const clinicRoles = member.clinicRoles.filter(
                  (assignment) => assignment.clinicId === clinic.id
                );
                const orgRole = member.orgRoles[0];
                const profile = member.clinicianProfile;

                return (
                  <TableRow key={member.user.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{getFullName(member.user)}</p>
                        <p className="text-sm text-gray-500">{member.user.email}</p>
                      </div>
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
                      <div className="flex flex-wrap gap-2">
                        {clinicRoles.map((role) => (
                          <Badge key={role.id} variant="outline">
                            {role.roleName} · {role.status}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {orgRole ? (
                        <Badge variant="secondary">{orgRole.roleName}</Badge>
                      ) : (
                        <span className="text-sm text-gray-500">Sin user_org_roles</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {profile ? (
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {profile.professionalTitle}
                          </p>
                          <p className="text-sm text-gray-500">
                            {profile.professionalLicense} · {profile.licenseCountryCode}
                          </p>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">No aplica</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>

        <Card>
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Invitaciones dirigidas a esta clinica</h3>
            <p className="text-sm text-gray-600 mt-1">
              Basado en <code>dental.user_invitations.intended_clinic_id</code>.
            </p>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Rol previsto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Vence</TableHead>
                <TableHead>Invito</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clinicInvitations.map((invite) => (
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
                    <Badge variant="outline">{invite.status}</Badge>
                  </TableCell>
                  <TableCell>{formatDateOnly(invite.expiresAt)}</TableCell>
                  <TableCell>{invite.invitedByName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </SettingsLayout>
  );
}
