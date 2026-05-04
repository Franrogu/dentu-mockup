SET search_path TO dental, public;

CREATE TABLE IF NOT EXISTS dental.roles (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code              text NOT NULL UNIQUE,
  name              text NOT NULL,
  assignment_scope  text NOT NULL CHECK (assignment_scope IN ('org','clinic')),
  description       text,
  is_system         boolean NOT NULL DEFAULT true,
  status            text NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  CHECK (btrim(code) <> ''),
  CHECK (code = upper(code))
);

CREATE TABLE IF NOT EXISTS dental.permissions (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code          text NOT NULL UNIQUE,
  module_name   text NOT NULL,
  action_name   text NOT NULL,
  description   text,
  status        text NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  CHECK (btrim(code) <> ''),
  CHECK (btrim(module_name) <> ''),
  CHECK (btrim(action_name) <> '')
);

CREATE TABLE IF NOT EXISTS dental.role_permissions (
  role_id        uuid NOT NULL REFERENCES dental.roles(id) ON DELETE CASCADE,
  permission_id  uuid NOT NULL REFERENCES dental.permissions(id) ON DELETE CASCADE,
  created_at     timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS dental.user_org_roles (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id              uuid NOT NULL REFERENCES dental.organizations(id) ON DELETE RESTRICT,
  user_id             uuid NOT NULL,
  role_id             uuid NOT NULL REFERENCES dental.roles(id) ON DELETE RESTRICT,
  granted_by_user_id  uuid,
  status              text NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
  valid_from          timestamptz,
  valid_to            timestamptz,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, id),
  FOREIGN KEY (org_id, user_id)
    REFERENCES dental.app_users(org_id, id)
    ON DELETE RESTRICT,
  FOREIGN KEY (org_id, granted_by_user_id)
    REFERENCES dental.app_users(org_id, id)
    ON DELETE RESTRICT,
  CHECK (valid_to IS NULL OR (valid_from IS NOT NULL AND valid_to >= valid_from))
);

CREATE TABLE IF NOT EXISTS dental.user_clinic_roles (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id              uuid NOT NULL REFERENCES dental.organizations(id) ON DELETE RESTRICT,
  clinic_id           uuid NOT NULL,
  user_id             uuid NOT NULL,
  role_id             uuid NOT NULL REFERENCES dental.roles(id) ON DELETE RESTRICT,
  granted_by_user_id  uuid,
  status              text NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
  valid_from          timestamptz,
  valid_to            timestamptz,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, id),
  FOREIGN KEY (org_id, clinic_id)
    REFERENCES dental.clinics(org_id, id)
    ON DELETE RESTRICT,
  FOREIGN KEY (org_id, user_id)
    REFERENCES dental.app_users(org_id, id)
    ON DELETE RESTRICT,
  FOREIGN KEY (org_id, granted_by_user_id)
    REFERENCES dental.app_users(org_id, id)
    ON DELETE RESTRICT,
  CHECK (valid_to IS NULL OR (valid_from IS NOT NULL AND valid_to >= valid_from))
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'user_invitations_intended_role_id_fkey'
      AND conrelid = 'dental.user_invitations'::regclass
  ) THEN
    ALTER TABLE dental.user_invitations
      ADD CONSTRAINT user_invitations_intended_role_id_fkey
      FOREIGN KEY (intended_role_id)
      REFERENCES dental.roles(id)
      ON DELETE RESTRICT;
  END IF;
END;
$$;
