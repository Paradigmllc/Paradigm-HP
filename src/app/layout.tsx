import type { Metadata } from "next"
import "./globals.css"

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
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  )
}
