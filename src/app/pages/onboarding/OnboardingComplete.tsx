import { useEffect } from "react";
import { useNavigate } from "react-router";
import confetti from "canvas-confetti";
import { ArrowRight, Building2, Check, Mail, Stethoscope } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";

export function OnboardingComplete() {
  const navigate = useNavigate();

  useEffect(() => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#0F5F6D", "#3b82f6", "#10b981"],
      });

      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#0F5F6D", "#3b82f6", "#10b981"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-16 px-6 text-center">
      <div className="mb-8 flex justify-center">
        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
          <Check className="w-12 h-12 text-green-600" />
        </div>
      </div>

      <h1 className="text-4xl font-semibold text-gray-900 mb-4">
        Tu clinica esta lista
      </h1>
      <p className="text-xl text-gray-600 mb-12">
        Ya dejaste alineado el mock base con organizacion, clinicas, especialidades y equipo.
      </p>

      <div className="grid grid-cols-3 gap-6 mb-12">
        <Card className="p-6">
          <div className="w-12 h-12 rounded-lg bg-[#0F5F6D]/10 flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-6 h-6 text-[#0F5F6D]" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Organizacion alineada</h3>
          <p className="text-sm text-gray-600">slug, locale, moneda y branding mock</p>
        </Card>

        <Card className="p-6">
          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Especialidades visibles</h3>
          <p className="text-sm text-gray-600">catalogo global, organizacion y clinica</p>
        </Card>

        <Card className="p-6">
          <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Invitaciones alineadas</h3>
          <p className="text-sm text-gray-600">rol destino, clinica destino y expiracion</p>
        </Card>
      </div>

      <div className="space-y-4">
        <Button
          size="lg"
          onClick={() => navigate("/")}
          className="bg-[#0F5F6D] hover:bg-[#0d4f5a] h-12 px-8"
        >
          Ir al Dashboard
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>

        <div className="flex items-center justify-center gap-6 pt-4">
          <button
            onClick={() => navigate("/settings/clinics")}
            className="text-sm text-[#0F5F6D] hover:underline flex items-center gap-1"
          >
            Agregar mas clinicas
          </button>
          <span className="text-gray-300">·</span>
          <button
            onClick={() => navigate("/settings/team")}
            className="text-sm text-[#0F5F6D] hover:underline flex items-center gap-1"
          >
            Completar perfil clinico
          </button>
        </div>
      </div>
    </div>
  );
}
