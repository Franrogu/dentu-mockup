SET search_path TO dental, public;

CREATE TABLE IF NOT EXISTS dental.patient_code_sequences (
  org_id      uuid NOT NULL REFERENCES dental.organizations(id) ON DELETE RESTRICT,
  scope_key   text NOT NULL DEFAULT 'default',
  last_value  bigint NOT NULL DEFAULT 0 CHECK (last_value >= 0),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (org_id, scope_key),
  CHECK (btrim(scope_key) <> '')
);

CREATE TABLE IF NOT EXISTS dental.patients (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id                   uuid NOT NULL REFERENCES dental.organizations(id) ON DELETE RESTRICT,
  patient_code             text,
  first_name               text NOT NULL,
  last_name                text NOT NULL,
  second_last_name         text,
  birth_date               date,
  sex                      text CHECK (sex IS NULL OR sex IN ('female','male','other','unknown')),
  phone                    text,
  phone_normalized         text,
  email                    text,
  email_normalized         text,
  address_text             text,
  emergency_contact_name   text,
  emergency_contact_phone  text,
  notes                    text,
  full_name_normalized     text NOT NULL,
  status                   text NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','archived')),
  archived_at              timestamptz,
  created_by_user_id       uuid,
  updated_by_user_id       uuid,
  created_at               timestamptz NOT NULL DEFAULT now(),
  updated_at               timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, id),
  UNIQUE (org_id, patient_code),
  FOREIGN KEY (org_id, created_by_user_id)
    REFERENCES dental.app_users(org_id, id)
    ON DELETE RESTRICT,
  FOREIGN KEY (org_id, updated_by_user_id)
    REFERENCES dental.app_users(org_id, id)
    ON DELETE RESTRICT,
  CHECK (email_normalized IS NULL OR email_normalized = lower(email_normalized)),
  CHECK (
    (status = 'archived' AND archived_at IS NOT NULL)
    OR
    (status <> 'archived' AND archived_at IS NULL)
  )
);

CREATE TABLE IF NOT EXISTS dental.clinical_records (
  id                         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id                     uuid NOT NULL REFERENCES dental.organizations(id) ON DELETE RESTRICT,
  patient_id                 uuid NOT NULL,
  record_number              text,
  status                     text NOT NULL DEFAULT 'open' CHECK (status IN ('open','archived')),
  blood_type                 text CHECK (
                               blood_type IS NULL
                               OR blood_type IN ('A+','A-','B+','B-','AB+','AB-','O+','O-','unknown')
                             ),
  clinical_summary           text,
  clinical_precautions_notes text,
  opened_at                  timestamptz NOT NULL DEFAULT now(),
  archived_at                timestamptz,
  updated_by_user_id         uuid,
  created_at                 timestamptz NOT NULL DEFAULT now(),
  updated_at                 timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, id),
  UNIQUE (org_id, patient_id),
  UNIQUE (org_id, id, patient_id),
  UNIQUE (org_id, record_number),
  FOREIGN KEY (org_id, patient_id)
    REFERENCES dental.patients(org_id, id)
    ON DELETE RESTRICT,
  FOREIGN KEY (org_id, updated_by_user_id)
    REFERENCES dental.app_users(org_id, id)
    ON DELETE RESTRICT,
  CHECK (
    (status = 'archived' AND archived_at IS NOT NULL)
    OR
    (status <> 'archived' AND archived_at IS NULL)
  )
);
