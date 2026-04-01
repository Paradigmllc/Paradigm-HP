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
| ホスト | Coolify（同一サーバー: 139.59.250.5） |
| DNS | Cloudflare |
| CI/CD | Coolify Webhook（git push → 自動デプロイ） |

---

## インフラ（appexx.meと共有）

| リソース | 接続方法 |
|---|---|
| Supabase | 同一プロジェクト（yihdmgtxiqfdgdueolub）— 別テーブルで分離 |
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
├── /contact           ← お問い合わせ（フォーム+サイドバー+Cal.comリンク）
├── /blog              ← ブログ（未実装 — Ghost連携 or MDX予定）
├── /privacy           ← プライバシーポリシー（9条）
└── /legal             ← 特定商取引法に基づく表記
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
│   │   ├── contact/page.tsx
│   │   ├── faq/page.tsx
│   │   ├── legal/page.tsx
│   │   ├── pricing/page.tsx
│   │   ├── privacy/page.tsx
│   │   ├── works/page.tsx
│   │   └── services/
│   │       ├── page.tsx         ← サービス一覧
│   │       ├── web/page.tsx
│   │       ├── meo/page.tsx
│   │       ├── seo/page.tsx
│   │       └── ai/page.tsx
│   ├── components/
│   │   ├── Header.tsx           ← 固定ヘッダー（デスクトップナビ+モバイルハンバーガー）
│   │   └── Footer.tsx           ← 4カラムフッター（ブランド/サービス/企業情報/連絡先）
│   └── lib/
│       └── data.ts              ← コンテンツデータ定義（SERVICES/PRICING/FAQS/WORKS）
└── public/
```

---

## データ構造（src/lib/data.ts）

- **SERVICES**: 4サービス（web/meo/seo/ai）— id/icon/title/tagline/desc/features/results/color
- **PRICING**: 4カテゴリ × 3プラン — name/price(JPY)/period/desc/features/popular + monthly注記
- **FAQS**: 10個のQ&A — q/a
- **WORKS**: 6件の実績 — title/industry/desc/metrics/tags/color

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
10. コンテンツ変更はdata.tsを修正するだけで全ページに反映

---

## GitHub

- レポ: `Paradigmllc/Paradigm-HP`
- ブランチ: `main`

---

## 未実装（今後の予定）

- `/blog` — Ghost連携 or MDX
- LP（ランディングページ） — 広告キャンペーン用の個別サービスLP
- フォームバックエンド — お問い合わせフォームのメール送信API接続
- OGP画像 — 各ページ用のOG画像生成
- 構造化データ — JSON-LD（Organization/Service/FAQ/BreadcrumbList）
- サイトマップ — next-sitemap or app/sitemap.ts
- Umami設置 — analytics.appexx.meでサイトID取得+スクリプト埋め込み
- ラッコドメインNS変更 — Cloudflareネームサーバーへ変更（手動）
