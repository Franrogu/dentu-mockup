SET search_path TO dental, public;

CREATE TABLE IF NOT EXISTS dental.organizations (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                   text NOT NULL UNIQUE,
  legal_name             text NOT NULL,
  commercial_name        text,
  status                 text NOT NULL DEFAULT 'active'
                         CHECK (status IN ('active','inactive','suspended')),
  timezone               text NOT NULL DEFAULT 'America/Mexico_City',
  locale                 text NOT NULL DEFAULT 'es-MX',
  country_code           char(2) NOT NULL DEFAULT 'MX',
  default_currency_code  char(3) NOT NULL DEFAULT 'MXN',
  tax_id                 text,
  branding_json          jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now(),
  CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  CHECK (country_code = upper(country_code)),
  CHECK (default_currency_code = upper(default_currency_code)),
  CHECK (jsonb_typeof(branding_json) = 'object')
);

CREATE TABLE IF NOT EXISTS dental.clinics (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id          uuid NOT NULL REFERENCES dental.organizations(id) ON DELETE RESTRICT,
  code            text NOT NULL,
  name            text NOT NULL,
  status          text NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
  address_text    text,
  phone           text,
  email           text,
  deactivated_at  timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, id),
  UNIQUE (org_id, code),
  CHECK (btrim(code) <> ''),
  CHECK (code = upper(code)),
  CHECK (
    (status = 'inactive' AND deactivated_at IS NOT NULL)
    OR
    (status = 'active' AND deactivated_at IS NULL)
  )
);
