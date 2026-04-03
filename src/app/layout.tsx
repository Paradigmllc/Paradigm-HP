import type { Metadata } from "next"
import "./globals.css"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import DifyChatbot from "@/components/DifyChatbot"
import SiteWrapper from "@/components/SiteWrapper"
import { ORGANIZATION_JSONLD, SERVICES_JSONLD } from "@/lib/jsonld"

export const metadata: Metadata = {
  title: {
    default: "Paradigm合同会社 | デジタルで事業を加速する",
    template: "%s | Paradigm合同会社",
  },
  description: "Web制作・MEO対策・SEO/GEO・AI導入支援。デジタル技術で中小企業の成長を支援するParadigm合同会社の公式サイトです。",
  metadataBase: new URL("https://paradigmjp.com"),
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "Paradigm合同会社",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://paradigmjp.com" },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        {/* Umami Analytics */}
        {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <script defer src="https://analytics.appexx.me/script.js" data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID} />
        )}
        {/* JSON-LD: Organization */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSONLD) }} />
        {/* JSON-LD: Services */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICES_JSONLD) }} />
      </head>
      <body className="min-h-screen">
        <Header />
        <SiteWrapper>{children}</SiteWrapper>
        <Footer />
        {/* Dify チャットボットウィジェット（右下） */}
        <DifyChatbot />
      </body>
    </html>
  )
}
