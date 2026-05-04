SET search_path TO dental, public;

CREATE TABLE IF NOT EXISTS dental.organization_specialties (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id         uuid NOT NULL REFERENCES dental.organizations(id) ON DELETE RESTRICT,
  specialty_id   uuid NOT NULL REFERENCES dental.clinical_specialties(id) ON DELETE RESTRICT,
  is_active      boolean NOT NULL DEFAULT true,
  settings_json  jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, id),
  UNIQUE (org_id, specialty_id),
  CHECK (jsonb_typeof(settings_json) = 'object')
);

CREATE TABLE IF NOT EXISTS dental.clinic_specialties (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        uuid NOT NULL REFERENCES dental.organizations(id) ON DELETE RESTRICT,
  clinic_id     uuid NOT NULL,
  specialty_id  uuid NOT NULL,
  is_active     boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, id),
  UNIQUE (org_id, clinic_id, specialty_id),
  FOREIGN KEY (org_id, clinic_id)
    REFERENCES dental.clinics(org_id, id)
    ON DELETE RESTRICT,
  FOREIGN KEY (org_id, specialty_id)
    REFERENCES dental.organization_specialties(org_id, specialty_id)
    ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS dental.clinician_profiles (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id                uuid NOT NULL REFERENCES dental.organizations(id) ON DELETE RESTRICT,
  user_id               uuid NOT NULL,
  professional_title    text,
  professional_license  text,
  license_country_code  char(2),
  default_specialty_id  uuid,
  profile_status        text NOT NULL DEFAULT 'active' CHECK (profile_status IN ('active','inactive')),
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, id),
  UNIQUE (org_id, user_id),
  FOREIGN KEY (org_id, user_id)
    REFERENCES dental.app_users(org_id, id)
    ON DELETE RESTRICT,
  FOREIGN KEY (org_id, default_specialty_id)
    REFERENCES dental.organization_specialties(org_id, specialty_id)
    ON DELETE RESTRICT,
  CHECK (license_country_code IS NULL OR license_country_code = upper(license_country_code))
);

CREATE TABLE IF NOT EXISTS dental.clinician_specialties (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id                uuid NOT NULL REFERENCES dental.organizations(id) ON DELETE RESTRICT,
  clinician_profile_id  uuid NOT NULL,
  specialty_id          uuid NOT NULL,
  is_primary            boolean NOT NULL DEFAULT false,
  is_active             boolean NOT NULL DEFAULT true,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, id),
  UNIQUE (org_id, clinician_profile_id, specialty_id),
  FOREIGN KEY (org_id, clinician_profile_id)
    REFERENCES dental.clinician_profiles(org_id, id)
    ON DELETE RESTRICT,
  FOREIGN KEY (org_id, specialty_id)
    REFERENCES dental.organization_specialties(org_id, specialty_id)
    ON DELETE RESTRICT
);
