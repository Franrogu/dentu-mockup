import { useState } from "react";
import { Building2, Check, ChevronDown, Settings } from "lucide-react";
import { useNavigate } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { getClinicColor } from "../constants/clinics";
import { cn } from "./ui/utils";
import { useBooking } from "../features/booking/BookingContext";

export function ClinicSelector() {
  const { clinics, users } = useBooking();
  const [selectedClinicId, setSelectedClinicId] = useState<string | "all">("all");
  const navigate = useNavigate();

  const selectedClinic = selectedClinicId === "all" ? null : clinics.find((clinic) => clinic.id === selectedClinicId) ?? null;
  const dentists = users.filter((user) => user.userCategory === "dentist");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-xl px-3 py-2 transition-colors hover:bg-gray-100">
        {selectedClinic ? (
          <>
            <span
              className={cn(
                "h-3 w-3 rounded-sm",
                getClinicColor(selectedClinic.id === "clinic-roma" ? "violet" : "teal").dot,
              )}
            />
            <span className="text-sm font-medium text-gray-900">{selectedClinic.name}</span>
          </>
        ) : (
          <>
            <Building2 className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">Todas las clinicas</span>
          </>
        )}
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-[280px]">
        <DropdownMenuItem onClick={() => setSelectedClinicId("all")} className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-gray-600" />
            Todas las clinicas
          </span>
          {selectedClinicId === "all" ? <Check className="h-4 w-4 text-[#0F5F6D]" /> : null}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {clinics.map((clinic) => {
          const colors = getClinicColor(clinic.id === "clinic-roma" ? "violet" : "teal");

          return (
            <DropdownMenuItem
              key={clinic.id}
              onClick={() => setSelectedClinicId(clinic.id)}
              className="flex flex-col items-start py-3"
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={cn("h-3 w-3 rounded-sm", colors.dot)} />
                  <span className="font-medium">{clinic.name}</span>
                </div>
                {selectedClinicId === clinic.id ? <Check className="h-4 w-4 text-[#0F5F6D]" /> : null}
              </div>
              <div className="ml-5 mt-1 flex items-center gap-2">
                <span className={cn("rounded-md border px-2 py-0.5 text-xs", colors.bg, colors.text, colors.border)}>
                  {clinic.code}
                </span>
                <span className="text-xs text-gray-500">{dentists.length} dentistas disponibles</span>
              </div>
            </DropdownMenuItem>
          );
        })}

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => navigate("/settings/clinics")} className="flex items-center gap-2 text-gray-700">
          <Settings className="h-4 w-4" />
          Administrar clinicas
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
