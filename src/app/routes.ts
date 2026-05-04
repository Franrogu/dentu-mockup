import { createBrowserRouter } from "react-router";
import { Login } from "./pages/auth/Login";
import { OnboardingOrganization } from "./pages/onboarding/OnboardingOrganization";
import { OnboardingClinic } from "./pages/onboarding/OnboardingClinic";
import { OnboardingSpecialties } from "./pages/onboarding/OnboardingSpecialties";
import { OnboardingTeam } from "./pages/onboarding/OnboardingTeam";
import { OnboardingComplete } from "./pages/onboarding/OnboardingComplete";
import { SettingsOrganization } from "./pages/settings/SettingsOrganization";
import { SettingsClinics } from "./pages/settings/SettingsClinics";
import { SettingsClinicDetail } from "./pages/settings/SettingsClinicDetail";
import { SettingsClinicSpecialties } from "./pages/settings/SettingsClinicSpecialties";
import { SettingsClinicTeam } from "./pages/settings/SettingsClinicTeam";
import { SettingsSpecialties } from "./pages/settings/SettingsSpecialties";
import { SettingsTeam } from "./pages/settings/SettingsTeam";
import { SettingsTeamMember } from "./pages/settings/SettingsTeamMember";
import { BookingSettings } from "./pages/settings/BookingSettings";
import { Dashboard } from "./pages/Dashboard";
import { Agenda } from "./pages/Agenda";
import { Equipo } from "./pages/Equipo";
import { Visitas } from "./pages/Visitas";
import { Pacientes } from "./pages/Pacientes";
import { PatientDetail } from "./pages/PatientDetail";
import { PatientVisits } from "./pages/PatientVisits";
import { VisitDetail } from "./pages/VisitDetail";
import { VisitForm } from "./pages/VisitForm";
import { EditClinicalHistory } from "./pages/EditClinicalHistory";
import { Expedientes } from "./pages/Expedientes";
import { Facturacion } from "./pages/Facturacion";
import { AppShell } from "./layouts/AppShell";

export const router = createBrowserRouter([
  {
    path: "/auth/login",
    Component: Login,
  },
  {
    path: "/",
    Component: AppShell,
    children: [
      { index: true, Component: Dashboard },
      { path: "agenda", Component: Agenda },
      { path: "pacientes", Component: Pacientes },
      { path: "pacientes/:id", Component: PatientDetail },
      { path: "pacientes/:id/visitas", Component: PatientVisits },
      { path: "pacientes/:id/historia-clinica/editar", Component: EditClinicalHistory },
      { path: "pacientes/:id/historia-clinica/nueva", Component: EditClinicalHistory },
      { path: "expedientes", Component: Expedientes },
      { path: "facturacion", Component: Facturacion },
      { path: "equipo", Component: Equipo },
      { path: "visitas", Component: Visitas },
      { path: "visitas/nueva", Component: VisitForm },
      { path: "visitas/:id/editar", Component: VisitForm },
      { path: "visitas/:id", Component: VisitDetail },
      { path: "onboarding/organization", Component: OnboardingOrganization },
      { path: "onboarding/clinic", Component: OnboardingClinic },
      { path: "onboarding/specialties", Component: OnboardingSpecialties },
      { path: "onboarding/team", Component: OnboardingTeam },
      { path: "onboarding/complete", Component: OnboardingComplete },
      { path: "settings/booking", Component: BookingSettings },
      { path: "settings/organization", Component: SettingsOrganization },
      { path: "settings/clinics", Component: SettingsClinics },
      { path: "settings/clinics/:id", Component: SettingsClinicDetail },
      { path: "settings/clinics/:id/specialties", Component: SettingsClinicSpecialties },
      { path: "settings/clinics/:id/team", Component: SettingsClinicTeam },
      { path: "settings/specialties", Component: SettingsSpecialties },
      { path: "settings/team", Component: SettingsTeam },
      { path: "settings/team/:id", Component: SettingsTeamMember },
    ],
  },
]);
