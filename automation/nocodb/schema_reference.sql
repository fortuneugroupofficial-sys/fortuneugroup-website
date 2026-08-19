-- Reference DDL for the Fortune U Group CRM (MySQL/PostgreSQL-compatible sketch).
-- NocoDB is the primary management layer; this SQL documents the intended tables
-- and columns so any MySQL/Postgres DB can back the same schema.
-- Column names match the Python models in automation/fug.

CREATE DATABASE IF NOT EXISTS fug_crm;

USE fug_crm;

CREATE TABLE Leads (
  lead_id           VARCHAR(32) PRIMARY KEY,
  name              VARCHAR(200),
  phone             VARCHAR(20),
  email             VARCHAR(200),
  city              VARCHAR(120),
  source            VARCHAR(40),
  service           VARCHAR(60),
  message           TEXT,
  status            VARCHAR(30) DEFAULT 'NEW',
  priority          VARCHAR(12) DEFAULT 'MEDIUM',
  assigned_to       VARCHAR(120),
  created_at        BIGINT,
  updated_at        BIGINT,
  last_contacted_at BIGINT,
  next_followup_at  BIGINT,
  notes             TEXT,
  whatsapp_status   VARCHAR(40) DEFAULT 'NONE',
  conversion_status VARCHAR(40),
  followup_count    INT DEFAULT 0,
  opted_out         BOOLEAN DEFAULT FALSE,
  dedup_key         VARCHAR(120),
  human_handoff     VARCHAR(40)
);

CREATE TABLE Contacts (
  contact_id VARCHAR(32) PRIMARY KEY,
  name       VARCHAR(200),
  phone      VARCHAR(20),
  email      VARCHAR(200),
  city       VARCHAR(120),
  created_at BIGINT,
  notes      TEXT
);

CREATE TABLE Interactions (
  interaction_id VARCHAR(32) PRIMARY KEY,
  lead_id        VARCHAR(32),
  type           VARCHAR(20),
  direction      VARCHAR(12),
  template       VARCHAR(60),
  detail         TEXT,
  timestamp      BIGINT
);

CREATE TABLE FollowUps (
  followup_id   VARCHAR(32) PRIMARY KEY,
  lead_id       VARCHAR(32),
  step          INT,
  scheduled_at  BIGINT,
  sent_at       BIGINT,
  template      VARCHAR(60),
  status        VARCHAR(20) DEFAULT 'PENDING'
);

CREATE TABLE Content (
  content_id         VARCHAR(32) PRIMARY KEY,
  platform           VARCHAR(20),
  topic              VARCHAR(255),
  hook               TEXT,
  title              VARCHAR(255),
  caption            TEXT,
  description        TEXT,
  hashtags           TEXT,
  cta                VARCHAR(255),
  thumbnail_concept  TEXT,
  claim_flags        TEXT,
  needs_human_review BOOLEAN DEFAULT FALSE,
  status             VARCHAR(20) DEFAULT 'DRAFT'
);

CREATE TABLE PublishingQueue (
  pipeline_id VARCHAR(32) PRIMARY KEY,
  platform    VARCHAR(20),
  topic       VARCHAR(255),
  stage       VARCHAR(30),
  status      VARCHAR(30),
  note        TEXT
);

CREATE TABLE SocialPosts (
  post_id         VARCHAR(32) PRIMARY KEY,
  platform        VARCHAR(20),
  package_ref     VARCHAR(255),
  metadata        TEXT,
  external_ref    VARCHAR(255),
  publish_status  VARCHAR(30),
  created_at      BIGINT
);

CREATE TABLE Campaigns (
  campaign_id VARCHAR(32) PRIMARY KEY,
  name        VARCHAR(200),
  objective   VARCHAR(200),
  status      VARCHAR(30),
  start_at    BIGINT,
  end_at      BIGINT
);

CREATE TABLE Tasks (
  task_id    VARCHAR(32) PRIMARY KEY,
  type       VARCHAR(30),
  ref        VARCHAR(120),
  detail     TEXT,
  status     VARCHAR(20) DEFAULT 'OPEN',
  created_at BIGINT
);

CREATE TABLE Approvals (
  approval_id    VARCHAR(32) PRIMARY KEY,
  item_type      VARCHAR(40),
  item_ref       VARCHAR(255),
  summary        TEXT,
  payload        TEXT,
  state          VARCHAR(20) DEFAULT 'DRAFT',
  requires_human BOOLEAN DEFAULT TRUE,
  created_at     BIGINT,
  decided_at     BIGINT,
  decided_by     VARCHAR(120),
  decision       VARCHAR(30)
);

CREATE TABLE AutomationLogs (
  log_id         VARCHAR(32) PRIMARY KEY,
  workflow_name  VARCHAR(120),
  execution_id   VARCHAR(32),
  timestamp      BIGINT,
  event_type     VARCHAR(40),
  lead_id        VARCHAR(32),
  status         VARCHAR(30),
  error_message  TEXT,
  retry_count    INT,
  duration       FLOAT,
  result         TEXT
);

CREATE TABLE Errors (
  error_id       VARCHAR(32) PRIMARY KEY,
  workflow_name  VARCHAR(120),
  lead_id        VARCHAR(32),
  timestamp      BIGINT,
  error_message  TEXT,
  trace          TEXT,
  retry_count    INT DEFAULT 0,
  resolved       BOOLEAN DEFAULT FALSE,
  resolved_at    BIGINT
);

CREATE TABLE Settings (
  `key`       VARCHAR(80) PRIMARY KEY,
  value       TEXT,
  updated_at  BIGINT
);
