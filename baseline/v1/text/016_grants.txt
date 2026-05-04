\set ON_ERROR_STOP on

\if :{?app_role}
\else
  \echo 'ERROR: missing -v app_role=...'
  \quit 1
\endif

\if :{?readonly_role}
\else
  \echo 'ERROR: missing -v readonly_role=...'
  \quit 1
\endif

SET search_path TO dental, public;

REVOKE ALL ON SCHEMA dental FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA dental FROM PUBLIC;

SELECT format('GRANT USAGE ON SCHEMA dental TO %I, %I', :'app_role', :'readonly_role')
\gexec

SELECT format('GRANT USAGE ON SCHEMA public TO %I, %I', :'app_role', :'readonly_role')
\gexec

SELECT format('REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA dental FROM %I', :'app_role')
\gexec

SELECT format('REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA dental FROM %I', :'readonly_role')
\gexec

SELECT format('GRANT SELECT ON ALL TABLES IN SCHEMA dental TO %I', :'readonly_role')
\gexec

SELECT format('GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA dental TO %I', :'app_role')
\gexec

SELECT format($sql$
  REVOKE INSERT, UPDATE, DELETE
  ON TABLE
    dental.clinical_specialties,
    dental.visit_types,
    dental.payment_methods,
    dental.attachment_types,
    dental.clinical_conditions,
    dental.billing_plans,
    dental.roles,
    dental.permissions,
    dental.role_permissions,
    dental.platform_roles
  FROM %I
$sql$, :'app_role')
\gexec

SELECT format('REVOKE INSERT, DELETE ON TABLE dental.organizations FROM %I', :'app_role')
\gexec

SELECT format('GRANT SELECT, UPDATE ON TABLE dental.organizations TO %I', :'app_role')
\gexec

SELECT format($sql$
  REVOKE DELETE
  ON TABLE
    dental.clinics,
    dental.app_users,
    dental.user_identities,
    dental.user_invitations,
    dental.refresh_tokens,
    dental.password_reset_tokens,
    dental.user_org_roles,
    dental.user_clinic_roles,
    dental.organization_specialties,
    dental.clinic_specialties,
    dental.clinician_profiles,
    dental.clinician_specialties,
    dental.patient_code_sequences,
    dental.patients,
    dental.clinical_records,
    dental.visits,
    dental.patient_conditions,
    dental.patient_medications,
    dental.clinical_attachments,
    dental.patient_payments,
    dental.organization_billing_accounts,
    dental.organization_subscriptions,
    dental.platform_users,
    dental.platform_identities
  FROM %I
$sql$, :'app_role')
\gexec

SELECT format('REVOKE UPDATE, DELETE ON TABLE dental.audit_events FROM %I', :'app_role')
\gexec

SELECT format('REVOKE UPDATE, DELETE ON TABLE dental.billing_events FROM %I', :'app_role')
\gexec

SELECT format('REVOKE UPDATE, DELETE ON TABLE dental.odontogram_snapshots FROM %I', :'app_role')
\gexec

SELECT format('GRANT EXECUTE ON FUNCTION dental.resolve_organization_by_slug(text) TO %I', :'app_role')
\gexec

SELECT format('GRANT EXECUTE ON FUNCTION dental.resolve_oidc_identity_for_login(text, text) TO %I', :'app_role')
\gexec

SELECT format('GRANT EXECUTE ON FUNCTION dental.resolve_invitation_by_token_hash(text) TO %I', :'app_role')
\gexec

ALTER DEFAULT PRIVILEGES IN SCHEMA dental REVOKE ALL ON TABLES FROM PUBLIC;

SELECT format('ALTER DEFAULT PRIVILEGES IN SCHEMA dental GRANT SELECT ON TABLES TO %I', :'readonly_role')
\gexec

SELECT format('ALTER DEFAULT PRIVILEGES IN SCHEMA dental GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO %I', :'app_role')
\gexec
