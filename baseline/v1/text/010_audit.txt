SET search_path TO dental, public;

CREATE TABLE IF NOT EXISTS dental.audit_events (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id            uuid NOT NULL REFERENCES dental.organizations(id) ON DELETE RESTRICT,
  clinic_id         uuid,
  actor_user_id     uuid,
  actor_type        text NOT NULL CHECK (actor_type IN ('user','system','integration','anonymous')),
  event_type        text NOT NULL,
  entity_type       text NOT NULL,
  entity_id         uuid,
  target_patient_id uuid,
  target_visit_id   uuid,
  metadata_json     jsonb NOT NULL DEFAULT '{}'::jsonb,
  source_ip         inet,
  user_agent        text,
  occurred_at       timestamptz NOT NULL DEFAULT now(),
  is_sensitive      boolean NOT NULL DEFAULT false,
  UNIQUE (org_id, id),
  FOREIGN KEY (org_id, clinic_id)
    REFERENCES dental.clinics(org_id, id)
    ON DELETE RESTRICT,
  FOREIGN KEY (org_id, actor_user_id)
    REFERENCES dental.app_users(org_id, id)
    ON DELETE RESTRICT,
  FOREIGN KEY (org_id, target_patient_id)
    REFERENCES dental.patients(org_id, id)
    ON DELETE RESTRICT,
  FOREIGN KEY (org_id, target_visit_id)
    REFERENCES dental.visits(org_id, id)
    ON DELETE RESTRICT,
  CHECK (jsonb_typeof(metadata_json) = 'object'),
  CHECK (btrim(event_type) <> ''),
  CHECK (btrim(entity_type) <> '')
);
