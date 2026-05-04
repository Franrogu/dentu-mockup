SET search_path TO dental, public;

CREATE TABLE IF NOT EXISTS dental.visits (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id              uuid NOT NULL REFERENCES dental.organizations(id) ON DELETE RESTRICT,
  clinic_id           uuid NOT NULL,
  patient_id          uuid NOT NULL,
  clinical_record_id  uuid NOT NULL,
  created_by_user_id  uuid NOT NULL,
  attending_user_id   uuid,
  specialty_id        uuid,
  visit_type_id       uuid REFERENCES dental.visit_types(id) ON DELETE RESTRICT,
  reason_for_visit    text,
  chief_complaint     text,
  clinical_notes      text,
  diagnosis_notes     text,
  procedures_summary  text,
  started_at          timestamptz NOT NULL,
  ended_at            timestamptz,
  status              text NOT NULL DEFAULT 'open'
                      CHECK (status IN ('draft','open','completed','cancelled','voided')),
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, id),
  UNIQUE (org_id, id, patient_id),
  UNIQUE (org_id, id, clinic_id, patient_id),
  FOREIGN KEY (org_id, clinic_id)
    REFERENCES dental.clinics(org_id, id)
    ON DELETE RESTRICT,
  FOREIGN KEY (org_id, specialty_id)
    REFERENCES dental.organization_specialties(org_id, specialty_id)
    ON DELETE RESTRICT,
  FOREIGN KEY (org_id, clinical_record_id, patient_id)
    REFERENCES dental.clinical_records(org_id, id, patient_id)
    ON DELETE RESTRICT,
  FOREIGN KEY (org_id, created_by_user_id)
    REFERENCES dental.app_users(org_id, id)
    ON DELETE RESTRICT,
  FOREIGN KEY (org_id, attending_user_id)
    REFERENCES dental.app_users(org_id, id)
    ON DELETE RESTRICT,
  CHECK (ended_at IS NULL OR ended_at >= started_at)
);

CREATE TABLE IF NOT EXISTS dental.patient_conditions (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id              uuid NOT NULL REFERENCES dental.organizations(id) ON DELETE RESTRICT,
  patient_id          uuid NOT NULL,
  clinical_record_id  uuid NOT NULL,
  condition_id        uuid NOT NULL REFERENCES dental.clinical_conditions(id) ON DELETE RESTRICT,
  source_visit_id     uuid,
  status              text NOT NULL CHECK (status IN ('present','suspected','resolved')),
  severity_level      text CHECK (
                        severity_level IS NULL
                        OR severity_level IN ('low','medium','high','critical')
                      ),
  onset_date          date,
  resolution_date     date,
  notes               text,
  recorded_by_user_id uuid NOT NULL,
  recorded_at         timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, id),
  FOREIGN KEY (org_id, patient_id)
    REFERENCES dental.patients(org_id, id)
    ON DELETE RESTRICT,
  FOREIGN KEY (org_id, clinical_record_id, patient_id)
    REFERENCES dental.clinical_records(org_id, id, patient_id)
    ON DELETE RESTRICT,
  FOREIGN KEY (org_id, source_visit_id, patient_id)
    REFERENCES dental.visits(org_id, id, patient_id)
    ON DELETE SET NULL,
  FOREIGN KEY (org_id, recorded_by_user_id)
    REFERENCES dental.app_users(org_id, id)
    ON DELETE RESTRICT,
  CHECK (resolution_date IS NULL OR onset_date IS NULL OR resolution_date >= onset_date)
);

CREATE TABLE IF NOT EXISTS dental.patient_medications (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id              uuid NOT NULL REFERENCES dental.organizations(id) ON DELETE RESTRICT,
  patient_id          uuid NOT NULL,
  clinical_record_id  uuid NOT NULL,
  medication_name     text NOT NULL,
  dosage              text,
  frequency           text,
  route               text,
  indication          text,
  started_on          date,
  ended_on            date,
  status              text NOT NULL DEFAULT 'current'
                      CHECK (status IN ('current','paused','stopped','unknown')),
  notes               text,
  recorded_by_user_id uuid,
  recorded_at         timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, id),
  FOREIGN KEY (org_id, patient_id)
    REFERENCES dental.patients(org_id, id)
    ON DELETE RESTRICT,
  FOREIGN KEY (org_id, clinical_record_id, patient_id)
    REFERENCES dental.clinical_records(org_id, id, patient_id)
    ON DELETE RESTRICT,
  FOREIGN KEY (org_id, recorded_by_user_id)
    REFERENCES dental.app_users(org_id, id)
    ON DELETE RESTRICT,
  CHECK (btrim(medication_name) <> ''),
  CHECK (ended_on IS NULL OR started_on IS NULL OR ended_on >= started_on)
);
