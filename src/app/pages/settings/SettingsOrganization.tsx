import { useState } from "react";
import { AlertTriangle, Upload } from "lucide-react";
import { SettingsLayout } from "../../layouts/SettingsLayout";
import { Alert, AlertDescription } from "../../components/ui/alert";
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
import {
  countryOptionsMock,
  currencyOptionsMock,
  localeOptionsMock,
  organizationMock,
  timezoneOptionsMock,
} from "../../mocks/tenant-baseline.mock";

export function SettingsOrganization() {
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
    <SettingsLayout
      title="Configuracion de organizacion"
      description="Mock alineado a dental.organizations: slug, nombres, localizacion, moneda y branding."
    >
      <div className="max-w-4xl space-y-8">
        <Card className="p-6">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="font-semibold text-gray-900">Identidad base</h3>
              <p className="text-sm text-gray-600">
                Campos visibles alineados a <code>dental.organizations</code>.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-green-100 text-green-800">status: {organizationMock.status}</Badge>
              <Button size="sm" className="bg-[#0F5F6D] hover:bg-[#0d4f5a]">
                Guardar cambios
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(event) =>
                  setFormData({ ...formData, slug: event.target.value })
                }
              />
              <p className="text-xs text-gray-500">
                Se usa para resolucion pre-tenant y URL de acceso por organizacion.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="commercialName">commercial_name</Label>
              <Input
                id="commercialName"
                value={formData.commercialName}
                onChange={(event) =>
                  setFormData({ ...formData, commercialName: event.target.value })
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

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="taxId">tax_id</Label>
              <Input
                id="taxId"
                value={formData.taxId}
                onChange={(event) =>
                  setFormData({ ...formData, taxId: event.target.value })
                }
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="font-semibold text-gray-900">branding_json</h3>
              <p className="text-sm text-gray-600">
                En el mock mostramos los campos mas visibles del JSON de branding.
              </p>
            </div>
            <Button size="sm" variant="outline">
              Guardar branding
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-2">
              <Label>Logo</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-700">
                  Archivo mock: {organizationMock.branding.logoFileName}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Este bloque representa almacenamiento dentro de <code>branding_json</code>.
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
                    setFormData({ ...formData, primaryColor: event.target.value })
                  }
                  className="h-11 w-20 rounded-lg border border-gray-300 cursor-pointer"
                />
                <Input
                  value={formData.primaryColor}
                  onChange={(event) =>
                    setFormData({ ...formData, primaryColor: event.target.value })
                  }
                />
              </div>
              <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                  Vista previa
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full border border-gray-200"
                    style={{ backgroundColor: formData.primaryColor }}
                  />
                  <div>
                    <p className="font-medium text-gray-900">{organizationMock.commercialName}</p>
                    <p className="text-sm text-gray-500">Botones y badges destacados</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-amber-200 bg-amber-50">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">Estado de organizacion</h3>
              <Alert className="border-amber-200 bg-white">
                <AlertDescription>
                  El baseline contempla <code>status</code> con valores <code>active</code>,
                  <code>inactive</code> y <code>suspended</code>. En este mock se mantiene como
                  lectura visible para no introducir flujos operativos complejos todavia.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </Card>
      </div>
    </SettingsLayout>
  );
}
