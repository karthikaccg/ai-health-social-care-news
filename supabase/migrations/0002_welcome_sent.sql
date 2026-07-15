-- A `welcome_sent` column already exists on this project's live subscribers
-- table (from an earlier setup attempt, before this migration set existed —
-- 0001's `create table if not exists` silently skipped since the table was
-- already there). Adding it here too, idempotently, so a fresh database
-- created purely from these migrations ends up with the same shape, and so
-- the subscribe function can rely on the column always being present.
alter table public.subscribers
  add column if not exists welcome_sent boolean not null default false;
