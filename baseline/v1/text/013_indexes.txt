SET search_path TO dental, public;

CREATE INDEX IF NOT EXISTS ix_clinics_org_status ON dental.clinics (org_id, status);

CREATE INDEX IF NOT EXISTS ix_app_users_org_status ON dental.app_users (org_id, status);
CREATE INDEX IF NOT EXISTS ix_app_users_org_email ON dental.app_users (org_id, email_normalized);

CREATE INDEX IF NOT EXISTS ix_user_identities_org_user ON dental.user_identities (org_id, user_id);
CREATE UNIQUE INDEX IF NOT EXISTS ux_user_identities_primary_active
  ON dental.user_identities (user_id)
  WHERE is_primary = true AND revoked_at IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS ux_user_identities_org_provider_subject
  ON dental.user_identities (org_id, provider_type, provider_subject)
  WHERE provider_subject IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS ux_user_identities_org_local_login
  ON dental.user_identities (org_id, login_email_normalized)
  WHERE provider_type = 'local' AND revoked_at IS NULL;

CREATE INDEX IF NOT EXISTS ix_user_invitations_org_status_expires
  ON dental.user_invitations (org_id, status, expires_at);
CREATE UNIQUE INDEX IF NOT EXISTS ux_user_invitations_org_pending_email
  ON dental.user_invitations (org_id, email_invited_normalized)
  WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS ix_refresh_tokens_org_user_expires
  ON dental.refresh_tokens (org_id, user_id, expires_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS ux_refresh_tokens_org_token_hash_active
  ON dental.refresh_tokens (org_id, token_hash)
  WHERE revoked_at IS NULL;

CREATE INDEX IF NOT EXISTS ix_password_reset_tokens_org_identity_expires
  ON dental.password_reset_tokens (org_id, user_identity_id, expires_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS ux_password_reset_tokens_org_token_hash_active
  ON dental.password_reset_tokens (org_id, token_hash)
  WHERE consumed_at IS NULL;

CREATE INDEX IF NOT EXISTS ix_user_org_roles_org_user_status
  ON dental.user_org_roles (org_id, user_id, status);
CREATE UNIQUE INDEX IF NOT EXISTS ux_user_org_roles_active
  ON dental.user_org_roles (org_id, user_id, role_id)
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS ix_user_clinic_roles_org_clinic_user_status
  ON dental.user_clinic_roles (org_id, clinic_id, user_id, status);
CREATE INDEX IF NOT EXISTS ix_user_clinic_roles_org_user_status
  ON dental.user_clinic_roles (org_id, user_id, status);
CREATE UNIQUE INDEX IF NOT EXISTS ux_user_clinic_roles_active
  ON dental.user_clinic_roles (org_id, clinic_id, user_id, role_id)
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS ix_organization_specialties_org_active
  ON dental.organization_specialties (org_id, is_active);
CREATE INDEX IF NOT EXISTS ix_clinic_specialties_org_clinic_active
  ON dental.clinic_specialties (org_id, clinic_id, is_active);
CREATE INDEX IF NOT EXISTS ix_clinician_profiles_org_status
  ON dental.clinician_profiles (org_id, profile_status);
CREATE INDEX IF NOT EXISTS ix_clinician_specialties_org_clinician_active
  ON dental.clinician_specialties (org_id, clinician_profile_id, is_active);
CREATE UNIQUE INDEX IF NOT EXISTS ux_clinician_specialties_one_primary
  ON dental.clinician_specialties (org_id, clinician_profile_id)
  WHERE is_primary = true;

CREATE INDEX IF NOT EXISTS ix_patients_org_status ON dental.patients (org_id, status);
CREATE INDEX IF NOT EXISTS ix_patients_org_full_name ON dental.patients (org_id, full_name_normalized);
CREATE INDEX IF NOT EXISTS ix_patients_org_birth_date ON dental.patients (org_id, birth_date);

CREATE INDEX IF NOT EXISTS ix_clinical_records_org_status ON dental.clinical_records (org_id, status);

CREATE INDEX IF NOT EXISTS ix_visits_org_clinic_started_at
  ON dental.visits (org_id, clinic_id, started_at DESC);
CREATE INDEX IF NOT EXISTS ix_visits_org_patient_started_at
  ON dental.visits (org_id, patient_id, started_at DESC);
CREATE INDEX IF NOT EXISTS ix_visits_org_status
  ON dental.visits (org_id, status);
CREATE INDEX IF NOT EXISTS ix_visits_org_specialty_started_at
  ON dental.visits (org_id, specialty_id, started_at DESC)
  WHERE specialty_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS ix_patient_conditions_org_patient
  ON dental.patient_conditions (org_id, patient_id);
CREATE INDEX IF NOT EXISTS ix_patient_conditions_org_record
  ON dental.patient_conditions (org_id, clinical_record_id);
CREATE INDEX IF NOT EXISTS ix_patient_conditions_org_condition_status
  ON dental.patient_conditions (org_id, condition_id, status);
CREATE INDEX IF NOT EXISTS ix_patient_conditions_org_source_visit
  ON dental.patient_conditions (org_id, source_visit_id)
  WHERE source_visit_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS ux_patient_conditions_present
  ON dental.patient_conditions (org_id, patient_id, condition_id)
  WHERE status = 'present';

CREATE INDEX IF NOT EXISTS ix_patient_medications_org_patient_status
  ON dental.patient_medications (org_id, patient_id, status);
CREATE INDEX IF NOT EXISTS ix_patient_medications_org_record
  ON dental.patient_medications (org_id, clinical_record_id);

CREATE INDEX IF NOT EXISTS ix_odontogram_snapshots_org_record_version
  ON dental.odontogram_snapshots (org_id, clinical_record_id, version_no DESC);

CREATE INDEX IF NOT EXISTS ix_clinical_attachments_org_patient_uploaded_at
  ON dental.clinical_attachments (org_id, patient_id, uploaded_at DESC);
CREATE INDEX IF NOT EXISTS ix_clinical_attachments_org_visit
  ON dental.clinical_attachments (org_id, visit_id)
  WHERE visit_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS ix_patient_payments_org_clinic_paid_at
  ON dental.patient_payments (org_id, clinic_id, paid_at DESC);
CREATE INDEX IF NOT EXISTS ix_patient_payments_org_patient_paid_at
  ON dental.patient_payments (org_id, patient_id, paid_at DESC);

CREATE INDEX IF NOT EXISTS ix_audit_events_org_occurred_at
  ON dental.audit_events (org_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS ix_audit_events_org_event_type
  ON dental.audit_events (org_id, event_type, occurred_at DESC);
CREATE INDEX IF NOT EXISTS ix_audit_events_org_target_patient
  ON dental.audit_events (org_id, target_patient_id, occurred_at DESC)
  WHERE target_patient_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS ux_billing_plans_provider_price
  ON dental.billing_plans (provider, provider_price_id)
  WHERE provider IS NOT NULL AND provider_price_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS ux_organization_subscriptions_one_open
  ON dental.organization_subscriptions (org_id)
  WHERE status IN ('pending','trialing','active','past_due','paused');
CREATE INDEX IF NOT EXISTS ix_organization_subscriptions_org_status
  ON dental.organization_subscriptions (org_id, status);
CREATE INDEX IF NOT EXISTS ix_billing_events_org_status_occurred
  ON dental.billing_events (org_id, status, occurred_at DESC);

CREATE INDEX IF NOT EXISTS ix_platform_users_status ON dental.platform_users (status);
CREATE INDEX IF NOT EXISTS ix_platform_users_role ON dental.platform_users (platform_role_id);
CREATE UNIQUE INDEX IF NOT EXISTS ux_platform_identities_primary_active
  ON dental.platform_identities (platform_user_id)
  WHERE is_primary = true AND revoked_at IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS ux_platform_identities_provider_subject
  ON dental.platform_identities (provider_type, provider_key, provider_subject)
  WHERE provider_subject IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS ux_platform_identities_local_login_active
  ON dental.platform_identities (login_email_normalized)
  WHERE provider_type = 'local' AND revoked_at IS NULL;
