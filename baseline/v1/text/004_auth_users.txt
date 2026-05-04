SET search_path TO dental, public;

CREATE TABLE IF NOT EXISTS dental.app_users (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id             uuid NOT NULL REFERENCES dental.organizations(id) ON DELETE RESTRICT,
  first_name         text NOT NULL,
  last_name          text NOT NULL,
  second_last_name   text,
  email              text NOT NULL,
  email_normalized   text NOT NULL,
  phone              text,
  phone_normalized   text,
  status             text NOT NULL DEFAULT 'active'
                     CHECK (status IN ('invited','active','inactive','suspended')),
  last_login_at      timestamptz,
  deactivated_at     timestamptz,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, id),
  UNIQUE (org_id, email_normalized),
  CHECK (btrim(first_name) <> ''),
  CHECK (btrim(last_name) <> ''),
  CHECK (btrim(email_normalized) <> ''),
  CHECK (email_normalized = lower(email_normalized)),
  CHECK (
    (status IN ('inactive','suspended') AND deactivated_at IS NOT NULL)
    OR
    (status IN ('invited','active') AND deactivated_at IS NULL)
  )
);

CREATE TABLE IF NOT EXISTS dental.user_identities (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id                 uuid NOT NULL REFERENCES dental.organizations(id) ON DELETE RESTRICT,
  user_id                uuid NOT NULL,
  provider_type          text NOT NULL CHECK (provider_type IN ('local','google','microsoft','external_oidc')),
  provider_subject       text,
  login_email_normalized text,
  password_hash          text,
  must_change_password   boolean NOT NULL DEFAULT false,
  password_changed_at    timestamptz,
  is_primary             boolean NOT NULL DEFAULT false,
  is_verified            boolean NOT NULL DEFAULT false,
  status                 text NOT NULL DEFAULT 'active' CHECK (status IN ('active','disabled','revoked')),
  linked_at              timestamptz NOT NULL DEFAULT now(),
  last_used_at           timestamptz,
  revoked_at             timestamptz,
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, id),
  FOREIGN KEY (org_id, user_id)
    REFERENCES dental.app_users(org_id, id)
    ON DELETE RESTRICT,
  CHECK (
    (
      provider_type = 'local'
      AND password_hash IS NOT NULL
      AND login_email_normalized IS NOT NULL
      AND provider_subject IS NULL
    )
    OR
    (
      provider_type IN ('google','microsoft','external_oidc')
      AND password_hash IS NULL
      AND provider_subject IS NOT NULL
      AND must_change_password = false
    )
  ),
  CHECK (
    (status = 'revoked' AND revoked_at IS NOT NULL)
    OR
    (status <> 'revoked' AND revoked_at IS NULL)
  ),
  CHECK (login_email_normalized IS NULL OR login_email_normalized = lower(login_email_normalized))
);

CREATE TABLE IF NOT EXISTS dental.user_invitations (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id                   uuid NOT NULL REFERENCES dental.organizations(id) ON DELETE RESTRICT,
  email_invited            text NOT NULL,
  email_invited_normalized text NOT NULL,
  intended_role_id         uuid,
  intended_clinic_id       uuid,
  invitation_token_hash    text NOT NULL UNIQUE,
  invited_by_user_id       uuid,
  consumed_by_user_id      uuid,
  status                   text NOT NULL DEFAULT 'pending'
                           CHECK (status IN ('pending','accepted','expired','revoked')),
  expires_at               timestamptz NOT NULL,
  accepted_at              timestamptz,
  created_at               timestamptz NOT NULL DEFAULT now(),
  updated_at               timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, id),
  FOREIGN KEY (org_id, intended_clinic_id)
    REFERENCES dental.clinics(org_id, id)
    ON DELETE RESTRICT,
  FOREIGN KEY (org_id, invited_by_user_id)
    REFERENCES dental.app_users(org_id, id)
    ON DELETE RESTRICT,
  FOREIGN KEY (org_id, consumed_by_user_id)
    REFERENCES dental.app_users(org_id, id)
    ON DELETE RESTRICT,
  CHECK (expires_at > created_at),
  CHECK (email_invited_normalized = lower(email_invited_normalized)),
  CHECK (
    (status = 'accepted' AND accepted_at IS NOT NULL)
    OR
    (status <> 'accepted' AND accepted_at IS NULL)
  )
);

CREATE TABLE IF NOT EXISTS dental.refresh_tokens (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id       uuid NOT NULL REFERENCES dental.organizations(id) ON DELETE RESTRICT,
  user_id      uuid NOT NULL,
  identity_id  uuid NOT NULL,
  token_hash   text NOT NULL,
  expires_at   timestamptz NOT NULL,
  revoked_at   timestamptz,
  ip_address   inet,
  user_agent   text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, id),
  FOREIGN KEY (org_id, user_id)
    REFERENCES dental.app_users(org_id, id)
    ON DELETE RESTRICT,
  FOREIGN KEY (org_id, identity_id)
    REFERENCES dental.user_identities(org_id, id)
    ON DELETE RESTRICT,
  CHECK (expires_at > created_at),
  CHECK (revoked_at IS NULL OR revoked_at >= created_at)
);

CREATE TABLE IF NOT EXISTS dental.password_reset_tokens (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id            uuid NOT NULL REFERENCES dental.organizations(id) ON DELETE RESTRICT,
  user_identity_id  uuid NOT NULL,
  token_hash        text NOT NULL,
  expires_at        timestamptz NOT NULL,
  consumed_at       timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, id),
  FOREIGN KEY (org_id, user_identity_id)
    REFERENCES dental.user_identities(org_id, id)
    ON DELETE RESTRICT,
  CHECK (expires_at > created_at),
  CHECK (consumed_at IS NULL OR consumed_at >= created_at)
);
