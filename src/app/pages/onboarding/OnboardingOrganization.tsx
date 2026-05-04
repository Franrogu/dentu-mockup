import { useState } from "react";
import { useNavigate } from "react-router";
import { Upload } from "lucide-react";
import { OnboardingWizard } from "../../components/OnboardingWizard";
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
  countryOptionsMock,
  currencyOptionsMock,
  localeOptionsMock,
  organizationMock,
  timezoneOptionsMock,
} from "../../mocks/tenant-baseline.mock";

export function OnboardingOrganization() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    slug: organizationMock.slug,
    commercialName: organizationMock.commercialName,
    legalName: organizationMock.legalName,
    countryCode: organizationMock.countryCode,
    timezone: organizationMock.timezone,
    locale: organizationMock.locale,
    defaultCurrencyCode: organizationMock.defaultCurrencyCode,
    taxId: organizationMock.taxId,
    primaryColor: organizationMock.branding.primaryColor,
  });

  return (
    <OnboardingWizard
      currentStep={1}
      onContinue={() => navigate("/onboarding/clinic")}
      canContinue={
        Boolean(formData.slug) &&
        Boolean(formData.commercialName) &&
        Boolean(formData.legalName)
      }
    >
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Configura tu organizacion
          </h2>
          <p className="text-gray-600">
            El onboarding ahora usa los campos visibles de <code>dental.organizations</code>.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-semibold text-gray-900">Identidad base</h3>
            <span className="text-sm text-red-500">Requerido</span>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="slug">slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(event) =>
                  setFormData({ ...formData, slug: event.target.value })
                }
                placeholder="clinica-del-valle"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="commercialName">commercial_name</Label>
              <Input
                id="commercialName"
                value={formData.commercialName}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    commercialName: event.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="legalName">legal_name</Label>
              <Input
                id="legalName"
                value={formData.legalName}
                onChange={(event) =>
                  setFormData({ ...formData, legalName: event.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="countryCode">country_code</Label>
              <Select
                value={formData.countryCode}
                onValueChange={(value) =>
                  setFormData({ ...formData, countryCode: value })
                }
              >
                <SelectTrigger id="countryCode">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countryOptionsMock.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">timezone</Label>
              <Select
                value={formData.timezone}
                onValueChange={(value) =>
                  setFormData({ ...formData, timezone: value })
                }
              >
                <SelectTrigger id="timezone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timezoneOptionsMock.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="locale">locale</Label>
              <Select
                value={formData.locale}
                onValueChange={(value) =>
                  setFormData({ ...formData, locale: value })
                }
              >
                <SelectTrigger id="locale">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {localeOptionsMock.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultCurrencyCode">default_currency_code</Label>
              <Select
                value={formData.defaultCurrencyCode}
                onValueChange={(value) =>
                  setFormData({ ...formData, defaultCurrencyCode: value })
                }
              >
                <SelectTrigger id="defaultCurrencyCode">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencyOptionsMock.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="taxId">tax_id</Label>
              <Input
                id="taxId"
                value={formData.taxId}
                onChange={(event) =>
                  setFormData({ ...formData, taxId: event.target.value })
                }
                placeholder="RFC o identificador fiscal"
              />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-semibold text-gray-900">branding_json</h3>
            <span className="text-sm text-gray-500">Opcional</span>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>logo</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Placeholder visual del branding inicial
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="primaryColor">primary_color</Label>
              <div className="flex gap-3">
                <input
                  type="color"
                  id="primaryColor"
                  value={formData.primaryColor}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      primaryColor: event.target.value,
                    })
                  }
                  className="h-11 w-20 rounded-lg border border-gray-300 cursor-pointer"
                />
                <Input
                  value={formData.primaryColor}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      primaryColor: event.target.value,
                    })
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
