import Link from "next/link"

const LINKS = {
  services: [
    { href: "/services/web", label: "Web制作" },
    { href: "/services/meo", label: "MEO対策" },
    { href: "/services/seo", label: "SEO/GEO対策" },
    { href: "/services/ai", label: "AI導入支援" },
  ],
  company: [
    { href: "/about", label: "会社概要" },
    { href: "/works", label: "制作実績" },
    { href: "/blog", label: "ブログ" },
    { href: "/contact", label: "お問い合わせ" },
  ],
  legal: [
    { href: "/privacy", label: "プライバシーポリシー" },
    { href: "/legal", label: "特定商取引法" },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-primary text-white/70">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent to-indigo-400 flex items-center justify-center text-white text-xs font-bold">P</div>
              <span className="text-lg font-bold text-white">Paradigm</span>
            </div>
            <p className="text-sm leading-relaxed">
              デジタル技術で中小企業の成長を支援する、Paradigm合同会社です。
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">サービス</h4>
            <ul className="space-y-2.5">
              {LINKS.services.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">企業情報</h4>
            <ul className="space-y-2.5">
              {LINKS.company.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">お問い合わせ</h4>
            <div className="space-y-2.5 text-sm">
              <p>contact@paradigmjp.com</p>
              <Link href="/contact" className="inline-block mt-3 px-5 py-2.5 rounded-lg bg-accent/20 text-accent-light hover:bg-accent/30 font-medium transition-colors">
                無料相談を予約
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs">&copy; {new Date().getFullYear()} Paradigm合同会社. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {LINKS.legal.map(l => (
              <Link key={l.href} href={l.href} className="text-xs hover:text-white transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
