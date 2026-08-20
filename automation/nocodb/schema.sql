-- ============================================================================
-- Fortune U Group — CRM / Data schema (reference DDL)
-- ----------------------------------------------------------------------------
-- Target: Postgres (used by NocoDB). You may also recreate these tables in the
-- NocoDB UI; the column names below are the canonical field names used by the
-- n8n workflows and the Master Agent.
--
-- Conventions:
--   * All tables have `id` (UUID PK), `created_at`, `updated_at`.
--   * Status fields are TEXT + CHECK so they can also be managed via NocoDB
--     "Single Select" columns with the same options.
--   * Append-only tables (Interactions, AutomationLogs) are never overwritten.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- for gen_random_uuid()

-- ---------------------------------------------------------------------------
-- Contacts — normalized person identity (shared across leads), used for dedup
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contacts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT,
    phone           TEXT,                        -- normalized E.164 / +91XXXXXXXXXX
    phone_raw       TEXT,                        -- as entered
    email           TEXT,
    city            TEXT,
    opted_out       BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_contacts_phone ON contacts (phone) WHERE phone IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts (email);

-- ---------------------------------------------------------------------------
-- Leads — canonical lead record
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS leads (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id            TEXT,                     -- human-friendly external id (optional)
    contact_id         UUID REFERENCES contacts(id) ON DELETE SET NULL,
    name               TEXT,
    phone              TEXT,
    email              TEXT,
    city               TEXT,
    source             TEXT,                     -- website, whatsapp, instagram, facebook, youtube, referral
    service            TEXT,                     -- health, term/life, general, sip, other
    message            TEXT,
    status             TEXT NOT NULL DEFAULT 'NEW'
                       CHECK (status IN (
                         'NEW','CONTACTED','INTERESTED','FOLLOW-UP','QUALIFIED',
                         'CONVERTED','NOT_INTERESTED','LOST','HUMAN_HANDOFF')),
    priority           TEXT NOT NULL DEFAULT 'MEDIUM'
                       CHECK (priority IN ('LOW','MEDIUM','HIGH')),
    assigned_to        TEXT,
    whatsapp_status    TEXT DEFAULT 'NOT_SENT'
                       CHECK (whatsapp_status IN ('NOT_SENT','SENT','DELIVERED','READ','REPLIED','OPTED_OUT','FAILED')),
    conversion_status  TEXT DEFAULT 'OPEN'
                       CHECK (conversion_status IN ('OPEN','WON','LOST','PENDING')),
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_contacted_at  TIMESTAMPTZ,
    next_followup_at   TIMESTAMPTZ,
    notes              TEXT
);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads (status);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads (phone);
CREATE INDEX IF NOT EXISTS idx_leads_next_followup ON leads (next_followup_at);

-- ---------------------------------------------------------------------------
-- Interactions — append-only record of every message/call/email
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS interactions (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id       UUID REFERENCES leads(id) ON DELETE CASCADE,
    contact_id    UUID REFERENCES contacts(id) ON DELETE SET NULL,
    channel       TEXT NOT NULL,                -- whatsapp, phone, email, website, social, system
    direction     TEXT NOT NULL CHECK (direction IN ('INBOUND','OUTBOUND','SYSTEM')),
    message       TEXT,
    status        TEXT,                         -- sent / delivered / read / failed
    external_id   TEXT,                         -- e.g. WhatsApp message_id
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_interactions_lead ON interactions (lead_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- FollowUps — scheduled follow-up tasks
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS followups (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id          UUID REFERENCES leads(id) ON DELETE CASCADE,
    template_key     TEXT,                      -- e.g. followup_1, appointment_reminder
    due_at           TIMESTAMPTZ NOT NULL,
    status           TEXT NOT NULL DEFAULT 'PENDING'
                     CHECK (status IN ('PENDING','SENT','SKIPPED','FAILED','CANCELLED')),
    attempts         INTEGER NOT NULL DEFAULT 0,
    last_attempt_at  TIMESTAMPTZ,
    response_received BOOLEAN NOT NULL DEFAULT FALSE,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_followups_due ON followups (due_at) WHERE status = 'PENDING';

-- ---------------------------------------------------------------------------
-- Content — content items across channels
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS content (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform      TEXT NOT NULL CHECK (platform IN ('youtube','instagram','facebook','website','whatsapp','blog')),
    content_type  TEXT,                         -- short, long, reel, post, script, article
    topic         TEXT,
    idea          TEXT,
    draft         TEXT,
    fact_check    TEXT DEFAULT 'NOT_REQUIRED'
                  CHECK (fact_check IN ('NOT_REQUIRED','PASSED','FLAGGED','PENDING')),
    status        TEXT NOT NULL DEFAULT 'DRAFT'
                  CHECK (status IN ('IDEA','DRAFT','APPROVED','SCHEDULED','PUBLISHED','REJECTED')),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- PublishingQueue — items pending/approved for publish
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS publishing_queue (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id   UUID REFERENCES content(id) ON DELETE SET NULL,
    platform     TEXT NOT NULL,
    status       TEXT NOT NULL DEFAULT 'QUEUED'
                 CHECK (status IN ('QUEUED','APPROVED','SCHEDULED','PUBLISHED','FAILED','REJECTED')),
    scheduled_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    attempts     INTEGER NOT NULL DEFAULT 0,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- SocialPosts — published post/reel/video metadata (platform IDs)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS social_posts (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id     UUID REFERENCES content(id) ON DELETE SET NULL,
    platform       TEXT NOT NULL,               -- youtube, instagram, facebook
    platform_post_id TEXT,
    url            TEXT,
    title          TEXT,
    published_at   TIMESTAMPTZ,
    status         TEXT NOT NULL DEFAULT 'PUBLISHED',
    metrics_json   JSONB,                        -- snapshot of platform metrics
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Campaigns — grouping for reporting
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS campaigns (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL,
    description TEXT,
    start_at    TIMESTAMPTZ,
    end_at      TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Tasks — internal to-dos
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tasks (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title       TEXT NOT NULL,
    description TEXT,
    status      TEXT NOT NULL DEFAULT 'OPEN'
                CHECK (status IN ('OPEN','IN_PROGRESS','DONE','CANCELLED')),
    assigned_to TEXT,
    due_at      TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Approvals — the central human approval queue
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS approvals (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type   TEXT NOT NULL,                -- content, publish, bulk_send, settings_change, ...
    entity_id     UUID,
    action        TEXT,                         -- publish, send, delete, change
    payload_json  JSONB,
    status        TEXT NOT NULL DEFAULT 'DRAFT'
                  CHECK (status IN ('DRAFT','AI_REVIEW','HUMAN_REVIEW','APPROVED',
                                    'REJECTED','SCHEDULED','PUBLISHED','FAILED')),
    requested_by  TEXT,
    reviewed_by   TEXT,
    reviewed_at   TIMESTAMPTZ,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_approvals_status ON approvals (status);

-- ---------------------------------------------------------------------------
-- AutomationLogs — observability (every important automation logs here)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS automation_logs (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_name TEXT,
    execution_id  TEXT,
    timestamp     TIMESTAMPTZ NOT NULL DEFAULT now(),
    event_type    TEXT,
    lead_id       TEXT,
    status        TEXT,                         -- STARTED, SUCCESS, FAILED, RETRY, BLOCKED
    error_message TEXT,
    retry_count   INTEGER NOT NULL DEFAULT 0,
    duration_ms   INTEGER,
    result        JSONB
);
CREATE INDEX IF NOT EXISTS idx_autologs_workflow ON automation_logs (workflow_name, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_autologs_status ON automation_logs (status);

-- ---------------------------------------------------------------------------
-- Errors — error register with classification + retry policy
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS errors (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_name TEXT,
    execution_id  TEXT,
    error_code    TEXT,
    message       TEXT,
    classification TEXT DEFAULT 'UNKNOWN'
                  CHECK (classification IN ('TRANSIENT','PERMANENT','CREDENTIAL','DATA','POLICY','UNKNOWN')),
    retry_safe    BOOLEAN NOT NULL DEFAULT FALSE,
    retry_count   INTEGER NOT NULL DEFAULT 0,
    resolved      BOOLEAN NOT NULL DEFAULT FALSE,
    notified      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Settings — key/value configuration (AUTO_PUBLISH, intervals, rate limits)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS settings (
    key         TEXT PRIMARY KEY,
    value       JSONB,
    description TEXT,
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed default settings (safe defaults; AUTO_PUBLISH is OFF)
INSERT INTO settings (key, value, description) VALUES
  ('AUTO_PUBLISH',          'false', 'Allow automated publishing without human approval'),
  ('FOLLOWUP_INTERVAL_HOURS', '24', 'Default delay before first follow-up'),
  ('FOLLOWUP_MAX_ATTEMPTS',   '3',  'Max follow-up attempts per lead'),
  ('WA_RATE_LIMIT_PER_HOUR',  '50', 'Max outbound WhatsApp messages per hour'),
  ('LLM_MODEL',              '"gemini"', 'Default LLM provider/model')
ON CONFLICT (key) DO NOTHING;
