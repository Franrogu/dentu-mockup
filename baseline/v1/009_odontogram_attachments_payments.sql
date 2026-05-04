SET search_path TO dental, public;

CREATE TABLE IF NOT EXISTS dental.odontogram_snapshots (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id              uuid NOT NULL REFERENCES dental.organizations(id) ON DELETE RESTRICT,
  patient_id          uuid NOT NULL,
  clinical_record_id  uuid NOT NULL,
  visit_id            uuid,
  version_no          integer NOT NULL CHECK (version_no >= 1),
  snapshot_json       jsonb NOT NULL,
  captured_by_user_id uuid NOT NULL,
  created_at          timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, id),
  UNIQUE (org_id, clinical_record_id, version_no),
  FOREIGN KEY (org_id, clinical_record_id, patient_id)
    REFERENCES dental.clinical_records(org_id, id, patient_id)
    ON DELETE RESTRICT,
  FOREIGN KEY (org_id, visit_id, patient_id)
    REFERENCES dental.visits(org_id, id, patient_id)
    ON DELETE RESTRICT,
  FOREIGN KEY (org_id, captured_by_user_id)
    REFERENCES dental.app_users(org_id, id)
    ON DELETE RESTRICT,
  CHECK (jsonb_typeof(snapshot_json) = 'object')
);

CREATE TABLE IF NOT EXISTS dental.clinical_attachments (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id              uuid NOT NULL REFERENCES dental.organizations(id) ON DELETE RESTRICT,
  patient_id          uuid NOT NULL,
  clinical_record_id  uuid,
  visit_id            uuid,
  attachment_type_id  uuid NOT NULL REFERENCES dental.attachment_types(id) ON DELETE RESTRICT,
  title               text NOT NULL,
  description         text,
  mime_type           text NOT NULL,
  file_size_bytes     bigint NOT NULL CHECK (file_size_bytes >= 0),
  storage_provider    text NOT NULL,
  storage_bucket      text NOT NULL,
  storage_object_key  text NOT NULL,
  checksum            text,
  uploaded_by_user_id uuid NOT NULL,
  uploaded_at         timestamptz NOT NULL DEFAULT now(),
  status              text NOT NULL DEFAULT 'active' CHECK (status IN ('active','archived','deleted')),
  deleted_at          timestamptz,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, id),
  FOREIGN KEY (org_id, patient_id)
    REFERENCES dental.patients(org_id, id)
    ON DELETE RESTRICT,
  FOREIGN KEY (org_id, clinical_record_id, patient_id)
    REFERENCES dental.clinical_records(org_id, id, patient_id)
    ON DELETE RESTRICT,
  FOREIGN KEY (org_id, visit_id, patient_id)
    REFERENCES dental.visits(org_id, id, patient_id)
    ON DELETE RESTRICT,
  FOREIGN KEY (org_id, uploaded_by_user_id)
    REFERENCES dental.app_users(org_id, id)
    ON DELETE RESTRICT,
  CHECK (clinical_record_id IS NOT NULL OR visit_id IS NOT NULL),
  CHECK (
    (status = 'deleted' AND deleted_at IS NOT NULL)
    OR
    (status <> 'deleted' AND deleted_at IS NULL)
  )
);

CREATE TABLE IF NOT EXISTS dental.patient_payments (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id              uuid NOT NULL REFERENCES dental.organizations(id) ON DELETE RESTRICT,
  clinic_id           uuid NOT NULL,
  patient_id          uuid NOT NULL,
  visit_id            uuid,
  received_by_user_id uuid NOT NULL,
  payment_method_id   uuid NOT NULL REFERENCES dental.payment_methods(id) ON DELETE RESTRICT,
  amount              numeric(12,2) NOT NULL CHECK (amount > 0),
  currency_code       char(3) NOT NULL DEFAULT 'MXN',
  paid_at             timestamptz NOT NULL,
  reference           text,
  notes               text,
  status              text NOT NULL DEFAULT 'recorded' CHECK (status IN ('recorded','voided','refunded')),
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, id),
  FOREIGN KEY (org_id, clinic_id)
    REFERENCES dental.clinics(org_id, id)
    ON DELETE RESTRICT,
  FOREIGN KEY (org_id, patient_id)
    REFERENCES dental.patients(org_id, id)
    ON DELETE RESTRICT,
  FOREIGN KEY (org_id, visit_id, clinic_id, patient_id)
    REFERENCES dental.visits(org_id, id, clinic_id, patient_id)
    ON DELETE RESTRICT,
  FOREIGN KEY (org_id, received_by_user_id)
    REFERENCES dental.app_users(org_id, id)
    ON DELETE RESTRICT,
  CHECK (currency_code = upper(currency_code))
);
