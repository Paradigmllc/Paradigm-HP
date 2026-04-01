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
| フレームワーク | Next.js 16（App Router）+ TypeScript + Tailwind CSS v4 |
| フォント | Noto Sans JP (300-800ウェイト、Google Fonts) |
| アニメーション | framer-motion |
| UI | shadcn/ui + Radix |
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

## ページ構成（予定）

```
paradigmjp.com/
├── /                  ← トップページ（ヒーロー+サービス概要+実績+CTA）
├── /about             ← 会社概要（代表挨拶/沿革/ミッション/チーム）
├── /services          ← サービス一覧
│   ├── /services/web  ← Web制作
│   ├── /services/meo  ← MEO対策
│   ├── /services/seo  ← SEO/GEO対策
│   └── /services/ai   ← AI導入支援
├── /works             ← 制作実績
├── /blog              ← ブログ（Ghost連携 or MDX）
├── /contact           ← お問い合わせ（Formbricks or Cal.com）
├── /privacy           ← プライバシーポリシー
└── /legal             ← 特定商取引法に基づく表記
```

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

---

## GitHub

- レポ: `Paradigmllc/Paradigm-HP`
- ブランチ: `main`
