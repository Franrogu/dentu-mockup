SET search_path TO dental, public;

CREATE TABLE IF NOT EXISTS dental.clinical_specialties (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code         text NOT NULL UNIQUE,
  name         text NOT NULL,
  description  text,
  is_active    boolean NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  CHECK (btrim(code) <> ''),
  CHECK (code = upper(code))
);

CREATE TABLE IF NOT EXISTS dental.visit_types (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code        text NOT NULL UNIQUE,
  name        text NOT NULL,
  sort_order  integer NOT NULL DEFAULT 0,
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  CHECK (btrim(code) <> ''),
  CHECK (code = upper(code))
);

CREATE TABLE IF NOT EXISTS dental.payment_methods (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code        text NOT NULL UNIQUE,
  name        text NOT NULL,
  sort_order  integer NOT NULL DEFAULT 0,
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  CHECK (btrim(code) <> ''),
  CHECK (code = upper(code))
);

CREATE TABLE IF NOT EXISTS dental.attachment_types (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code        text NOT NULL UNIQUE,
  name        text NOT NULL,
  sort_order  integer NOT NULL DEFAULT 0,
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  CHECK (btrim(code) <> ''),
  CHECK (code = upper(code))
);

CREATE TABLE IF NOT EXISTS dental.clinical_conditions (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code                text NOT NULL UNIQUE,
  scope               text NOT NULL CHECK (
                        scope IN ('medical','dental','allergy','pregnancy','habit','risk','other','mixed')
                      ),
  name                text NOT NULL,
  description         text,
  default_risk_level  text CHECK (
                        default_risk_level IS NULL
                        OR default_risk_level IN ('low','medium','high','critical')
                      ),
  is_risk_relevant    boolean NOT NULL DEFAULT false,
  is_active           boolean NOT NULL DEFAULT true,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),
  CHECK (btrim(code) <> ''),
  CHECK (code = upper(code))
);
