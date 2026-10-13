-- FEEL Rollout HUB: shared state, accessible only to authenticated users.
-- Run in Supabase SQL Editor. Invite authorized users in Authentication > Users.
create table if not exists public.feel_hub_state (
  id text primary key default 'global' check (id = 'global'),
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);
alter table public.feel_hub_state enable row level security;
revoke all on public.feel_hub_state from anon;
grant select, insert, update on public.feel_hub_state to authenticated;
drop policy if exists "Authenticated team can read FEEL state" on public.feel_hub_state;
create policy "Authenticated team can read FEEL state" on public.feel_hub_state
for select to authenticated using (true);
drop policy if exists "Authenticated team can insert FEEL state" on public.feel_hub_state;
create policy "Authenticated team can insert FEEL state" on public.feel_hub_state
for insert to authenticated with check (id = 'global' and updated_by = auth.uid());
drop policy if exists "Authenticated team can update FEEL state" on public.feel_hub_state;
create policy "Authenticated team can update FEEL state" on public.feel_hub_state
for update to authenticated using (true)
with check (id = 'global' and updated_by = auth.uid());
-- The app will read/write one shared JSON document in the pilot.
-- Concurrent writes to separate fields are not yet conflict-safe; use a normalized schema before broad rollout.
