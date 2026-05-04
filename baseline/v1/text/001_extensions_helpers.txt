CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE SCHEMA IF NOT EXISTS dental;
SET search_path TO dental, public;

CREATE OR REPLACE FUNCTION dental.current_org_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF(current_setting('app.current_org_id', true), '')::uuid
$$;

CREATE OR REPLACE FUNCTION dental.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = dental, public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION dental.block_mutation()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = dental, public
AS $$
BEGIN
  RAISE EXCEPTION 'table is append-only';
END;
$$;
