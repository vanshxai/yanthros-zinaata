-- Run this once in the Supabase project's SQL editor before the backend
-- can store anything. One row per scan; the 28 (or fewer, on older/other
-- devices) field readings live together in `fields` as JSON rather than
-- as separate columns, since the field set can grow without a migration.

create table if not exists scans (
  id uuid primary key default gen_random_uuid(),
  platform text not null default 'android', -- 'android' | 'windows' -- lets one database serve both apps
  device_model text not null,
  device_id text,
  scanned_at timestamptz not null default now(),
  fields jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists scans_device_model_idx on scans (device_model);
create index if not exists scans_scanned_at_idx on scans (scanned_at desc);
create index if not exists scans_platform_idx on scans (platform);

-- Processed diagnostic output. Nothing in this repo writes this table --
-- it's written by whatever runs brain.py against a device's scans,
-- external to both the app and this backend. The backend only exposes it
-- read-only via GET /api/results so the Admin panel's "Download Dataset"
-- button has something to fetch once that processing has run.
create table if not exists results (
  id uuid primary key default gen_random_uuid(),
  platform text not null default 'android',
  device_id text not null,
  device_model text,
  computed_at timestamptz not null default now(),
  output jsonb not null
);

create index if not exists results_device_id_idx on results (device_id);
create index if not exists results_computed_at_idx on results (computed_at desc);
create index if not exists results_platform_idx on results (platform);

-- One row per repair-feedback submission. Attached files/audio/video are
-- uploaded to Supabase Storage (bucket "repair-feedback", create this
-- once in the dashboard's Storage tab -- the API can't create buckets
-- itself); this table stores the notes plus the storage paths, not the
-- binary data.
create table if not exists repair_feedback (
  id uuid primary key default gen_random_uuid(),
  platform text not null default 'android',
  notes text,
  owner_name text,
  owner_phone text,
  owner_location text,
  engineer_name text,
  file_paths jsonb not null default '[]'::jsonb,
  audio_path text,
  video_path text,
  submitted_at timestamptz not null default now()
);

create index if not exists repair_feedback_submitted_at_idx on repair_feedback (submitted_at desc);
create index if not exists repair_feedback_platform_idx on repair_feedback (platform);

-- RLS: enabled with no policies yet, so only the service_role key (used
-- by the backend, never the phone directly) can read/write. Add a
-- policy here later if the app ever needs to talk to Supabase directly
-- with the anon key instead of going through the backend.
alter table scans enable row level security;
alter table results enable row level security;
alter table repair_feedback enable row level security;
