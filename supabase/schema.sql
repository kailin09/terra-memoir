-- Per-user travel collection storage. Run once in the Supabase SQL Editor.
create table if not exists public.travel_collections (
  user_id uuid primary key references auth.users (id) on delete cascade,
  collection jsonb not null default '{"places":[],"trips":[],"entries":[],"expenses":[]}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.travel_collections enable row level security;

drop policy if exists "Users can read their own travel collection" on public.travel_collections;
create policy "Users can read their own travel collection"
  on public.travel_collections for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert their own travel collection" on public.travel_collections;
create policy "Users can insert their own travel collection"
  on public.travel_collections for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own travel collection" on public.travel_collections;
create policy "Users can update their own travel collection"
  on public.travel_collections for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

grant select, insert, update on public.travel_collections to authenticated;
