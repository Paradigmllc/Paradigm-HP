# Paradigm HP — Claude Code プロジェクトコンテキスト

## 運営主体
- 法人: Paradigm合同会社
- HP: paradigmjp.com
- ドメイン管理: ラッコドメイン → Cloudflare DNS
- サーバー: DigitalOcean（Coolifyセルフホスト）— appexx.meと同一サーバー
- IP: 139.59.250.5

---

## 技術スタック

| レイヤー | 使用ツール |
|---|---|
| フレームワーク | Next.js 15（App Router）+ TypeScript + Tailwind CSS v4 |
| フォント | Noto Sans JP (300-800ウェイト、Google Fonts) |
| アニメーション | framer-motion |
| アイコン | lucide-react |
| UI | shadcn/ui互換 + Radix UI + Sonner (Toast) |
| フォーム | React Hook Form + Zod |
| 状態管理 | TanStack Query + Zustand |
| CMS | カスタム管理ダッシュボード（/admin） |
| データベース | Supabase（appexxと同一プロジェクト yihdmgtxiqfdgdueolub） |
| ホスト | Coolify（同一サーバー: 139.59.250.5） |
| DNS | Cloudflare |
| CI/CD | Coolify Webhook（git push → 自動デプロイ） |

---

## インフラ（appexx.meと共有）

| リソース | 接続方法 |
|---|---|
| Supabase | 同一プロジェクト（yihdmgtxiqfdgdueolub）— cms_* テーブルで分離 |
| 認証 | Authentik（authentik.appexx.me）— 必要に応じてOIDCアプリ追加 |
| LLM | https://appexx.me/api/studio/llm 経由 |
| Slack通知 | https://appexx.me/api/studio/notify 経由 |
| メール | Resend or SMTP（appexxと共有可能） |
| CRM | Twenty CRM（crm.appexx.me） |
| フォーム | Formbricks（forms.appexx.me） |
| アナリティクス | Umami（analytics.appexx.me） |
| Ghost | ghost.appexx.me（ブログ記事共有可能） |

---

## Coolify

- UUID: `i12am4vvcbggefnqdizhnv9a`
- ドメイン: `https://paradigmjp.com`, `https://www.paradigmjp.com`
- ポート: 3000
- デプロイコマンド: `curl -H "Authorization: Bearer {COOLIFY_TOKEN}" "https://coolify.appexx.me/api/v1/deploy?uuid=i12am4vvcbggefnqdizhnv9a&force=true"`

## Cloudflare

- Zone ID: `f191afabddabaf1658ebfe79a9a9b723`
- Aレコード: paradigmjp.com → 139.59.250.5（Proxied）

---

## 環境変数（Coolify設定）

```
# Supabase（appexxと同一）
NEXT_PUBLIC_SUPABASE_URL=https://yihdmgtxiqfdgdueolub.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=(Coolify appexx-dashboardから参照)
SUPABASE_SERVICE_ROLE_KEY=(Coolify appexx-dashboardから参照)

# サイト
NEXT_PUBLIC_SITE_URL=https://paradigmjp.com
NEXT_PUBLIC_COMPANY_NAME=Paradigm合同会社

# 管理画面認証
ADMIN_PASSWORD=paradigm-admin-2025

# アナリティクス
NEXT_PUBLIC_UMAMI_WEBSITE_ID=(Umamiで新サイト追加後に設定)
```

---

## ページ構成（実装済み）

```
paradigmjp.com/
├── /                  ← トップページ（ヒーロー+サービス概要+実績プレビュー+選ばれる理由+CTA）
├── /about             ← 会社概要（ミッション/価値観3つ/基本情報テーブル）
├── /services          ← サービス一覧（4サービス交互レイアウト）
│   ├── /services/web  ← Web制作（詳細+特徴+料金3プラン+CTA）
│   ├── /services/meo  ← MEO対策（詳細+対策の流れ4ステップ+料金+CTA）
│   ├── /services/seo  ← SEO/GEO対策（SEO vs GEO比較+料金+CTA）
│   └── /services/ai   ← AI導入支援（導入事例4件+料金+CTA）
├── /pricing           ← 料金一覧（4カテゴリ×3プラン+料金補足Q&A）
├── /faq               ← よくある質問（10問のアコーディオンUI）
├── /works             ← 制作実績（6件のケーススタディ+メトリクス+タグ）
├── /contact           ← お問い合わせ（フォーム+API送信+サイドバー+Cal.comリンク）
├── /blog              ← ブログ一覧（カテゴリ/タグ/読了時間表示）
│   └── /blog/[slug]   ← ブログ記事（Markdownレンダリング+BlogPosting JSON-LD）
├── /lp/web            ← Web制作LP（ペインポイント+ソリューション+料金+CTA）
├── /lp/meo            ← MEO対策LP（数値実績+対象業種+CTA）
├── /lp/seo            ← SEO/GEO対策LP（SEO vs GEO比較+CTA）
├── /lp/ai             ← AI導入支援LP（インパクト数値+FAQ+CTA）
├── /privacy           ← プライバシーポリシー（9条）
├── /legal             ← 特定商取引法に基づく表記
├── /admin             ← 管理ダッシュボード（認証付き）
│   ├── /admin/posts   ← ブログ管理（CRUD+Markdownエディタ）
│   ├── /admin/services ← サービス管理
│   ├── /admin/pricing ← 料金管理
│   ├── /admin/faqs    ← FAQ管理（D&D並替え）
│   ├── /admin/works   ← 実績管理
│   ├── /admin/leads   ← リード管理（問い合わせ一覧）
│   └── /admin/settings ← サイト設定
└── /api/
    ├── /api/contact    ← お問い合わせ（Slack通知+Supabaseリード保存）
    └── /api/admin/*    ← 管理API（CRUD）
```

---

## フォルダ構成

```
paradigmjpcom/
├── CLAUDE.md
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── .gitignore
├── src/
│   ├── app/
│   │   ├── globals.css          ← Tailwind v4 @themeブロック（primary/accent/surface色定義）
│   │   ├── layout.tsx           ← ルートレイアウト（Header/Footer/メタデータ/OGP）
│   │   ├── page.tsx             ← ホームページ
│   │   ├── about/page.tsx
│   │   ├── contact/
│   │   │   ├── page.tsx
│   │   │   └── ContactForm.tsx  ← クライアントコンポーネント
│   │   ├── faq/page.tsx
│   │   ├── legal/page.tsx
│   │   ├── pricing/page.tsx
│   │   ├── privacy/page.tsx
│   │   ├── works/page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx         ← ブログ一覧
│   │   │   └── [slug]/page.tsx  ← ブログ記事（SSG）
│   │   ├── lp/
│   │   │   ├── web/page.tsx
│   │   │   ├── meo/page.tsx
│   │   │   ├── seo/page.tsx
│   │   │   └── ai/page.tsx
│   │   ├── admin/               ← 管理ダッシュボード
│   │   │   ├── layout.tsx       ← 管理画面レイアウト（サイドバー+認証）
│   │   │   ├── page.tsx         ← ダッシュボード概要
│   │   │   ├── posts/page.tsx   ← ブログ管理
│   │   │   ├── services/page.tsx
│   │   │   ├── pricing/page.tsx
│   │   │   ├── faqs/page.tsx
│   │   │   ├── works/page.tsx
│   │   │   ├── leads/page.tsx   ← 問い合わせ一覧
│   │   │   └── settings/page.tsx
│   │   ├── api/
│   │   │   ├── contact/route.ts
│   │   │   └── admin/route.ts   ← 管理CRUD API
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   ├── opengraph-image.tsx
│   │   └── services/
│   │       ├── page.tsx
│   │       ├── web/page.tsx
│   │       ├── meo/page.tsx
│   │       ├── seo/page.tsx
│   │       └── ai/page.tsx
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── ui/                  ← shadcn/ui互換
│   └── lib/
│       ├── data.ts              ← コンテンツデータ（フォールバック用、DB優先）
│       ├── blog.ts              ← ブログ記事データ（フォールバック用）
│       ├── jsonld.ts            ← JSON-LD構造化データ
│       └── supabase.ts          ← Supabase接続ヘルパー
└── public/
```

---

## データ構造

### Supabase CMSテーブル（cms_*）
- `cms_posts` — ブログ記事（slug/title/excerpt/content/category/tags/status/published_at）
- `cms_services` — サービス（service_id/icon/title/tagline/description/features/results/color/sort_order）
- `cms_pricing` — 料金プラン（service_id/plan_name/price/period/description/features/is_popular/sort_order/monthly_note）
- `cms_faqs` — FAQ（question/answer/sort_order/is_active）
- `cms_works` — 実績（title/industry/description/metrics/tags/color/sort_order/is_active）
- `cms_settings` — サイト設定（key/value(jsonb)）
- `cms_media` — メディアライブラリ（filename/url/alt_text/mime_type/size_bytes）

### フォールバック（src/lib/data.ts）
- **SERVICES**: 4サービス（web/meo/seo/ai）
- **PRICING**: 4カテゴリ × 3プラン
- **FAQS**: 10個のQ&A
- **WORKS**: 6件の実績

---

## デザインシステム

- **カラー**: primary(#1a1a2e) / accent(#4f46e5) / accent-light(#818cf8) / surface(#fff) / text(#1e293b) / text-muted(#64748b)
- **フォント**: Noto Sans JP（Google Fonts、300-800ウェイト）
- **角丸**: rounded-xl(カード) / rounded-2xl(大きいカード) / rounded-xl(ボタン)
- **影**: shadow-lg shadow-accent/25（CTAボタン）
- **グラデーション**: ヒーローセクション from-primary to-slate-900、CTAセクション from-accent to-indigo-600
- **サービス別カラー**: indigo(Web) / emerald(MEO) / amber(SEO) / purple(AI)

---

## 重要ルール

1. UIテキストは日本語で統一
2. デザインはモダンで洗練されたコーポレートサイト
3. レスポンシブ必須（モバイルファースト）
4. Core Web Vitals / Lighthouse 90+を目標
5. SEO最適化（構造化データ/OGP/サイトマップ/robots.txt）
6. git push → Coolify Webhook で自動デプロイ
7. 画像はNext.js Image最適化を使用
8. アニメーションはframer-motionで上品に（過度な演出NG）
9. appexxインフラへのAPI呼び出しはサーバーサイド（Route Handler）から
10. コンテンツはDB優先、data.tsはフォールバック
11. **APIキー・秘密鍵・トークン等の秘密情報はユーザーから伝えられた時点で即座にメモリに永久保存すること。セッション・ディレクトリ・デバイスが変わっても同じ情報を二度と聞かないこと。保存先: `~/.claude/projects/*/memory/reference_api_keys.md`**
12. **Cloudflare DNS追加・Coolifyサービス操作等のインフラ作業はAPI経由で自動実行すること（手動操作の依頼は禁止）。トークンはメモリから参照**
13. **コード変更後は指示を待たず自動で: ① CLAUDE.md更新（変更内容を反映） → ② git add+commit+push → ③ Coolify Webhookで自動デプロイ。この3ステップは毎回セットで実行すること**
14. **今後伝えるAPIキー・秘密鍵・トークン等の情報は全て永久保存すること。セッション・ディレクトリ・デバイスが変わっても同じことを二度と聞かないこと**

---

## GitHub

- レポ: `Paradigmllc/Paradigm-HP`
- ブランチ: `main`

---

## 管理ダッシュボード（/admin）

### 認証
- 環境変数 `ADMIN_PASSWORD` によるシンプル認証
- Cookie `paradigm_admin_token` でセッション管理
- 将来: Authentik OIDC統合予定

### 機能
- **ダッシュボード**: 記事数/サービス数/問い合わせ数/今月のアクセス
- **ブログ管理**: 記事CRUD、Markdownエディタ、プレビュー、下書き/公開切替
- **サービス管理**: 4サービスの説明・特徴・実績テキスト編集
- **料金管理**: プラン名/価格/特徴の編集
- **FAQ管理**: Q&A追加/編集/削除/並べ替え（D&D）
- **実績管理**: ケーススタディ追加/編集/削除
- **リード管理**: 問い合わせ一覧+ステータス管理
- **サイト設定**: 会社情報、メール設定、OGP設定

---

## 実装済み機能

- ✅ `/blog` — ブログ記事、Markdown→HTMLレンダリング、BlogPosting JSON-LD
- ✅ LP 4ページ — `/lp/web` `/lp/meo` `/lp/seo` `/lp/ai`
- ✅ フォームバックエンド — `POST /api/contact`（Slack通知 + Supabase leads保存）
- ✅ OGP画像 — `opengraph-image.tsx`（Edge Runtime動的生成）
- ✅ 構造化データ — Organization/Services/FAQ/BreadcrumbList/BlogPosting（JSON-LD）
- ✅ サイトマップ — `sitemap.ts`（22 URL、優先度/更新頻度付き）
- ✅ robots.txt — `robots.ts`（/api/のみ除外）
- ✅ Umami — layout.tsxにスクリプト埋め込み済み
- ✅ 管理ダッシュボード — `/admin`（認証+7セクション+CRUD API）

## セッション20で実装した機能

- ✅ **DifyChatbot デフォルト開放** — `useState(true)`に変更、初回訪問時からチャット展開
- ✅ **チャットbot精度向上** — Geminiシステムプロンプト強化（料金/納期/FAQ詳細）、フォールバック7→13パターン
- ✅ **デプロイ失敗修正** — `deploy.yml`ポーリングループ削除（Coolifyは`running:unknown`のみ返すため）
- ✅ **framer-motion型修正** — `HomeClient.tsx`の`EASE as const`タプル型（nixpacksビルド対応）

## 未実装（今後の予定）

- ラッコドメインNS変更 — Cloudflareネームサーバーへ変更（手動）
- Umami Website ID設定 — analytics.appexx.meで新サイト追加+環境変数設定
- Ghost連携 — ブログをGhost API経由に切り替え（現在はDB+フォールバック）
- メール送信 — フォーム送信時にResend/SMTP経由で自動返信メール
- パフォーマンス計測 — Lighthouse CI / Web Vitals監視
- Authentik OIDC — 管理画面の認証強化
