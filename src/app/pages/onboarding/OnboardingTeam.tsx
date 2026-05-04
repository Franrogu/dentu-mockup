import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, Mail, Plus, Trash2 } from "lucide-react";
import { OnboardingWizard } from "../../components/OnboardingWizard";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
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
  clinicRecordsMock,
  formatDateOnly,
  invitationExpiryOptionsMock,
  pendingInvitationsMock,
  roleCatalogMock,
} from "../../mocks/tenant-baseline.mock";

interface TeamInviteDraft {
  id: string;
  emailInvited: string;
  intendedRoleCode: string;
  intendedClinicId: string;
  expiresIn: string;
}

export function OnboardingTeam() {
  const navigate = useNavigate();
  const clinicRoles = roleCatalogMock.filter((role) => role.assignmentScope === "clinic");
  const orgRoles = roleCatalogMock.filter((role) => role.assignmentScope === "org");

  const [invites, setInvites] = useState<TeamInviteDraft[]>([
    {
      id: "1",
      emailInvited: "",
      intendedRoleCode: "DENTIST",
      intendedClinicId: clinicRecordsMock[0]?.id ?? "",
      expiresIn: "7d",
    },
  ]);

  const updateInvite = (id: string, field: keyof TeamInviteDraft, value: string) => {
    setInvites((currentInvites) =>
      currentInvites.map((invite) =>
        invite.id === id ? { ...invite, [field]: value } : invite
      )
    );
  };

  return (
    <OnboardingWizard
      currentStep={4}
      onBack={() => navigate("/onboarding/specialties")}
      onContinue={() => navigate("/onboarding/complete")}
      showSkip={true}
      onSkip={() => navigate("/onboarding/complete")}
    >
      <div className="space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl font-semibold text-gray-900">Invita a tu equipo</h2>
              <Badge variant="secondary">Opcional</Badge>
            </div>
            <p className="text-gray-600">
              El onboarding ahora refleja <code>dental.user_invitations</code>.
            </p>
          </div>
          <Button variant="link" onClick={() => navigate("/onboarding/complete")} className="text-[#0F5F6D]">
            Omitir por ahora <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Nuevas invitaciones</h3>

          {invites.map((invite) => (
            <div key={invite.id} className="p-4 border border-gray-200 rounded-lg space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor={`email-${invite.id}`}>email_invited</Label>
                    <Input
                      id={`email-${invite.id}`}
                      type="email"
                      value={invite.emailInvited}
                      onChange={(event) =>
                        updateInvite(invite.id, "emailInvited", event.target.value)
                      }
                      placeholder="persona@clinica.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`role-${invite.id}`}>intended_role_id</Label>
                    <Select
                      value={invite.intendedRoleCode}
                      onValueChange={(value) =>
                        updateInvite(invite.id, "intendedRoleCode", value)
                      }
                    >
                      <SelectTrigger id={`role-${invite.id}`}>
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
                    <Label htmlFor={`clinic-${invite.id}`}>intended_clinic_id</Label>
                    <Select
                      value={invite.intendedClinicId}
                      onValueChange={(value) =>
                        updateInvite(invite.id, "intendedClinicId", value)
                      }
                    >
                      <SelectTrigger id={`clinic-${invite.id}`}>
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

                  <div className="space-y-2 col-span-2">
                    <Label htmlFor={`expires-${invite.id}`}>expires_at</Label>
                    <Select
                      value={invite.expiresIn}
                      onValueChange={(value) => updateInvite(invite.id, "expiresIn", value)}
                    >
                      <SelectTrigger id={`expires-${invite.id}`}>
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

                {invites.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setInvites((currentInvites) =>
                        currentInvites.filter((item) => item.id !== invite.id)
                      )
                    }
                    className="mt-8 hover:bg-red-100 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            onClick={() =>
              setInvites((currentInvites) => [
                ...currentInvites,
                {
                  id: Date.now().toString(),
                  emailInvited: "",
                  intendedRoleCode: "ASSISTANT",
                  intendedClinicId: clinicRecordsMock[0]?.id ?? "",
                  expiresIn: "7d",
                },
              ])
            }
            className="w-full border-dashed"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar otro
          </Button>
        </div>

        <div className="pt-6 border-t border-gray-200 space-y-4">
          <h3 className="font-semibold text-gray-900">Invitaciones pendientes</h3>

          <div className="space-y-2">
            {pendingInvitationsMock.map((invite) => (
              <div
                key={invite.id}
                className="p-4 bg-gray-50 rounded-lg flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{invite.emailInvited}</p>
                    <p className="text-sm text-gray-600">
                      {invite.intendedRoleName} · {invite.intendedClinicCode}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{invite.status}</Badge>
                  <span className="text-sm text-gray-500">
                    Vence {formatDateOnly(invite.expiresAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Alert>
          <Mail className="h-4 w-4" />
          <AlertDescription>
            En el mock, cada invitacion conserva email, rol destino, clinica destino y expiracion.
          </AlertDescription>
        </Alert>
      </div>
    </OnboardingWizard>
  );
}
