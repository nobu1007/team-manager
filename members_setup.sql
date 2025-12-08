-- Supabase でメンバー情報を管理するテーブル作成スクリプト
-- SQL Editor で実行してください。

create extension if not exists "pgcrypto";

create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  team text,
  contact text,
  age integer,
  affiliation text,
  motivation text,
  photo text,
  photo_alt text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_members_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists members_set_updated_at on public.members;
create trigger members_set_updated_at
before update on public.members
for each row
execute procedure public.set_members_updated_at();

-- 必要に応じて RLS ポリシーを追加してください。例:
-- alter table public.members enable row level security;
-- create policy "Approved users can read members"
--   on public.members for select
--   using (exists (
--     select 1 from public.profiles p
--     where p.id = auth.uid()
--       and p.approved = true
--   ));
-- create policy "Admins manage members"
--   on public.members for all
--   using (public.is_admin())
--   with check (public.is_admin());

