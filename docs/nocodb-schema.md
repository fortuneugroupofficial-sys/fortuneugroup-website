# NocoDB Schema — Fortune U Group CRM

NocoDB is the central lead/CRM database. This is the **target schema** to create once a NocoDB instance + API token are provided. Until then, this document is the authoritative spec.

## Table 1: `Leads` (central CRM)

| Column | Type | Notes |
|--------|------|-------|
| `Id` | ID (auto) | NocoDB row id |
| `LeadId` | SingleLineText (unique) | UUID assigned at ingest |
| `DedupeKey` | SingleLineText | normalized mobile (E.164); used for de-dupe |
| `Name` | SingleLineText | |
| `Mobile` | PhoneNumber | E.164 `91XXXXXXXXXX` |
| `Email` | Email | optional |
| `City` | SingleLineText | default "Tirupati" |
| `Source` | SingleSelect | website, instagram, facebook, youtube, whatsapp, referral, manual |
| `Type` | SingleSelect | consultation, insurance, sip, ai-chat, contact |
| `FinancialGoal` | SingleLineText | |
| `Message` | LongText | |
| `Status` | SingleSelect | new, contacted, qualified, in-progress, converted, lost, opted-out, duplicate |
| `Priority` | SingleSelect | high, medium, low |
| `AssignedTo` | SingleLineText | owner/advisor |
| `FollowUpDate` | Date | next follow-up |
| `Notes` | LongText | |
| `Outcome` | LongText | |
| `OptedOut` | Checkbox | if true, never contact |
| `CreatedAt` | DateTime | auto |
| `UpdatedAt` | DateTime | auto |

**Rules**
- `DedupeKey` = `mobile` normalized to digits; for India strip leading `0`, prefix `91`.
- One active lead per `DedupeKey`. New submissions update the existing lead (append to `Notes`) instead of creating duplicates.

## Table 2: `ContentPosts` (content calendar + publishing)

| Column | Type | Notes |
|--------|------|-------|
| `Id` | ID (auto) | |
| `PostId` | SingleLineText (unique) | UUID |
| `Platform` | SingleSelect | youtube, instagram, facebook |
| `ContentType` | SingleSelect | short, reel, post, video |
| `Title` | SingleLineText | |
| `Caption` | LongText | |
| `Description` | LongText | |
| `Hashtags` | LongText | |
| `Language` | SingleSelect | en, te |
| `ScheduledDate` | DateTime | |
| `Status` | SingleSelect | draft, approved, scheduled, published, failed |
| `PublishUrl` | URL | set after successful publish |
| `ErrorLog` | LongText | |
| `CreatedAt` / `UpdatedAt` | DateTime | |

**Rules**
- `Status` must be `approved` (and past the approval gate) before any publish workflow runs.

## Table 3: `Conversations` (WhatsApp / chat)

| Column | Type | Notes |
|--------|------|-------|
| `Id` | ID (auto) | |
| `LeadId` | Link to `Leads` | |
| `Platform` | SingleSelect | whatsapp, ai-chat |
| `ThreadId` | SingleLineText | platform conversation id |
| `LastMessageAt` | DateTime | |
| `Status` | SingleSelect | open, awaiting-reply, closed, opted-out |
| `OptedOut` | Checkbox | |

## Table 4: `WorkflowRuns` (logging / monitoring)

| Column | Type | Notes |
|--------|------|-------|
| `Id` | ID (auto) | |
| `RunId` | SingleLineText (unique) | UUID per execution |
| `WorkflowName` | SingleLineText | |
| `Status` | SingleSelect | success, failed, skipped |
| `InputHash` | SingleLineText | idempotency key (hash of payload) |
| `StartedAt` / `FinishedAt` | DateTime | |
| `ErrorMessage` | LongText | |

**Rules**
- `InputHash` prevents double-processing the same event (restart-safety).

## Provisioning (blocked on credentials)

To stand this up, I need from you:

1. A NocoDB instance URL (e.g. `https://<project>.nocodb.com` or self-hosted URL).
2. A NocoDB API token (Base-level, with read/write).
3. Confirmation I may create the 4 tables above (or existing table names to reuse instead).

Once provided, I will create the tables and wire the n8n ingest workflow to them.
