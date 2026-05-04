import type { ReactNode } from "react";
import { Link, useLocation } from "react-router";
import { Building2, CalendarDays, MapPin, Stethoscope, Users } from "lucide-react";

interface SettingsLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  subNav?: Array<{ name: string; path: string }>;
}

export function SettingsLayout({ children, title, description, subNav }: SettingsLayoutProps) {
  const location = useLocation();

  return (
    <div className="flex h-full">
      <aside className="w-64 border-r border-gray-200 bg-white p-6">
        <h2 className="mb-1 font-semibold text-gray-900">Configuracion</h2>
        <p className="mb-6 text-sm text-gray-600">Administra tu organizacion</p>

        <nav className="space-y-1">
          <Link
            to="/settings/booking"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
              location.pathname === "/settings/booking" ? "bg-gray-100 text-gray-900" : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <CalendarDays className="h-5 w-5" />
            <span>Agenda</span>
          </Link>

          <Link
            to="/settings/organization"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
              location.pathname === "/settings/organization" ? "bg-gray-100 text-gray-900" : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Building2 className="h-5 w-5" />
            <span>Organizacion</span>
          </Link>

          <Link
            to="/settings/clinics"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
              location.pathname.startsWith("/settings/clinics") ? "bg-gray-100 text-gray-900" : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <MapPin className="h-5 w-5" />
            <span>Clinicas</span>
          </Link>

          <Link
            to="/settings/specialties"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
              location.pathname === "/settings/specialties" ? "bg-gray-100 text-gray-900" : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Stethoscope className="h-5 w-5" />
            <span>Especialidades</span>
          </Link>

          <Link
            to="/settings/team"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
              location.pathname.startsWith("/settings/team") ? "bg-gray-100 text-gray-900" : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Users className="h-5 w-5" />
            <span>Equipo</span>
          </Link>
        </nav>
      </aside>

      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-semibold text-gray-900">{title}</h1>
            {description ? <p className="text-gray-600">{description}</p> : null}
          </div>

          {subNav ? (
            <div className="mb-8 border-b border-gray-200">
              <nav className="flex gap-6">
                {subNav.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`border-b-2 pb-3 transition-colors ${
                      location.pathname === item.path
                        ? "border-[#0F5F6D] font-medium text-[#0F5F6D]"
                        : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          ) : null}

          {children}
        </div>
      </div>
    </div>
  );
}
