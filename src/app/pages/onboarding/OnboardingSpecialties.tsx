import { useState } from "react";
import { useNavigate } from "react-router";
import { Plus, Search, X } from "lucide-react";
import { OnboardingWizard } from "../../components/OnboardingWizard";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { specialtyCatalogMock } from "../../mocks/tenant-baseline.mock";

export function OnboardingSpecialties() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState(["spec-general", "spec-ortho"]);
  const [clinicEnabledIds, setClinicEnabledIds] = useState(["spec-general", "spec-ortho"]);

  const selectedSpecialties = specialtyCatalogMock.filter((item) =>
    selectedIds.includes(item.id)
  );
  const filteredSpecialties = specialtyCatalogMock.filter(
    (item) =>
      !selectedIds.includes(item.id) &&
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <OnboardingWizard
      currentStep={3}
      onBack={() => navigate("/onboarding/clinic")}
      onContinue={() => navigate("/onboarding/team")}
      canContinue={selectedIds.length > 0}
    >
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Define especialidades de tu organizacion
          </h2>
          <p className="text-gray-600">
            El flujo separa catalogo global, alta en organizacion y activacion por clinica.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">clinical_specialties</h3>
              <Badge variant="secondary">{filteredSpecialties.length}</Badge>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar en catalogo global..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="pl-10"
              />
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {filteredSpecialties.map((specialty) => (
                <div
                  key={specialty.id}
                  className="p-3 border border-gray-200 rounded-lg hover:border-[#0F5F6D] transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900 text-sm">{specialty.name}</h4>
                        <Badge variant="outline">{specialty.code}</Badge>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{specialty.description}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedIds([...selectedIds, specialty.id]);
                        setClinicEnabledIds([...clinicEnabledIds, specialty.id]);
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">organization_specialties</h3>
              <Badge className="bg-[#0F5F6D]">{selectedSpecialties.length}</Badge>
            </div>

            <div className="space-y-2 min-h-[200px] border border-gray-200 rounded-lg p-3">
              {selectedSpecialties.length === 0 ? (
                <div className="flex items-center justify-center h-48 text-gray-500">
                  <p className="text-sm">No has seleccionado especialidades</p>
                </div>
              ) : (
                selectedSpecialties.map((specialty) => (
                  <div
                    key={specialty.id}
                    className="p-3 bg-teal-50 border border-[#0F5F6D] rounded-lg"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900 text-sm">{specialty.name}</h4>
                          <Badge variant="outline">{specialty.code}</Badge>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{specialty.description}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedIds(selectedIds.filter((id) => id !== specialty.id));
                          setClinicEnabledIds(
                            clinicEnabledIds.filter((id) => id !== specialty.id)
                          );
                        }}
                        className="hover:bg-red-100 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {selectedSpecialties.length > 0 && (
          <div className="pt-6 border-t border-gray-200 space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">clinic_specialties</h3>
              <p className="text-sm text-gray-600">
                Activa que especialidades estaran disponibles en tu clinica principal.
              </p>
            </div>

            <div className="space-y-3 bg-gray-50 rounded-lg p-4">
              {selectedSpecialties.map((specialty) => (
                <div key={specialty.id} className="flex items-center gap-3">
                  <Checkbox
                    id={`clinic-${specialty.id}`}
                    checked={clinicEnabledIds.includes(specialty.id)}
                    onCheckedChange={() => {
                      setClinicEnabledIds(
                        clinicEnabledIds.includes(specialty.id)
                          ? clinicEnabledIds.filter((id) => id !== specialty.id)
                          : [...clinicEnabledIds, specialty.id]
                      );
                    }}
                  />
                  <Label htmlFor={`clinic-${specialty.id}`} className="flex-1 cursor-pointer">
                    {specialty.name}
                  </Label>
                  <Badge variant="secondary">
                    {clinicEnabledIds.includes(specialty.id) ? "active" : "inactive"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </OnboardingWizard>
  );
}
