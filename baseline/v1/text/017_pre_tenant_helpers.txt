SET search_path TO dental, public;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'dental_pre_tenant_reader') THEN
    EXECUTE 'CREATE ROLE dental_pre_tenant_reader NOLOGIN BYPASSRLS';
  ELSE
    EXECUTE 'ALTER ROLE dental_pre_tenant_reader WITH NOLOGIN BYPASSRLS';
  END IF;
END;
$$;

REVOKE ALL ON SCHEMA dental FROM dental_pre_tenant_reader;
GRANT USAGE ON SCHEMA dental TO dental_pre_tenant_reader;

REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA dental FROM dental_pre_tenant_reader;
GRANT SELECT ON TABLE
  dental.organizations,
  dental.clinics,
  dental.roles,
  dental.app_users,
  dental.user_identities,
  dental.user_invitations
TO dental_pre_tenant_reader;

CREATE OR REPLACE FUNCTION dental.resolve_organization_by_slug(p_slug text)
RETURNS TABLE (
  id uuid,
  slug text,
  legal_name text,
  commercial_name text,
  status text,
  timezone text,
  locale text,
  country_code char(2),
  default_currency_code char(3)
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = dental, pg_temp
AS $$
  SELECT
    o.id,
    o.slug,
    o.legal_name,
    o.commercial_name,
    o.status,
    o.timezone,
    o.locale,
    o.country_code,
    o.default_currency_code
  FROM dental.organizations o
  WHERE o.slug = lower(btrim(p_slug))
  LIMIT 1
$$;

ALTER FUNCTION dental.resolve_organization_by_slug(text) OWNER TO dental_pre_tenant_reader;
REVOKE ALL ON FUNCTION dental.resolve_organization_by_slug(text) FROM PUBLIC;

CREATE OR REPLACE FUNCTION dental.resolve_oidc_identity_for_login(
  p_provider_type text,
  p_provider_subject text
)
RETURNS TABLE (
  identity_id uuid,
  user_id uuid,
  org_id uuid,
  organization_slug text,
  organization_status text,
  email text,
  email_normalized text,
  first_name text,
  last_name text,
  second_last_name text,
  user_status text,
  identity_status text,
  must_change_password boolean,
  is_verified boolean,
  provider_type text,
  provider_subject text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = dental, pg_temp
AS $$
  SELECT
    ui.id AS identity_id,
    u.id AS user_id,
    u.org_id,
    o.slug AS organization_slug,
    o.status AS organization_status,
    u.email,
    u.email_normalized,
    u.first_name,
    u.last_name,
    u.second_last_name,
    u.status AS user_status,
    ui.status AS identity_status,
    ui.must_change_password,
    ui.is_verified,
    ui.provider_type,
    ui.provider_subject
  FROM dental.user_identities ui
  JOIN dental.app_users u
    ON u.org_id = ui.org_id
   AND u.id = ui.user_id
  JOIN dental.organizations o
    ON o.id = ui.org_id
  WHERE ui.provider_type = p_provider_type
    AND ui.provider_subject = p_provider_subject
  ORDER BY ui.is_primary DESC, ui.linked_at DESC, o.slug
  LIMIT 1
$$;

ALTER FUNCTION dental.resolve_oidc_identity_for_login(text, text) OWNER TO dental_pre_tenant_reader;
REVOKE ALL ON FUNCTION dental.resolve_oidc_identity_for_login(text, text) FROM PUBLIC;

CREATE OR REPLACE FUNCTION dental.resolve_invitation_by_token_hash(
  p_invitation_token_hash text
)
RETURNS TABLE (
  id uuid,
  org_id uuid,
  organization_slug text,
  email_invited text,
  email_invited_normalized text,
  intended_role_id uuid,
  intended_role_code text,
  intended_clinic_id uuid,
  intended_clinic_code text,
  status text,
  expires_at timestamptz,
  accepted_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = dental, pg_temp
AS $$
  SELECT
    ui.id,
    ui.org_id,
    o.slug AS organization_slug,
    ui.email_invited,
    ui.email_invited_normalized,
    ui.intended_role_id,
    r.code AS intended_role_code,
    ui.intended_clinic_id,
    c.code AS intended_clinic_code,
    ui.status,
    ui.expires_at,
    ui.accepted_at
  FROM dental.user_invitations ui
  JOIN dental.organizations o
    ON o.id = ui.org_id
  LEFT JOIN dental.roles r
    ON r.id = ui.intended_role_id
  LEFT JOIN dental.clinics c
    ON c.org_id = ui.org_id
   AND c.id = ui.intended_clinic_id
  WHERE ui.invitation_token_hash = p_invitation_token_hash
  LIMIT 1
$$;

ALTER FUNCTION dental.resolve_invitation_by_token_hash(text) OWNER TO dental_pre_tenant_reader;
REVOKE ALL ON FUNCTION dental.resolve_invitation_by_token_hash(text) FROM PUBLIC;
