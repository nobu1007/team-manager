-- Team Manager 用 profiles テーブル作成とRLSポリシー
-- Supabase SQL エディタで実行してください（対象プロジェクト: team-manager で使っている URL/anon key のプロジェクト）

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  approved boolean not null default false,
  is_admin boolean not null default false,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

-- 自分自身のプロフィールは閲覧可能
drop policy if exists "Users can view own profile" on profiles;
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

-- 自分自身のプロフィールのみ作成可能（クライアント挿入の保険）
drop policy if exists "Users can insert own profile" on profiles;
create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- RLS 内で再帰が発生しないように管理者判定用の security definer 関数を利用
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select
    exists(
      select 1
      from public.profiles
      where id = auth.uid()
        and is_admin = true
    )
    or coalesce(auth.jwt() ->> 'email', '') = 'monsters.sawasuke@gmail.com';
$$;

-- 管理者（profiles.is_admin=true）は全件閲覧・更新可能
drop policy if exists "Admins can view all profiles" on profiles;
create policy "Admins can view all profiles"
  on profiles for select
  using (public.is_admin());

drop policy if exists "Admins can approve profiles" on profiles;
create policy "Admins can approve profiles"
  on profiles for update
  using (public.is_admin());

-- 必要に応じて管理者ユーザーを作成/付与（メールアドレスは変更してください）
-- insert into profiles (id, email, approved, is_admin)
-- select id, email, true, true
-- from auth.users
-- where email = 'monsters.sawasuke@gmail.com'
-- on conflict (id) do update
--   set approved = true, is_admin = true, email = excluded.email;

-- デフォルト管理者（monsters.sawasuke@gmail.com）の権限を自動付与
insert into public.profiles (id, email, approved, is_admin)
select id, email, true, true
from auth.users
where email = 'monsters.sawasuke@gmail.com'
on conflict (id) do update
  set approved = true,
      is_admin = true,
      email = excluded.email;

-- 新規ユーザー作成時に profiles を自動作成するトリガー
drop trigger if exists on_auth_user_created_profiles on auth.users;
drop function if exists create_profile_for_new_user;
create or replace function create_profile_for_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, approved, is_admin)
  values (new.id, new.email, false, false)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created_profiles
after insert on auth.users
for each row execute procedure create_profile_for_new_user();


