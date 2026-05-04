SET search_path TO dental, public;

CREATE TABLE IF NOT EXISTS dental.platform_roles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code        text NOT NULL UNIQUE,
  name        text NOT NULL,
  description text,
  status      text NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  CHECK (btrim(code) <> ''),
  CHECK (code = upper(code))
);

CREATE TABLE IF NOT EXISTS dental.platform_users (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform_role_id  uuid NOT NULL REFERENCES dental.platform_roles(id) ON DELETE RESTRICT,
  email             text NOT NULL,
  email_normalized  text NOT NULL UNIQUE,
  first_name        text NOT NULL,
  last_name         text NOT NULL,
  status            text NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','suspended')),
  last_login_at     timestamptz,
  deactivated_at    timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  CHECK (email_normalized = lower(email_normalized)),
  CHECK (btrim(email_normalized) <> ''),
  CHECK (
    (status IN ('inactive','suspended') AND deactivated_at IS NOT NULL)
    OR
    (status = 'active' AND deactivated_at IS NULL)
  )
);

CREATE TABLE IF NOT EXISTS dental.platform_identities (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform_user_id        uuid NOT NULL REFERENCES dental.platform_users(id) ON DELETE RESTRICT,
  provider_type           text NOT NULL CHECK (provider_type IN ('local','external_oidc')),
  provider_key            text,
  provider_subject        text,
  login_email_normalized  text,
  password_hash           text,
  must_change_password    boolean NOT NULL DEFAULT false,
  is_primary              boolean NOT NULL DEFAULT false,
  is_verified             boolean NOT NULL DEFAULT false,
  status                  text NOT NULL DEFAULT 'active' CHECK (status IN ('active','disabled','revoked')),
  linked_at               timestamptz NOT NULL DEFAULT now(),
  last_used_at            timestamptz,
  revoked_at              timestamptz,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now(),
  CHECK (
    (
      provider_type = 'local'
      AND password_hash IS NOT NULL
      AND login_email_normalized IS NOT NULL
      AND provider_key IS NULL
      AND provider_subject IS NULL
    )
    OR
    (
      provider_type = 'external_oidc'
      AND password_hash IS NULL
      AND provider_key IS NOT NULL
      AND provider_subject IS NOT NULL
      AND must_change_password = false
    )
  ),
  CHECK (
    (status = 'revoked' AND revoked_at IS NOT NULL)
    OR
    (status <> 'revoked' AND revoked_at IS NULL)
  )
);
