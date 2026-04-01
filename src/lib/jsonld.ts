// ─── 構造化データ（JSON-LD） ───

export const ORGANIZATION_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Paradigm合同会社",
  url: "https://paradigmjp.com",
  logo: "https://paradigmjp.com/opengraph-image",
  description: "Web制作・MEO対策・SEO/GEO対策・AI導入支援。デジタル技術で中小企業の成長を支援するParadigm合同会社。",
  email: "contact@paradigmjp.com",
  sameAs: [],
  foundingDate: "2025",
  areaServed: { "@type": "Country", name: "Japan" },
  serviceArea: { "@type": "Country", name: "Japan" },
  knowsAbout: ["Web制作", "MEO対策", "SEO", "GEO", "AI導入支援", "デジタルマーケティング"],
}

export const SERVICES_JSONLD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: [
    {
      "@type": "Service",
      name: "Web制作",
      description: "Next.js/WordPressによる高速・SEO最適化されたWebサイト制作",
      provider: { "@type": "Organization", name: "Paradigm合同会社" },
      url: "https://paradigmjp.com/services/web",
      offers: { "@type": "Offer", priceCurrency: "JPY", price: "298000", description: "ライトプラン〜" },
    },
    {
      "@type": "Service",
      name: "MEO対策",
      description: "Googleビジネスプロフィール最適化による地域検索上位表示",
      provider: { "@type": "Organization", name: "Paradigm合同会社" },
      url: "https://paradigmjp.com/services/meo",
      offers: { "@type": "Offer", priceCurrency: "JPY", price: "29800", description: "月額エントリープラン〜" },
    },
    {
      "@type": "Service",
      name: "SEO/GEO対策",
      description: "従来のSEO+AI検索最適化（GEO）による検索流入増加",
      provider: { "@type": "Organization", name: "Paradigm合同会社" },
      url: "https://paradigmjp.com/services/seo",
      offers: { "@type": "Offer", priceCurrency: "JPY", price: "49800", description: "月額SEOベーシック〜" },
    },
    {
      "@type": "Service",
      name: "AI導入支援",
      description: "ChatGPT/Gemini等を活用した業務自動化・チャットボット構築",
      provider: { "@type": "Organization", name: "Paradigm合同会社" },
      url: "https://paradigmjp.com/services/ai",
      offers: { "@type": "Offer", priceCurrency: "JPY", price: "198000", description: "AIスタートプラン〜" },
    },
  ],
}

export const BREADCRUMB_JSONLD = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: item.url,
  })),
})

export const FAQ_JSONLD = (faqs: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(f => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
})
