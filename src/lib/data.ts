// ─── サービス定義 ───
export const SERVICES = [
  {
    id: "web",
    icon: "🌐",
    title: "Web制作",
    tagline: "売れるサイトを、最新技術で。",
    desc: "Next.js/WordPressによる高速・SEO最適化されたWebサイトを制作。デザインからコーディング、公開後の運用まで一貫してサポートします。",
    features: [
      "Next.js / WordPress対応",
      "レスポンシブ（モバイルファースト）",
      "Core Web Vitals最適化",
      "SEO内部対策込み",
      "CMS導入（更新が簡単）",
      "SSL/セキュリティ対策",
    ],
    results: "平均ページ速度 95+（Lighthouse）",
    color: "indigo",
  },
  {
    id: "meo",
    icon: "📍",
    title: "MEO対策",
    tagline: "地域No.1を、Googleマップで。",
    desc: "Googleビジネスプロフィールの最適化により、地域検索で上位表示。来店型ビジネスの集客を最大化します。",
    features: [
      "GBPプロフィール最適化",
      "口コミ獲得施策",
      "投稿コンテンツ運用",
      "順位トラッキング",
      "競合分析レポート",
      "写真/動画最適化",
    ],
    results: "平均3ヶ月でTOP3表示",
    color: "emerald",
  },
  {
    id: "seo",
    icon: "🔍",
    title: "SEO/GEO対策",
    tagline: "検索される仕組みを、つくる。",
    desc: "従来のSEOに加え、AI検索（ChatGPT/Gemini/Perplexity）での表示最適化（GEO）にも対応。未来の検索に備えます。",
    features: [
      "キーワード戦略設計",
      "コンテンツSEO",
      "テクニカルSEO",
      "AI検索最適化（GEO）",
      "構造化データ対応",
      "月次レポート",
    ],
    results: "オーガニック流入 平均2.5倍",
    color: "amber",
  },
  {
    id: "ai",
    icon: "🤖",
    title: "AI導入支援",
    tagline: "AIを、ビジネスの武器に。",
    desc: "ChatGPT/Gemini等の最新AIを業務に導入。チャットボット、自動化、データ分析で生産性を劇的に向上させます。",
    features: [
      "AIチャットボット構築",
      "業務自動化（n8n/Dify）",
      "AIコンテンツ生成",
      "データ分析・可視化",
      "社内AI研修",
      "カスタムAI開発",
    ],
    results: "業務時間 平均40%削減",
    color: "purple",
  },
]

// ─── 料金プラン ───
export const PRICING = {
  web: {
    plans: [
      { name: "ライトプラン", price: "298,000", period: "〜", desc: "小規模サイト（5ページ以内）", features: ["トップページ+4ページ", "レスポンシブ対応", "SEO基本対策", "お問い合わせフォーム", "公開後1ヶ月サポート"], popular: false },
      { name: "スタンダード", price: "598,000", period: "〜", desc: "中規模サイト（10ページ以内）", features: ["トップページ+9ページ", "CMS導入（WordPress）", "SEO内部対策", "アニメーション実装", "写真撮影代行", "公開後3ヶ月サポート"], popular: true },
      { name: "プレミアム", price: "980,000", period: "〜", desc: "本格的なコーポレートサイト", features: ["ページ数無制限", "Next.js/カスタム開発", "デザインカンプ3案", "多言語対応", "アクセス解析設定", "公開後6ヶ月サポート"], popular: false },
    ],
    monthly: "保守運用: 月額 19,800円〜（更新代行/SSL管理/バックアップ/障害対応）",
  },
  meo: {
    plans: [
      { name: "エントリー", price: "29,800", period: "/月", desc: "まず始めてみたい方", features: ["GBP初期最適化", "月2回投稿代行", "順位レポート（月次）", "口コミ返信テンプレ"], popular: false },
      { name: "スタンダード", price: "49,800", period: "/月", desc: "本格的にMEOに取り組む方", features: ["GBP完全最適化", "月4回投稿代行", "写真最適化", "口コミ獲得施策", "週次レポート", "競合分析"], popular: true },
      { name: "プロ", price: "79,800", period: "/月", desc: "複数店舗・エリア制覇", features: ["複数店舗対応（3店舗まで）", "毎日投稿", "口コミ管理ツール", "SNS連携", "電話コンバージョン計測", "専任担当者"], popular: false },
    ],
    monthly: "最低契約期間: 6ヶ月（成果が出るまで3ヶ月が目安）",
  },
  seo: {
    plans: [
      { name: "SEOベーシック", price: "49,800", period: "/月", desc: "内部SEO+コンテンツ", features: ["サイト診断・改善", "月2本記事作成", "キーワード調査", "月次レポート"], popular: false },
      { name: "SEO+GEO", price: "79,800", period: "/月", desc: "SEO+AI検索対策", features: ["SEOベーシック全機能", "AI検索最適化（GEO）", "構造化データ実装", "月4本記事作成", "競合分析"], popular: true },
      { name: "フルパッケージ", price: "148,000", period: "/月", desc: "SEO+GEO+コンテンツ戦略", features: ["SEO+GEO全機能", "コンテンツ戦略設計", "月8本記事作成", "被リンク施策", "週次ミーティング", "Slack即対応"], popular: false },
    ],
    monthly: "最低契約期間: 6ヶ月 / 初期費用: 100,000円（サイト診断+戦略設計）",
  },
  ai: {
    plans: [
      { name: "AIスタート", price: "198,000", period: "〜", desc: "チャットボット1つ導入", features: ["AIチャットボット構築", "FAQ学習（100問）", "サイト埋め込み", "1ヶ月運用サポート"], popular: false },
      { name: "AI業務改革", price: "498,000", period: "〜", desc: "業務プロセスのAI化", features: ["業務フロー分析", "自動化ワークフロー3本", "AIチャットボット", "社内研修（2時間）", "3ヶ月サポート"], popular: true },
      { name: "AIフル導入", price: "980,000", period: "〜", desc: "全社AI戦略+開発", features: ["AI戦略コンサル", "カスタムAI開発", "自動化ワークフロー無制限", "データ分析基盤", "6ヶ月サポート", "専任エンジニア"], popular: false },
    ],
    monthly: "保守: 月額 29,800円〜（AIモデル更新/障害対応/性能改善）",
  },
}

// ─── FAQ ───
export const FAQS = [
  { q: "初回相談は無料ですか？", a: "はい、初回のオンライン相談（30分）は完全無料です。課題のヒアリングと簡易的なご提案をさせていただきます。" },
  { q: "制作期間はどのくらいですか？", a: "サイト規模によりますが、ライトプラン: 2-3週間、スタンダード: 1-2ヶ月、プレミアム: 2-3ヶ月が目安です。" },
  { q: "WordPressとNext.jsどちらがいいですか？", a: "更新頻度が高い（ブログ・ニュース中心）サイトはWordPress、表示速度重視・高機能サイトはNext.jsがおすすめです。詳しくはご相談ください。" },
  { q: "MEO対策の効果はいつ出ますか？", a: "早い場合は1ヶ月、平均的には3ヶ月程度でTOP3表示が見込めます。業種や地域の競合状況により異なります。" },
  { q: "GEO対策とは何ですか？", a: "Generative Engine Optimization の略で、ChatGPT・Gemini・Perplexity等のAI検索で自社が推薦される対策です。今後のSEOの主流になると言われています。" },
  { q: "AI導入に専門知識は必要ですか？", a: "不要です。導入から運用まで全てサポートします。操作マニュアルと社内研修もセットでご提供します。" },
  { q: "契約期間の縛りはありますか？", a: "Web制作は単発契約です。MEO/SEOは効果測定のため最低6ヶ月契約をお願いしています。途中解約の違約金はありません。" },
  { q: "サポート体制はどうなっていますか？", a: "Slackまたはメールで対応。スタンダード以上のプランは営業時間内の即日対応を保証しています。" },
  { q: "地方からの依頼も可能ですか？", a: "はい、全国対応です。オンラインMTG（Zoom/Google Meet）で完結しますので、地域を問わずご依頼いただけます。" },
  { q: "他社との違いは何ですか？", a: "①自社開発のAI営業基盤による効率化 ②SEOだけでなくAI検索(GEO)対応 ③Web制作+集客+AIの一貫支援ができる点です。" },
]

// ─── 実績 ───
export const WORKS = [
  { title: "飲食店HP制作+MEO", industry: "飲食", desc: "個人経営イタリアンのHP制作とMEO対策。3ヶ月でGoogle Maps TOP3を達成し、予約数が月30件増加。", metrics: "予約数 +30件/月", tags: ["Web制作", "MEO"], color: "emerald" },
  { title: "クリニックLP+SEO", industry: "医療", desc: "美容クリニックのランディングページ制作とSEO対策。「〇〇市 美容クリニック」で1位を獲得。", metrics: "検索1位獲得", tags: ["LP制作", "SEO"], color: "blue" },
  { title: "EC事業者AI導入", industry: "EC", desc: "ECサイト運営者へのAIチャットボット導入。カスタマー対応の80%を自動化し、対応時間を大幅削減。", metrics: "対応時間 80%削減", tags: ["AI導入", "チャットボット"], color: "purple" },
  { title: "美容室GEO+SNS", industry: "美容", desc: "地域密着型美容室のGEO対策とSNS連携。AI検索での推薦率が向上し、新規来店が月15件増加。", metrics: "新規来店 +15件/月", tags: ["GEO", "SNS"], color: "pink" },
  { title: "不動産会社Web刷新", industry: "不動産", desc: "老舗不動産会社のコーポレートサイトを全面リニューアル。Next.jsで高速化し、問い合わせ率2倍に。", metrics: "CVR 2倍", tags: ["Web制作", "Next.js"], color: "amber" },
  { title: "SaaS企業LP制作", industry: "IT", desc: "BtoB SaaS企業のサービスLP制作。コンバージョン導線の最適化で、トライアル申込数が3倍に。", metrics: "トライアル 3倍", tags: ["LP制作", "CRO"], color: "indigo" },
]
