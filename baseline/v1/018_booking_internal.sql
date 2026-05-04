-- 018_booking_internal.sql
-- Booking interno / citas internas para DentalOS.
--
-- Objetivo:
--   - Agregar agenda interna sin convertir appointments en visits.
--   - Mantener consistencia tenant-aware con org_id + RLS.
--   - Evitar duplicidades clínicas.
--   - Resolver no-show, cancelación, check-in, conversión a visita y reagendamiento con mínima complejidad.
--   - Dejar preparada la extensión futura a booking externo sin crear pacientes/leads externos aquí.
--
-- Decisión importante:
--   Este archivo NO hace backfill desde clinics ni seed RBAC.
--   Motivo: esas operaciones pueden fallar bajo RLS/FORCE RLS si el migrator no es owner/BYPASSRLS.
--   Ejecuta backfill/RBAC desde un provisioner/owner separado si lo necesitas.
--
-- Requiere que ya existan:
--   organizations, clinics, app_users, patients, clinical_records,
--   organization_specialties, visit_types, visits.

SET search_path TO dental, public;

-- =========================================================
-- 1) EXTENSIÓN PARA EVITAR SOLAPAMIENTO REAL EN DB
-- =========================================================
-- Se usa btree_gist para una exclusion constraint con uuid + rango temporal.
-- Esta regla es intencionalmente mínima: evita doble booking del mismo profesional
-- dentro de la organización para rangos activos. Las reglas finas de disponibilidad
-- siguen viviendo en backend.
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- =========================================================
-- 2) CONFIGURACIÓN MÍNIMA DE BOOKING POR CLÍNICA
-- =========================================================
-- Configuración operativa por clínica.
-- La fila puede crearse por backend/provisioner al crear la clínica o de forma lazy.
-- No se hace backfill aquí para evitar dependencias frágiles con RLS sobre clinics.
CREATE TABLE IF NOT EXISTS dental.clinic_booking_settings (
  id                                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id                                  uuid NOT NULL REFERENCES dental.organizations(id) ON DELETE RESTRICT,
  clinic_id                               uuid NOT NULL,

  default_slot_duration_minutes           integer NOT NULL DEFAULT 30,
  min_notice_minutes                      integer NOT NULL DEFAULT 0,
  max_days_ahead                          integer NOT NULL DEFAULT 90,

  internal_booking_enabled                boolean NOT NULL DEFAULT true,
  external_booking_enabled                boolean NOT NULL DEFAULT false,
  external_requires_manual_confirmation   boolean NOT NULL DEFAULT true,

  working_hours_json                      jsonb NOT NULL DEFAULT '{}'::jsonb,
  metadata_json                           jsonb NOT NULL DEFAULT '{}'::jsonb,

  created_at                              timestamptz NOT NULL DEFAULT now(),
  updated_at                              timestamptz NOT NULL DEFAULT now(),

  UNIQUE (org_id, id),
  UNIQUE (org_id, clinic_id),

  FOREIGN KEY (org_id, clinic_id)
    REFERENCES dental.clinics(org_id, id)
    ON DELETE RESTRICT,

  CHECK (default_slot_duration_minutes BETWEEN 5 AND 480),
  CHECK (min_notice_minutes >= 0),
  CHECK (max_days_ahead BETWEEN 1 AND 730),
  CHECK (jsonb_typeof(working_hours_json) = 'object'),
  CHECK (jsonb_typeof(metadata_json) = 'object')
);

-- =========================================================
-- 3) BOOKING INTERNO / CITAS
-- =========================================================
-- appointment = intención/agendamiento operativo.
-- visit       = atención clínica real.
-- Por eso no se agregan campos clínicos ni se sobrecarga dental.visits.
CREATE TABLE IF NOT EXISTS dental.appointments (
  id                              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id                          uuid NOT NULL REFERENCES dental.organizations(id) ON DELETE RESTRICT,
  clinic_id                       uuid NOT NULL,

  -- Booking interno: exige paciente y expediente existentes.
  -- Booking externo futuro debe entrar por una tabla separada de requests/leads.
  patient_id                      uuid NOT NULL,
  clinical_record_id              uuid NOT NULL,

  created_by_user_id              uuid NOT NULL,
  updated_by_user_id              uuid,
  attending_user_id               uuid,

  specialty_id                    uuid,
  visit_type_id                   uuid REFERENCES dental.visit_types(id) ON DELETE RESTRICT,

  -- Se llena cuando la cita se convierte en visita clínica.
  visit_id                        uuid,

  -- La cita nueva apunta a la cita original que fue reagendada.
  rescheduled_from_appointment_id uuid,

  booking_source                  text NOT NULL DEFAULT 'internal'
                                  CHECK (booking_source IN (
                                    'internal',
                                    'external_request',
                                    'external_portal',
                                    'import',
                                    'other'
                                  )),

  status                          text NOT NULL DEFAULT 'scheduled'
                                  CHECK (status IN (
                                    'draft',
                                    'scheduled',
                                    'confirmed',
                                    'checked_in',
                                    'completed',
                                    'cancelled',
                                    'no_show',
                                    'rescheduled'
                                  )),

  scheduled_start_at              timestamptz NOT NULL,
  scheduled_end_at                timestamptz NOT NULL,

  reason_for_visit                text,
  patient_notes                   text,
  internal_notes                  text,

  confirmed_at                    timestamptz,
  checked_in_at                   timestamptz,
  completed_at                    timestamptz,

  cancelled_at                    timestamptz,
  cancelled_by_user_id            uuid,
  cancellation_reason             text,

  no_show_marked_at               timestamptz,
  no_show_marked_by_user_id       uuid,
  no_show_reason                  text,

  -- Campo puente para integraciones futuras. No se usa para crear pacientes externos.
  external_reference              text,
  metadata_json                   jsonb NOT NULL DEFAULT '{}'::jsonb,

  created_at                      timestamptz NOT NULL DEFAULT now(),
  updated_at                      timestamptz NOT NULL DEFAULT now(),

  UNIQUE (org_id, id),
  UNIQUE (org_id, id, patient_id, clinical_record_id),

  FOREIGN KEY (org_id, clinic_id)
    REFERENCES dental.clinics(org_id, id)
    ON DELETE RESTRICT,

  FOREIGN KEY (org_id, patient_id)
    REFERENCES dental.patients(org_id, id)
    ON DELETE RESTRICT,

  FOREIGN KEY (org_id, clinical_record_id, patient_id)
    REFERENCES dental.clinical_records(org_id, id, patient_id)
    ON DELETE RESTRICT,

  FOREIGN KEY (org_id, created_by_user_id)
    REFERENCES dental.app_users(org_id, id)
    ON DELETE RESTRICT,

  FOREIGN KEY (org_id, updated_by_user_id)
    REFERENCES dental.app_users(org_id, id)
    ON DELETE RESTRICT,

  FOREIGN KEY (org_id, attending_user_id)
    REFERENCES dental.app_users(org_id, id)
    ON DELETE RESTRICT,

  FOREIGN KEY (org_id, cancelled_by_user_id)
    REFERENCES dental.app_users(org_id, id)
    ON DELETE RESTRICT,

  FOREIGN KEY (org_id, no_show_marked_by_user_id)
    REFERENCES dental.app_users(org_id, id)
    ON DELETE RESTRICT,

  FOREIGN KEY (org_id, specialty_id)
    REFERENCES dental.organization_specialties(org_id, specialty_id)
    ON DELETE RESTRICT,

  -- Si una cita ya generó visita, se valida mismo tenant, clínica y paciente.
  FOREIGN KEY (org_id, visit_id, clinic_id, patient_id)
    REFERENCES dental.visits(org_id, id, clinic_id, patient_id)
    ON DELETE RESTRICT,

  CHECK (scheduled_end_at > scheduled_start_at),
  CHECK (rescheduled_from_appointment_id IS NULL OR rescheduled_from_appointment_id <> id),
  CHECK (jsonb_typeof(metadata_json) = 'object'),
  CHECK (external_reference IS NULL OR btrim(external_reference) <> ''),
  CHECK (reason_for_visit IS NULL OR btrim(reason_for_visit) <> ''),
  CHECK (cancellation_reason IS NULL OR status = 'cancelled'),
  CHECK (cancellation_reason IS NULL OR btrim(cancellation_reason) <> ''),
  CHECK (no_show_reason IS NULL OR status = 'no_show'),
  CHECK (no_show_reason IS NULL OR btrim(no_show_reason) <> ''),

  -- Guardrails mínimos de lifecycle. La máquina de estados completa vive en backend.
  CHECK (status <> 'confirmed' OR confirmed_at IS NOT NULL),
  CHECK (status <> 'checked_in' OR checked_in_at IS NOT NULL),
  CHECK (status <> 'completed' OR (completed_at IS NOT NULL AND visit_id IS NOT NULL)),
  CHECK (status <> 'cancelled' OR (cancelled_at IS NOT NULL AND visit_id IS NULL)),
  CHECK (status <> 'no_show' OR (no_show_marked_at IS NOT NULL AND visit_id IS NULL)),
  CHECK (status <> 'rescheduled' OR visit_id IS NULL),
  CHECK (visit_id IS NULL OR status IN ('checked_in','completed')),

  -- Evita timestamps incompatibles con el estado actual.
  CHECK (confirmed_at IS NULL OR status IN ('confirmed','checked_in','completed','cancelled','no_show','rescheduled')),
  CHECK (checked_in_at IS NULL OR status IN ('checked_in','completed')),
  CHECK (completed_at IS NULL OR status = 'completed'),
  CHECK (cancelled_at IS NULL OR status = 'cancelled'),
  CHECK (no_show_marked_at IS NULL OR status = 'no_show'),
  CHECK (cancelled_by_user_id IS NULL OR cancelled_at IS NOT NULL),
  CHECK (no_show_marked_by_user_id IS NULL OR no_show_marked_at IS NOT NULL),

  CHECK (confirmed_at IS NULL OR confirmed_at >= created_at),
  CHECK (checked_in_at IS NULL OR checked_in_at >= created_at),
  CHECK (completed_at IS NULL OR completed_at >= created_at),
  CHECK (cancelled_at IS NULL OR cancelled_at >= created_at),
  CHECK (no_show_marked_at IS NULL OR no_show_marked_at >= created_at),

  -- Orden temporal mínimo sin modelar toda la máquina de estados en DB.
  CHECK (checked_in_at IS NULL OR confirmed_at IS NULL OR checked_in_at >= confirmed_at),
  CHECK (completed_at IS NULL OR checked_in_at IS NULL OR completed_at >= checked_in_at),

  -- Estados terminales mutuamente excluyentes por timestamp.
  CHECK (cancelled_at IS NULL OR no_show_marked_at IS NULL)
);

-- Self-FK separada porque apunta a la misma tabla.
-- Amarra la cita reagendada al mismo paciente y expediente para evitar cruces entre charts.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'appointments_rescheduled_from_fkey'
      AND conrelid = 'dental.appointments'::regclass
  ) THEN
    ALTER TABLE dental.appointments
      ADD CONSTRAINT appointments_rescheduled_from_fkey
      FOREIGN KEY (
        org_id,
        rescheduled_from_appointment_id,
        patient_id,
        clinical_record_id
      )
      REFERENCES dental.appointments(
        org_id,
        id,
        patient_id,
        clinical_record_id
      )
      ON DELETE RESTRICT;
  END IF;
END;
$$;

-- =========================================================
-- 4) ÍNDICES DE CONSULTA
-- =========================================================
CREATE INDEX IF NOT EXISTS ix_appointments_org_clinic_start
  ON dental.appointments (org_id, clinic_id, scheduled_start_at DESC);

CREATE INDEX IF NOT EXISTS ix_appointments_org_patient_start
  ON dental.appointments (org_id, patient_id, scheduled_start_at DESC);

CREATE INDEX IF NOT EXISTS ix_appointments_org_attending_start
  ON dental.appointments (org_id, attending_user_id, scheduled_start_at DESC)
  WHERE attending_user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS ix_appointments_org_status_start
  ON dental.appointments (org_id, status, scheduled_start_at DESC);

CREATE INDEX IF NOT EXISTS ix_appointments_org_specialty_start
  ON dental.appointments (org_id, specialty_id, scheduled_start_at DESC)
  WHERE specialty_id IS NOT NULL;

-- Una visita sólo puede quedar vinculada a una cita.
CREATE UNIQUE INDEX IF NOT EXISTS ux_appointments_org_visit
  ON dental.appointments (org_id, visit_id)
  WHERE visit_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS ix_appointments_org_source_start
  ON dental.appointments (org_id, booking_source, scheduled_start_at DESC);

-- Garantiza que una cita original sólo tenga una sucesora por reagendamiento.
CREATE UNIQUE INDEX IF NOT EXISTS ux_appointments_one_reschedule_successor
  ON dental.appointments (org_id, rescheduled_from_appointment_id)
  WHERE rescheduled_from_appointment_id IS NOT NULL;

-- =========================================================
-- 5) SOLAPAMIENTO / DOUBLE BOOKING
-- =========================================================
-- Evita dos citas activas para el mismo profesional en la organización.
-- No incluye clinic_id: un profesional no puede estar en dos clínicas al mismo tiempo.
-- No aplica si attending_user_id es NULL para permitir citas aún sin doctor asignado.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'appointments_no_overlap_active'
      AND conrelid = 'dental.appointments'::regclass
  ) THEN
    ALTER TABLE dental.appointments
      ADD CONSTRAINT appointments_no_overlap_active
      EXCLUDE USING gist (
        org_id WITH =,
        attending_user_id WITH =,
        tstzrange(scheduled_start_at, scheduled_end_at, '[)') WITH &&
      )
      WHERE (
        attending_user_id IS NOT NULL
        AND status IN ('scheduled','confirmed','checked_in')
      );
  END IF;
END;
$$;

-- =========================================================
-- 6) TRIGGERS updated_at
-- =========================================================
DROP TRIGGER IF EXISTS trg_clinic_booking_settings_updated_at
ON dental.clinic_booking_settings;

CREATE TRIGGER trg_clinic_booking_settings_updated_at
BEFORE UPDATE ON dental.clinic_booking_settings
FOR EACH ROW
EXECUTE FUNCTION dental.set_updated_at();

DROP TRIGGER IF EXISTS trg_appointments_updated_at
ON dental.appointments;

CREATE TRIGGER trg_appointments_updated_at
BEFORE UPDATE ON dental.appointments
FOR EACH ROW
EXECUTE FUNCTION dental.set_updated_at();

-- =========================================================
-- 7) RLS TENANT-AWARE
-- =========================================================
ALTER TABLE dental.clinic_booking_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE dental.clinic_booking_settings FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS clinic_booking_settings_select_policy ON dental.clinic_booking_settings;
CREATE POLICY clinic_booking_settings_select_policy
  ON dental.clinic_booking_settings
  FOR SELECT
  USING (org_id = dental.current_org_id());

DROP POLICY IF EXISTS clinic_booking_settings_insert_policy ON dental.clinic_booking_settings;
CREATE POLICY clinic_booking_settings_insert_policy
  ON dental.clinic_booking_settings
  FOR INSERT
  WITH CHECK (org_id = dental.current_org_id());

DROP POLICY IF EXISTS clinic_booking_settings_update_policy ON dental.clinic_booking_settings;
CREATE POLICY clinic_booking_settings_update_policy
  ON dental.clinic_booking_settings
  FOR UPDATE
  USING (org_id = dental.current_org_id())
  WITH CHECK (org_id = dental.current_org_id());

DROP POLICY IF EXISTS clinic_booking_settings_delete_policy ON dental.clinic_booking_settings;

ALTER TABLE dental.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE dental.appointments FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS appointments_select_policy ON dental.appointments;
CREATE POLICY appointments_select_policy
  ON dental.appointments
  FOR SELECT
  USING (org_id = dental.current_org_id());

DROP POLICY IF EXISTS appointments_insert_policy ON dental.appointments;
CREATE POLICY appointments_insert_policy
  ON dental.appointments
  FOR INSERT
  WITH CHECK (org_id = dental.current_org_id());

DROP POLICY IF EXISTS appointments_update_policy ON dental.appointments;
CREATE POLICY appointments_update_policy
  ON dental.appointments
  FOR UPDATE
  USING (org_id = dental.current_org_id())
  WITH CHECK (org_id = dental.current_org_id());

DROP POLICY IF EXISTS appointments_delete_policy ON dental.appointments;

-- =========================================================
-- 8) GRANTS OPERATIVOS
-- =========================================================
-- Si tu entorno usa nombres distintos, replica estos grants en 016_grants.sql
-- con las variables :app_role y :readonly_role.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'dental_app') THEN
    GRANT SELECT, INSERT, UPDATE
      ON TABLE dental.clinic_booking_settings, dental.appointments
      TO dental_app;

    REVOKE DELETE
      ON TABLE dental.clinic_booking_settings, dental.appointments
      FROM dental_app;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'dental_readonly') THEN
    GRANT SELECT
      ON TABLE dental.clinic_booking_settings, dental.appointments
      TO dental_readonly;
  END IF;
END;
$$;
