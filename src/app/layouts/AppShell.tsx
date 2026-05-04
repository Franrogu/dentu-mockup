import { Link, Outlet, useLocation } from "react-router";
import {
  Bell,
  Calendar,
  CreditCard,
  HelpCircle,
  Home,
  Lock,
  LogOut,
  Paperclip,
  Search,
  Settings,
  Stethoscope,
  Users,
} from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";
import { ClinicSelector } from "../components/ClinicSelector";
import { useBooking } from "../features/booking/BookingContext";

export function AppShell() {
  const location = useLocation();
  const isOnboarding = location.pathname.includes("/onboarding");
  const isLocked = isOnboarding && !location.pathname.includes("/onboarding/complete");
  const { currentUser } = useBooking();

  const navItems = [
    { name: "Dashboard", path: "/", icon: Home },
    { name: "Pacientes", path: "/pacientes", icon: Users },
    { name: "Agenda activa", path: "/agenda", icon: Calendar },
    { name: "Visitas", path: "/visitas", icon: Stethoscope },
    { name: "Pagos", path: "/facturacion", icon: CreditCard },
    { name: "Adjuntos", path: "/expedientes", icon: Paperclip },
    { name: "Configuracion", path: "/settings/booking", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#f4f7f7]">
      <aside className="flex w-64 flex-col border-r border-gray-200 bg-white">
        <div className="flex h-16 items-center border-b border-gray-200 px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0F5F6D]">
              <span className="text-lg font-bold text-white">D</span>
            </div>
            <span className="font-semibold text-gray-900">DentalOS</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.path ||
                (item.path === "/settings/booking" && location.pathname.startsWith("/settings"));

              const navButton = (
                <Link
                  key={item.name}
                  to={isLocked ? "#" : item.path}
                  className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                    isActive && !isLocked
                      ? "bg-[#0F5F6D] text-white"
                      : isLocked
                        ? "cursor-not-allowed text-gray-400"
                        : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={(event) => {
                    if (isLocked) {
                      event.preventDefault();
                    }
                  }}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                  {isLocked ? <Lock className="ml-auto h-3 w-3" /> : null}
                </Link>
              );

              if (!isLocked) {
                return navButton;
              }

              return (
                <TooltipProvider key={item.name}>
                  <Tooltip>
                    <TooltipTrigger asChild>{navButton}</TooltipTrigger>
                    <TooltipContent side="right">
                      <p>Completa la configuracion inicial para continuar</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        </nav>

        <div className="space-y-1 border-t border-gray-200 p-3">
          <Link
            to={isLocked ? "#" : "/ayuda"}
            onClick={(event) => {
              if (isLocked) {
                event.preventDefault();
              }
            }}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
              isLocked ? "cursor-not-allowed text-gray-400" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <HelpCircle className="h-5 w-5" />
            <span>Ayuda</span>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={isLocked}>
              <button
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                  isLocked ? "cursor-not-allowed opacity-50" : "hover:bg-gray-100"
                }`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-[#0F5F6D] text-sm text-white">
                    {currentUser.firstName[0]}
                    {currentUser.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-gray-900">{currentUser.displayName}</div>
                  <Badge variant="secondary" className="mt-0.5 text-xs">
                    dentalos-studio
                  </Badge>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Mi perfil
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar sesion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className={`flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 ${isLocked ? "opacity-50" : ""}`}>
          <div className="flex items-center gap-3">{!isLocked ? <ClinicSelector /> : null}</div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-xl" disabled={isLocked}>
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-xl" disabled={isLocked}>
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
