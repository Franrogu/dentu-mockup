export const organizationMock = {
  id: "org-clinica-del-valle",
  slug: "clinica-del-valle",
  commercialName: "Clinica del Valle",
  legalName: "Clinica Dental del Valle SA de CV",
  status: "active" as const,
  timezone: "America/Mexico_City",
  locale: "es-MX",
  countryCode: "MX",
  defaultCurrencyCode: "MXN",
  taxId: "CDV010203AB1",
  branding: {
    logoFileName: "logo-clinica-del-valle.png",
    primaryColor: "#0F5F6D",
  },
};

export const clinicRecordsMock = [
  {
    id: "clinic-cdv-001",
    orgId: organizationMock.id,
    code: "CDV-001",
    name: "Clinica del Valle",
    status: "active" as const,
    addressText: "Av. Principal 123, Del Valle, Ciudad de Mexico",
    phone: "+52 55 1234 5678",
    email: "contacto@clinicadelvalle.com",
    deactivatedAt: null,
    specialtyCount: 3,
    teamMemberCount: 3,
  },
  {
    id: "clinic-cdv-002",
    orgId: organizationMock.id,
    code: "CDV-002",
    name: "Clinica Roma Norte",
    status: "inactive" as const,
    addressText: "Calle Puebla 80, Roma Norte, Ciudad de Mexico",
    phone: "+52 55 2222 3344",
    email: "roma@clinicadelvalle.com",
    deactivatedAt: "2026-03-15T18:30:00.000Z",
    specialtyCount: 1,
    teamMemberCount: 1,
  },
] as const;

export const specialtyCatalogMock = [
  {
    id: "spec-general",
    code: "GENERAL",
    name: "Odontologia General",
    description: "Consultas y tratamientos dentales basicos.",
    isActive: true,
  },
  {
    id: "spec-ortho",
    code: "ORTHO",
    name: "Ortodoncia",
    description: "Correccion de dientes y mandibula con brackets y alineadores.",
    isActive: true,
  },
  {
    id: "spec-endo",
    code: "ENDO",
    name: "Endodoncia",
    description: "Tratamiento de conductos radiculares.",
    isActive: true,
  },
  {
    id: "spec-perio",
    code: "PERIO",
    name: "Periodoncia",
    description: "Tratamiento de encias y tejidos de soporte.",
    isActive: true,
  },
  {
    id: "spec-implant",
    code: "IMPLANT",
    name: "Implantologia",
    description: "Colocacion de implantes dentales.",
    isActive: true,
  },
] as const;

export const organizationSpecialtiesMock = [
  {
    id: "org-spec-general",
    orgId: organizationMock.id,
    specialtyId: "spec-general",
    code: "GENERAL",
    name: "Odontologia General",
    description: "Consultas y tratamientos dentales basicos.",
    isActive: true,
    settingsJson: {
      visitLayerEnabled: true,
      treatmentPlanEnabled: true,
    },
  },
  {
    id: "org-spec-ortho",
    orgId: organizationMock.id,
    specialtyId: "spec-ortho",
    code: "ORTHO",
    name: "Ortodoncia",
    description: "Correccion de dientes y mandibula con brackets y alineadores.",
    isActive: true,
    settingsJson: {
      visitLayerEnabled: true,
      treatmentPlanEnabled: true,
    },
  },
  {
    id: "org-spec-endo",
    orgId: organizationMock.id,
    specialtyId: "spec-endo",
    code: "ENDO",
    name: "Endodoncia",
    description: "Tratamiento de conductos radiculares.",
    isActive: false,
    settingsJson: {
      visitLayerEnabled: false,
      treatmentPlanEnabled: true,
    },
  },
] as const;

export const clinicSpecialtiesMock = [
  {
    id: "clinic-spec-1",
    orgId: organizationMock.id,
    clinicId: "clinic-cdv-001",
    specialtyId: "spec-general",
    isActive: true,
  },
  {
    id: "clinic-spec-2",
    orgId: organizationMock.id,
    clinicId: "clinic-cdv-001",
    specialtyId: "spec-ortho",
    isActive: true,
  },
  {
    id: "clinic-spec-3",
    orgId: organizationMock.id,
    clinicId: "clinic-cdv-001",
    specialtyId: "spec-endo",
    isActive: false,
  },
  {
    id: "clinic-spec-4",
    orgId: organizationMock.id,
    clinicId: "clinic-cdv-002",
    specialtyId: "spec-general",
    isActive: true,
  },
] as const;

export const roleCatalogMock = [
  {
    id: "role-org-owner",
    code: "ORG_OWNER",
    name: "Propietario",
    assignmentScope: "org" as const,
    isSystem: true,
    status: "active" as const,
  },
  {
    id: "role-org-admin",
    code: "ORG_ADMIN",
    name: "Administrador",
    assignmentScope: "org" as const,
    isSystem: true,
    status: "active" as const,
  },
  {
    id: "role-clinic-admin",
    code: "CLINIC_ADMIN",
    name: "Administrador de clinica",
    assignmentScope: "clinic" as const,
    isSystem: true,
    status: "active" as const,
  },
  {
    id: "role-dentist",
    code: "DENTIST",
    name: "Dentista",
    assignmentScope: "clinic" as const,
    isSystem: true,
    status: "active" as const,
  },
  {
    id: "role-reception",
    code: "RECEPTION",
    name: "Recepcion",
    assignmentScope: "clinic" as const,
    isSystem: true,
    status: "active" as const,
  },
  {
    id: "role-assistant",
    code: "ASSISTANT",
    name: "Asistente",
    assignmentScope: "clinic" as const,
    isSystem: true,
    status: "active" as const,
  },
] as const;

export const teamMembersMock = [
  {
    user: {
      id: "user-ana",
      orgId: organizationMock.id,
      firstName: "Ana",
      lastName: "Martinez",
      secondLastName: "Lopez",
      email: "ana.martinez@example.com",
      emailNormalized: "ana.martinez@example.com",
      phone: "+52 55 9999 1001",
      phoneNormalized: "+525599991001",
      status: "active" as const,
      lastLoginAt: "2026-04-30T18:00:00.000Z",
      deactivatedAt: null,
    },
    identities: [
      {
        id: "identity-ana-local",
        providerType: "local" as const,
        loginEmailNormalized: "ana.martinez@example.com",
        isPrimary: true,
        isVerified: true,
        status: "active" as const,
        mustChangePassword: false,
      },
    ],
    orgRoles: [
      {
        id: "user-org-role-ana-admin",
        roleId: "role-org-admin",
        roleCode: "ORG_ADMIN",
        roleName: "Administrador",
        status: "active" as const,
        validFrom: "2026-01-01T00:00:00.000Z",
        validTo: null,
      },
    ],
    clinicRoles: [
      {
        id: "user-clinic-role-ana-001",
        clinicId: "clinic-cdv-001",
        clinicCode: "CDV-001",
        clinicName: "Clinica del Valle",
        roleId: "role-clinic-admin",
        roleCode: "CLINIC_ADMIN",
        roleName: "Administrador de clinica",
        status: "active" as const,
        validFrom: "2026-01-01T00:00:00.000Z",
        validTo: null,
      },
      {
        id: "user-clinic-role-ana-002",
        clinicId: "clinic-cdv-002",
        clinicCode: "CDV-002",
        clinicName: "Clinica Roma Norte",
        roleId: "role-clinic-admin",
        roleCode: "CLINIC_ADMIN",
        roleName: "Administrador de clinica",
        status: "active" as const,
        validFrom: "2026-01-01T00:00:00.000Z",
        validTo: null,
      },
    ],
    clinicianProfile: null,
    clinicianSpecialties: [],
  },
  {
    user: {
      id: "user-carlos",
      orgId: organizationMock.id,
      firstName: "Carlos",
      lastName: "Ruiz",
      secondLastName: "Herrera",
      email: "carlos.ruiz@example.com",
      emailNormalized: "carlos.ruiz@example.com",
      phone: "+52 55 9999 1002",
      phoneNormalized: "+525599991002",
      status: "active" as const,
      lastLoginAt: "2026-04-29T16:20:00.000Z",
      deactivatedAt: null,
    },
    identities: [
      {
        id: "identity-carlos-google",
        providerType: "google" as const,
        loginEmailNormalized: null,
        isPrimary: true,
        isVerified: true,
        status: "active" as const,
        mustChangePassword: false,
      },
    ],
    orgRoles: [],
    clinicRoles: [
      {
        id: "user-clinic-role-carlos-001",
        clinicId: "clinic-cdv-001",
        clinicCode: "CDV-001",
        clinicName: "Clinica del Valle",
        roleId: "role-dentist",
        roleCode: "DENTIST",
        roleName: "Dentista",
        status: "active" as const,
        validFrom: "2026-01-15T00:00:00.000Z",
        validTo: null,
      },
    ],
    clinicianProfile: {
      id: "profile-carlos",
      professionalTitle: "Cirujano Dentista",
      professionalLicense: "DEN-12345",
      licenseCountryCode: "MX",
      defaultSpecialtyId: "spec-general",
      profileStatus: "active" as const,
    },
    clinicianSpecialties: [
      {
        id: "clinician-spec-carlos-general",
        specialtyId: "spec-general",
        code: "GENERAL",
        name: "Odontologia General",
        isPrimary: true,
        isActive: true,
      },
      {
        id: "clinician-spec-carlos-ortho",
        specialtyId: "spec-ortho",
        code: "ORTHO",
        name: "Ortodoncia",
        isPrimary: false,
        isActive: true,
      },
    ],
  },
  {
    user: {
      id: "user-maria",
      orgId: organizationMock.id,
      firstName: "Maria",
      lastName: "Gonzalez",
      secondLastName: null,
      email: "maria.gonzalez@example.com",
      emailNormalized: "maria.gonzalez@example.com",
      phone: "+52 55 9999 1003",
      phoneNormalized: "+525599991003",
      status: "inactive" as const,
      lastLoginAt: "2026-03-11T14:10:00.000Z",
      deactivatedAt: "2026-04-01T09:00:00.000Z",
    },
    identities: [
      {
        id: "identity-maria-local",
        providerType: "local" as const,
        loginEmailNormalized: "maria.gonzalez@example.com",
        isPrimary: true,
        isVerified: true,
        status: "active" as const,
        mustChangePassword: false,
      },
    ],
    orgRoles: [],
    clinicRoles: [
      {
        id: "user-clinic-role-maria-001",
        clinicId: "clinic-cdv-001",
        clinicCode: "CDV-001",
        clinicName: "Clinica del Valle",
        roleId: "role-reception",
        roleCode: "RECEPTION",
        roleName: "Recepcion",
        status: "inactive" as const,
        validFrom: "2026-01-20T00:00:00.000Z",
        validTo: "2026-04-01T09:00:00.000Z",
      },
    ],
    clinicianProfile: null,
    clinicianSpecialties: [],
  },
] as const;

export const pendingInvitationsMock = [
  {
    id: "invite-pedro",
    orgId: organizationMock.id,
    emailInvited: "pedro.lopez@example.com",
    emailInvitedNormalized: "pedro.lopez@example.com",
    intendedRoleId: "role-assistant",
    intendedRoleCode: "ASSISTANT",
    intendedRoleName: "Asistente",
    intendedClinicId: "clinic-cdv-001",
    intendedClinicCode: "CDV-001",
    intendedClinicName: "Clinica del Valle",
    invitationTokenHash: "mock-token-pedro",
    status: "pending" as const,
    invitedByUserId: "user-ana",
    invitedByName: "Ana Martinez Lopez",
    expiresAt: "2026-05-15T18:00:00.000Z",
    acceptedAt: null,
    createdAt: "2026-05-01T09:30:00.000Z",
  },
  {
    id: "invite-lucia",
    orgId: organizationMock.id,
    emailInvited: "lucia.vera@example.com",
    emailInvitedNormalized: "lucia.vera@example.com",
    intendedRoleId: "role-dentist",
    intendedRoleCode: "DENTIST",
    intendedRoleName: "Dentista",
    intendedClinicId: "clinic-cdv-002",
    intendedClinicCode: "CDV-002",
    intendedClinicName: "Clinica Roma Norte",
    invitationTokenHash: "mock-token-lucia",
    status: "pending" as const,
    invitedByUserId: "user-ana",
    invitedByName: "Ana Martinez Lopez",
    expiresAt: "2026-05-10T18:00:00.000Z",
    acceptedAt: null,
    createdAt: "2026-04-29T12:00:00.000Z",
  },
] as const;

export const countryOptionsMock = [
  { value: "MX", label: "Mexico" },
  { value: "CO", label: "Colombia" },
  { value: "AR", label: "Argentina" },
  { value: "CL", label: "Chile" },
] as const;

export const timezoneOptionsMock = [
  { value: "America/Mexico_City", label: "America/Mexico_City" },
  { value: "America/Bogota", label: "America/Bogota" },
  { value: "America/Santiago", label: "America/Santiago" },
] as const;

export const localeOptionsMock = [
  { value: "es-MX", label: "Espanol - Mexico" },
  { value: "es-CO", label: "Espanol - Colombia" },
  { value: "es-AR", label: "Espanol - Argentina" },
  { value: "en-US", label: "English - US" },
] as const;

export const currencyOptionsMock = [
  { value: "MXN", label: "MXN" },
  { value: "COP", label: "COP" },
  { value: "ARS", label: "ARS" },
  { value: "USD", label: "USD" },
] as const;

export const invitationExpiryOptionsMock = [
  { value: "72h", label: "72 horas" },
  { value: "7d", label: "7 dias" },
  { value: "14d", label: "14 dias" },
] as const;

export function getFullName(user: {
  firstName: string;
  lastName: string;
  secondLastName: string | null;
}) {
  return [user.firstName, user.lastName, user.secondLastName]
    .filter(Boolean)
    .join(" ");
}

export function getClinicById(id: string) {
  return clinicRecordsMock.find((clinic) => clinic.id === id);
}

export function getClinicSubNav(id: string) {
  return [
    { name: "Datos generales", path: `/settings/clinics/${id}` },
    { name: "Especialidades", path: `/settings/clinics/${id}/specialties` },
    { name: "Equipo asignado", path: `/settings/clinics/${id}/team` },
  ];
}

export function getTeamMemberById(id: string) {
  return teamMembersMock.find((member) => member.user.id === id);
}

export function getClinicAssignmentsForClinic(clinicId: string) {
  return teamMembersMock.filter((member) =>
    member.clinicRoles.some((assignment) => assignment.clinicId === clinicId)
  );
}

export function getSpecialtiesForClinic(clinicId: string) {
  return organizationSpecialtiesMock.map((specialty) => {
    const clinicAssignment = clinicSpecialtiesMock.find(
      (assignment) =>
        assignment.clinicId === clinicId &&
        assignment.specialtyId === specialty.specialtyId
    );

    return {
      ...specialty,
      clinicSpecialtyId: clinicAssignment?.id ?? null,
      clinicIsActive: clinicAssignment?.isActive ?? false,
    };
  });
}

export function formatDateTime(value: string | null) {
  if (!value) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatDateOnly(value: string | null) {
  if (!value) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
  }).format(new Date(value));
}
