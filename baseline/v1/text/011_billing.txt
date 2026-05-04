SET search_path TO dental, public;

CREATE TABLE IF NOT EXISTS dental.billing_plans (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code                    text NOT NULL UNIQUE,
  name                    text NOT NULL,
  description             text,
  status                  text NOT NULL DEFAULT 'active'
                          CHECK (status IN ('draft','active','inactive','retired')),
  billing_interval        text NOT NULL CHECK (billing_interval IN ('month','year')),
  billing_interval_count  integer NOT NULL DEFAULT 1 CHECK (billing_interval_count >= 1),
  price_amount            numeric(12,2) NOT NULL CHECK (price_amount >= 0),
  currency_code           char(3) NOT NULL DEFAULT 'MXN',
  trial_period_days       integer NOT NULL DEFAULT 0 CHECK (trial_period_days >= 0),
  provider                text,
  provider_price_id       text,
  features_json           jsonb NOT NULL DEFAULT '{}'::jsonb,
  metadata_json           jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now(),
  CHECK (btrim(code) <> ''),
  CHECK (code = lower(code)),
  CHECK (currency_code = upper(currency_code)),
  CHECK (jsonb_typeof(features_json) = 'object'),
  CHECK (jsonb_typeof(metadata_json) = 'object')
);

CREATE TABLE IF NOT EXISTS dental.organization_billing_accounts (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id                uuid NOT NULL REFERENCES dental.organizations(id) ON DELETE RESTRICT,
  provider              text NOT NULL,
  provider_customer_id  text,
  billing_email         text,
  billing_contact_name  text,
  tax_id                text,
  status                text NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active','past_due','suspended','closed')),
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, id),
  UNIQUE (org_id),
  CHECK (btrim(provider) <> '')
);

CREATE TABLE IF NOT EXISTS dental.organization_subscriptions (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id                      uuid NOT NULL REFERENCES dental.organizations(id) ON DELETE RESTRICT,
  billing_account_id          uuid NOT NULL,
  billing_plan_id             uuid NOT NULL REFERENCES dental.billing_plans(id) ON DELETE RESTRICT,
  provider                    text NOT NULL,
  provider_subscription_id    text,
  status                      text NOT NULL DEFAULT 'pending'
                              CHECK (status IN ('pending','trialing','active','past_due','paused','cancelled','expired')),
  current_period_start        timestamptz,
  current_period_end          timestamptz,
  trial_start                 timestamptz,
  trial_end                   timestamptz,
  cancel_at_period_end        boolean NOT NULL DEFAULT false,
  cancelled_at                timestamptz,
  ended_at                    timestamptz,
  plan_features_snapshot_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, id),
  FOREIGN KEY (org_id, billing_account_id)
    REFERENCES dental.organization_billing_accounts(org_id, id)
    ON DELETE RESTRICT,
  CHECK (btrim(provider) <> ''),
  CHECK (jsonb_typeof(plan_features_snapshot_json) = 'object'),
  CHECK (current_period_start IS NULL OR current_period_end IS NULL OR current_period_end >= current_period_start),
  CHECK (trial_start IS NULL OR trial_end IS NULL OR trial_end >= trial_start),
  CHECK (cancelled_at IS NULL OR cancelled_at >= created_at),
  CHECK (ended_at IS NULL OR ended_at >= created_at)
);

CREATE TABLE IF NOT EXISTS dental.billing_events (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id              uuid NOT NULL REFERENCES dental.organizations(id) ON DELETE RESTRICT,
  billing_account_id  uuid,
  subscription_id     uuid,
  provider            text NOT NULL,
  external_event_id   text NOT NULL,
  event_type          text NOT NULL,
  status              text NOT NULL DEFAULT 'received'
                      CHECK (status IN ('received','processed','ignored','failed')),
  occurred_at         timestamptz NOT NULL,
  processed_at        timestamptz,
  payload_json        jsonb NOT NULL,
  error_message       text,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, id),
  UNIQUE (provider, external_event_id),
  FOREIGN KEY (org_id, billing_account_id)
    REFERENCES dental.organization_billing_accounts(org_id, id)
    ON DELETE SET NULL,
  FOREIGN KEY (org_id, subscription_id)
    REFERENCES dental.organization_subscriptions(org_id, id)
    ON DELETE SET NULL,
  CHECK (btrim(provider) <> ''),
  CHECK (btrim(event_type) <> ''),
  CHECK (btrim(external_event_id) <> ''),
  CHECK (jsonb_typeof(payload_json) IN ('object','array','string','number','boolean','null')),
  CHECK (processed_at IS NULL OR processed_at >= occurred_at)
);
