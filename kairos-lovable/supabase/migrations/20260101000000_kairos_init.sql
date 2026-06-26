-- ════════════════════════════════════════════════════════════════════
--  KAIROS — schéma Supabase (version Lovable)
--  Tables, RLS et Realtime. Idempotent.
-- ════════════════════════════════════════════════════════════════════

create extension if not exists pgcrypto;

create table if not exists public.kairos_clients (
  id          uuid primary key default gen_random_uuid(),
  client_id   text unique not null,
  nom         text not null,
  url         text not null,
  objectif    text,
  secteur     text,
  email       text,
  actif       boolean not null default true,
  concurrents jsonb not null default '[]'::jsonb,
  created_at  timestamptz not null default now()
);

create table if not exists public.kairos_events (
  id          uuid primary key default gen_random_uuid(),
  client_id   text not null,
  session_id  text,
  type        text not null,
  page        text,
  data        jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);
create index if not exists kairos_events_client_idx  on public.kairos_events (client_id, created_at desc);
create index if not exists kairos_events_session_idx on public.kairos_events (session_id);

create table if not exists public.kairos_rapports (
  id          uuid primary key default gen_random_uuid(),
  client_id   text not null,
  observation text,
  analyse     text,
  rapport     text,
  score       int,
  created_at  timestamptz not null default now()
);
create index if not exists kairos_rapports_client_idx on public.kairos_rapports (client_id, created_at desc);

create table if not exists public.kairos_concurrents (
  id         uuid primary key default gen_random_uuid(),
  client_id  text not null,
  urls       jsonb not null default '[]'::jsonb,
  resultat   text,
  created_at timestamptz not null default now()
);
create index if not exists kairos_concurrents_client_idx on public.kairos_concurrents (client_id, created_at desc);

create table if not exists public.kairos_messages (
  id         uuid primary key default gen_random_uuid(),
  client_id  text not null,
  role       text not null,
  content    text not null,
  created_at timestamptz not null default now()
);
create index if not exists kairos_messages_client_idx on public.kairos_messages (client_id, created_at asc);

-- ─── RLS ──────────────────────────────────────────────────────────────
-- Toutes les écritures passent par les Edge Functions (service_role, qui
-- contourne RLS). On n'ouvre en lecture anon que les events, pour le temps
-- réel de l'onglet LIVE.
alter table public.kairos_clients     enable row level security;
alter table public.kairos_events      enable row level security;
alter table public.kairos_rapports    enable row level security;
alter table public.kairos_concurrents enable row level security;
alter table public.kairos_messages    enable row level security;

drop policy if exists "anon read events" on public.kairos_events;
create policy "anon read events" on public.kairos_events
  for select to anon using (true);

-- ─── Realtime ─────────────────────────────────────────────────────────
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'kairos_events'
  ) then
    alter publication supabase_realtime add table public.kairos_events;
  end if;
end $$;
