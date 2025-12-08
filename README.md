# Team Manager（チーム管理）

このフォルダには、ブラウザだけで動作する簡易なチーム管理アプリ（フロントエンドのみ）が含まれます。データは既定では `localStorage` に保存されますが、Supabase を設定するとオンラインで共有・保存できます。

## 使い方

1. `index.html` をブラウザで開きます（ダブルクリックでOK）。
2. 上部ナビから「ダッシュボード / チーム / ロール / 設定」に移動できます。
3. 初回起動時に、サンプルデータが自動作成されます。
4. 追加・編集・削除すると、その内容はブラウザの `localStorage` に保存されます。

## 機能

- チーム一覧の表示と追加・削除
- チーム詳細（メンバー一覧、メンバー追加・削除、ロール割り当て）
- ロールの追加・削除
- ライト/ダークテーマ切り替え（設定）

## 注意

- 本アプリは学習・プロトタイプ用途です。
- Supabase を有効化しない場合、別ブラウザ/別PCではデータは共有されません。

## Supabase を使う（任意）

1) Supabase プロジェクトを作成  
   - Supabase コンソールで新規プロジェクトを作成し、Region/Password を設定。

2) テーブルを作成  
   - コンソールの SQL Editor で `supabase_setup.sql`（メンバー表＋写真/スライダー用バケット＋RLS）や `profiles_setup.sql`（承認ユーザー管理）を順に実行します。
   - これで `members` テーブルに加えて `member-photos` / `slider-media` バケットが作成され、顔写真やスライダー画像をアップロードできるようになります。
   - まずは RLS 無効（デフォルト）で PoC 動作を確認し、後から RLS を設計するのが簡単です。

3) API キーと URL を設定  
   - プロジェクトの Settings → API で `Project URL` と `anon public` キーを取得。
   - `team-manager/supabase-config.js` に貼り付けます。
     ```js
     export const SUPABASE_URL = "https://xxxxx.supabase.co";
     export const SUPABASE_ANON_KEY = "ey...";
     ```

4) 動作確認  
   - `index.html` を開くと、`app.js` が Supabase を自動検出して、クラウド保存に切り替わります（未設定時は localStorage を使用）。

### 認証と RLS（本番向け）

- 本番運用では必ず RLS を有効化して、誰がどの行にアクセスできるかを制御してください。
- `supabase/schema.sql` の下部にテンプレート例（コメント）があるので参照してください。
- 認証（メールマジックリンクや OAuth）を使うと `auth.uid()` を用いた厳密なポリシーが書けます。

### 実装メモ

- `app.js` は Supabase が設定されていれば `members` テーブルを自動で利用し、未設定ならローカルストレージにフォールバックします。
- `member-profile.html` も Supabase 経由でメンバー情報を取得し、顔写真・年齢・所属・意気込みを共有表示します。




