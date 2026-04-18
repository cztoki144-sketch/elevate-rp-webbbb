create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  discord_user_id text unique,
  discord_username text,
  discord_avatar_url text,
  wl_status text not null default 'none' check (wl_status in ('none', 'pending', 'approved', 'denied')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.wl_applications (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null references auth.users(id) on delete cascade,
  discord_user_id text,
  discord_username text,
  steam_profile_url text not null,
  age text not null,
  rp_hours text not null,
  answer_rp text not null,
  answer_ooc_ic text not null,
  answer_me_do text not null,
  answer_ck text not null,
  answer_kos text not null,
  answer_loot text not null,
  scenario_airport text not null,
  scenario_bank_escape text not null,
  source_found text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'denied')),
  reviewer_discord_id text,
  review_note text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;
alter table public.wl_applications enable row level security;

create policy "users_select_own" on public.users
for select using (auth.uid() = auth_user_id);

create policy "users_insert_own" on public.users
for insert with check (auth.uid() = auth_user_id);

create policy "users_update_own" on public.users
for update using (auth.uid() = auth_user_id);

create policy "wl_select_own" on public.wl_applications
for select using (auth.uid() = auth_user_id);

create policy "wl_insert_own" on public.wl_applications
for insert with check (auth.uid() = auth_user_id);
