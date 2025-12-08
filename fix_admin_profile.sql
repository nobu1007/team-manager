-- 管理者ログイン不可（profiles.id と auth.users.id の不一致）を修正する SQL
-- Supabase SQL Editor で「team-manager」プロジェクトに接続して実行してください。
-- 手順:
--   1. そのまま実行すると、全 auth.users に対応する profiles レコードを作成/同期します。
--   2. monsters.sawasuke@gmail.com のプロフィールを強制的に approved/is_admin=TRUE にします。
--   3. 実行後、確認クエリで is_admin/approved が TRUE になっているか確認してください。

begin;

-- auth.users と email を突き合わせて profiles.id を正しい値に同期
insert into public.profiles (id, email, approved, is_admin)
select
  u.id,
  u.email,
  false,
  false
from auth.users u
on conflict (email) do update
  set id = excluded.id;

-- 管理者アカウントを強制承認 & 管理者権限付与
update public.profiles
set
  approved = true,
  is_admin = true
where email = 'monsters.sawasuke@gmail.com';

commit;

-- 確認用（必要に応じて実行してください）
-- select id, email, approved, is_admin from public.profiles where email = 'monsters.sawasuke@gmail.com';






