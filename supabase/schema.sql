-- Sourcing Eleven — Supabase schema
-- Run in the Supabase SQL editor (or `supabase db push`) before setting
-- SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY on the server.

create table if not exists public.records (
  collection text not null,
  id text not null,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (collection, id)
);

create index if not exists records_collection_idx on public.records (collection);
create index if not exists records_created_idx on public.records (collection, created_at desc);

-- Row Level Security on, with NO policies: the anon and authenticated roles
-- cannot read or write anything. All access goes through the Next.js server
-- using the service-role key, which bypasses RLS and is never sent to browsers.
alter table public.records enable row level security;

-- Storage buckets. Both private: attachments are served through the
-- authenticated admin route; media is proxied publicly by /media/[...key].
insert into storage.buckets (id, name, public)
values ('enquiry-attachments', 'enquiry-attachments', false), ('media', 'media', false)
on conflict (id) do nothing;
