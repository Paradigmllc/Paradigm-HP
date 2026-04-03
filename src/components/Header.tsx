"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Menu, X } from "lucide-react"

const NAV = [
  { href: "/about", label: "会社概要" },
  { href: "/services", label: "サービス" },
  { href: "/faq", label: "FAQ" },
  { href: "/blog", label: "ブログ" },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  if (pathname.startsWith("/p/")) return null

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent to-indigo-400 flex items-center justify-center text-white text-xs font-bold">P</div>
          <span className="text-lg font-bold text-primary">Paradigm</span>
        </Link>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV.map(n => (
            <Link key={n.href} href={n.href} className="text-sm text-text-muted hover:text-primary font-medium transition-colors">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/contact" className="h-10 px-6 rounded-xl bg-accent text-white text-sm font-semibold flex items-center hover:bg-accent/90 transition-colors shadow-sm">
            お問い合わせ
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-primary">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-1">
          {NAV.map(n => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)}
              className="block py-3 text-sm font-medium text-text-muted hover:text-primary border-b border-gray-50">
              {n.label}
            </Link>
          ))}
          <Link href="/contact" onClick={() => setOpen(false)}
            className="block mt-3 text-center py-3 rounded-xl bg-accent text-white text-sm font-semibold">
            お問い合わせ
          </Link>
        </div>
      )}
    </header>
  )
}
