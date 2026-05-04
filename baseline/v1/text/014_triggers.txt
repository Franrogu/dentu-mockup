SET search_path TO dental, public;

DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'clinical_specialties',
    'visit_types',
    'payment_methods',
    'attachment_types',
    'clinical_conditions',
    'organizations',
    'clinics',
    'app_users',
    'user_identities',
    'user_invitations',
    'refresh_tokens',
    'roles',
    'permissions',
    'user_org_roles',
    'user_clinic_roles',
    'organization_specialties',
    'clinic_specialties',
    'clinician_profiles',
    'clinician_specialties',
    'patient_code_sequences',
    'patients',
    'clinical_records',
    'visits',
    'patient_conditions',
    'patient_medications',
    'clinical_attachments',
    'patient_payments',
    'billing_plans',
    'organization_billing_accounts',
    'organization_subscriptions',
    'billing_events',
    'platform_roles',
    'platform_users',
    'platform_identities'
  ]
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_%s_updated_at ON dental.%I', t, t);
    EXECUTE format(
      'CREATE TRIGGER trg_%s_updated_at
       BEFORE UPDATE ON dental.%I
       FOR EACH ROW
       EXECUTE FUNCTION dental.set_updated_at()',
      t, t
    );
  END LOOP;
END;
$$;

DROP TRIGGER IF EXISTS trg_audit_events_block_mutation ON dental.audit_events;
CREATE TRIGGER trg_audit_events_block_mutation
BEFORE UPDATE OR DELETE ON dental.audit_events
FOR EACH ROW
EXECUTE FUNCTION dental.block_mutation();

DROP TRIGGER IF EXISTS trg_billing_events_block_mutation ON dental.billing_events;
CREATE TRIGGER trg_billing_events_block_mutation
BEFORE UPDATE OR DELETE ON dental.billing_events
FOR EACH ROW
EXECUTE FUNCTION dental.block_mutation();

DROP TRIGGER IF EXISTS trg_odontogram_snapshots_block_mutation ON dental.odontogram_snapshots;
CREATE TRIGGER trg_odontogram_snapshots_block_mutation
BEFORE UPDATE OR DELETE ON dental.odontogram_snapshots
FOR EACH ROW
EXECUTE FUNCTION dental.block_mutation();

CREATE OR REPLACE FUNCTION dental.ensure_password_reset_token_local_identity()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = dental, public
AS $$
DECLARE
  v_provider_type dental.user_identities.provider_type%TYPE;
BEGIN
  SELECT ui.provider_type
    INTO v_provider_type
    FROM dental.user_identities ui
   WHERE ui.org_id = NEW.org_id
     AND ui.id = NEW.user_identity_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'password_reset_tokens identity % was not found for org %',
      NEW.user_identity_id, NEW.org_id;
  END IF;

  IF v_provider_type <> 'local' THEN
    RAISE EXCEPTION 'password_reset_tokens only supports local identities';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_password_reset_tokens_local_identity
ON dental.password_reset_tokens;

CREATE TRIGGER trg_password_reset_tokens_local_identity
BEFORE INSERT OR UPDATE ON dental.password_reset_tokens
FOR EACH ROW
EXECUTE FUNCTION dental.ensure_password_reset_token_local_identity();
