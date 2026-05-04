import { useLocation, useNavigate } from "react-router";
import { Button } from "./ui/button";
import { Check } from "lucide-react";

interface OnboardingWizardProps {
  children: React.ReactNode;
  currentStep: number;
  onBack?: () => void;
  onContinue: () => void;
  canContinue?: boolean;
  showSkip?: boolean;
  onSkip?: () => void;
}

const steps = [
  { number: 1, name: "Organización", path: "/onboarding/organization" },
  { number: 2, name: "Clínica", path: "/onboarding/clinic" },
  { number: 3, name: "Especialidades", path: "/onboarding/specialties" },
  { number: 4, name: "Equipo", path: "/onboarding/team" },
];

export function OnboardingWizard({
  children,
  currentStep,
  onBack,
  onContinue,
  canContinue = true,
  showSkip = false,
  onSkip,
}: OnboardingWizardProps) {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto py-8 px-6">
      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors
                    ${
                      step.number < currentStep
                        ? "bg-[#0F5F6D] text-white"
                        : step.number === currentStep
                        ? "bg-[#0F5F6D] text-white ring-4 ring-teal-100"
                        : "bg-gray-200 text-gray-500"
                    }
                  `}
                >
                  {step.number < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.number
                  )}
                </div>
                <span
                  className={`mt-2 text-sm font-medium ${
                    step.number <= currentStep ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {step.name}
                </span>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-1 mx-4 mt-[-24px]">
                  <div
                    className={`h-full rounded transition-colors ${
                      step.number < currentStep ? "bg-[#0F5F6D]" : "bg-gray-200"
                    }`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        {children}
      </div>

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between">
        <div>
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              Atrás
            </Button>
          )}
        </div>
        <div className="flex items-center gap-3">
          {showSkip && onSkip && (
            <Button variant="ghost" onClick={onSkip}>
              Omitir por ahora →
            </Button>
          )}
          <Button
            onClick={onContinue}
            disabled={!canContinue}
            className="bg-[#0F5F6D] hover:bg-[#0d4f5a]"
          >
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );
}
