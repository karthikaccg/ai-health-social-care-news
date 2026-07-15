-- Email subscribers for the CareZeno news-digest notifications.
-- Accessed only by Edge Functions using the service-role key, so RLS is
-- enabled with no policies (all client access goes through subscribe /
-- unsubscribe functions, never straight to the table).

create extension if not exists pgcrypto;

create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  unsubscribe_token uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now()
);

alter table public.subscribers enable row level security;

create index if not exists subscribers_unsubscribe_token_idx
  on public.subscribers (unsubscribe_token);

-- Tracks which article links have already been emailed out, so the notify
-- function stays idempotent even if the GitHub Action re-runs or resends
-- overlapping windows of articles.
create table if not exists public.sent_articles (
  link text primary key,
  sent_at timestamptz not null default now()
);

alter table public.sent_articles enable row level security;

-- Housekeeping: sent_articles only needs to cover the lookback window the
-- notify function is called with (24h), so old rows can be pruned safely.
create index if not exists sent_articles_sent_at_idx
  on public.sent_articles (sent_at);
