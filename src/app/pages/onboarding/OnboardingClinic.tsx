import { useState } from "react";
import { useNavigate } from "react-router";
import { Info, Lock } from "lucide-react";
import { OnboardingWizard } from "../../components/OnboardingWizard";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";
import { clinicRecordsMock } from "../../mocks/tenant-baseline.mock";

export function OnboardingClinic() {
  const navigate = useNavigate();
  const clinic = clinicRecordsMock[0];
  const [formData, setFormData] = useState({
    name: clinic?.name ?? "Clinica principal",
    code: clinic?.code ?? "CDV-001",
    addressText: clinic?.addressText ?? "",
    phone: clinic?.phone ?? "",
    email: clinic?.email ?? "",
  });

  return (
    <OnboardingWizard
      currentStep={2}
      onBack={() => navigate("/onboarding/organization")}
      onContinue={() => navigate("/onboarding/specialties")}
      canContinue={Boolean(formData.name) && Boolean(formData.code)}
    >
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Confirma la clinica principal
          </h2>
          <p className="text-gray-600">
            La pantalla usa los campos visibles de <code>dental.clinics</code>.
          </p>
        </div>

        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-900">
            El registro inicial queda en status <code>active</code>. Podras administrar
            activacion y desactivacion desde Configuracion.
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-semibold text-gray-900">Campos base</h3>
            <span className="text-sm text-red-500">Requerido</span>
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

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="code">code</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Lock className="w-4 h-4 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Codigo unico por organizacion, mostrado en mayusculas.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="relative">
                <Input id="code" value={formData.code} readOnly className="bg-gray-50 pr-10" />
                <Lock className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-semibold text-gray-900">Datos de contacto</h3>
            <span className="text-sm text-gray-500">Opcional</span>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="addressText">address_text</Label>
              <Textarea
                id="addressText"
                value={formData.addressText}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    addressText: event.target.value,
                  })
                }
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phone">phone</Label>
                <Input
                  id="phone"
                  type="tel"
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
          </div>
        </div>
      </div>
    </OnboardingWizard>
  );
}
