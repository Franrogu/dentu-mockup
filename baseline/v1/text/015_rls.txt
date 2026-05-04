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
    'billing_plans',
    'roles',
    'permissions',
    'role_permissions',
    'platform_roles'
  ]
  LOOP
    EXECUTE format('ALTER TABLE dental.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER TABLE dental.%I FORCE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS %I ON dental.%I', t || '_select_policy', t);
    EXECUTE format('CREATE POLICY %I ON dental.%I FOR SELECT USING (true)', t || '_select_policy', t);
  END LOOP;
END;
$$;

DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'clinics',
    'app_users',
    'user_identities',
    'user_invitations',
    'refresh_tokens',
    'password_reset_tokens',
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
    'odontogram_snapshots',
    'clinical_attachments',
    'patient_payments',
    'audit_events',
    'organization_billing_accounts',
    'organization_subscriptions',
    'billing_events'
  ]
  LOOP
    EXECUTE format('ALTER TABLE dental.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER TABLE dental.%I FORCE ROW LEVEL SECURITY', t);

    EXECUTE format('DROP POLICY IF EXISTS %I ON dental.%I', t || '_select_policy', t);
    EXECUTE format('CREATE POLICY %I ON dental.%I FOR SELECT USING (org_id = dental.current_org_id())', t || '_select_policy', t);

    EXECUTE format('DROP POLICY IF EXISTS %I ON dental.%I', t || '_insert_policy', t);
    EXECUTE format('CREATE POLICY %I ON dental.%I FOR INSERT WITH CHECK (org_id = dental.current_org_id())', t || '_insert_policy', t);

    EXECUTE format('DROP POLICY IF EXISTS %I ON dental.%I', t || '_update_policy', t);
    EXECUTE format('CREATE POLICY %I ON dental.%I FOR UPDATE USING (org_id = dental.current_org_id()) WITH CHECK (org_id = dental.current_org_id())', t || '_update_policy', t);

    EXECUTE format('DROP POLICY IF EXISTS %I ON dental.%I', t || '_delete_policy', t);
    EXECUTE format('CREATE POLICY %I ON dental.%I FOR DELETE USING (org_id = dental.current_org_id())', t || '_delete_policy', t);
  END LOOP;
END;
$$;

ALTER TABLE dental.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE dental.organizations FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS organizations_select_policy ON dental.organizations;
CREATE POLICY organizations_select_policy
  ON dental.organizations
  FOR SELECT
  USING (id = dental.current_org_id());

DROP POLICY IF EXISTS organizations_update_policy ON dental.organizations;
CREATE POLICY organizations_update_policy
  ON dental.organizations
  FOR UPDATE
  USING (id = dental.current_org_id())
  WITH CHECK (id = dental.current_org_id());

DROP POLICY IF EXISTS organizations_insert_policy ON dental.organizations;
DROP POLICY IF EXISTS organizations_delete_policy ON dental.organizations;

DROP POLICY IF EXISTS audit_events_update_policy ON dental.audit_events;
DROP POLICY IF EXISTS audit_events_delete_policy ON dental.audit_events;
DROP POLICY IF EXISTS billing_events_update_policy ON dental.billing_events;
DROP POLICY IF EXISTS billing_events_delete_policy ON dental.billing_events;
DROP POLICY IF EXISTS odontogram_snapshots_update_policy ON dental.odontogram_snapshots;
DROP POLICY IF EXISTS odontogram_snapshots_delete_policy ON dental.odontogram_snapshots;
