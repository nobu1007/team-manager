-- 管理者プロフィールを完全に再作成してログイン不可を解消する SQL
-- Supabase SQL Editor で team-manager 用プロジェクトに接続して実行してください。

begin;

-- 該当プロファイルを一旦削除（外部キー制約で auth.users は残ります）
delete from public.profiles
where email = 'monsters.sawasuke@gmail.com';

-- auth.users から再作成し、approved/is_admin を強制 true
insert into public.profiles (id, email, approved, is_admin, created_at)
select
  u.id,
  u.email,
  true,
  true,
  coalesce(u.created_at, now())
from auth.users u
where u.email = 'monsters.sawasuke@gmail.com';

commit;

-- 実行後確認
-- select id, email, approved, is_admin from public.profiles where email = 'monsters.sawasuke@gmail.com';





