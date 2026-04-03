"use client"

import { usePathname } from "next/navigation"

export default function SiteWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  // 提案ページ(/p/*)はLPとして全画面表示 — pt-16不要
  return <main className={pathname.startsWith("/p/") ? "" : "pt-16"}>{children}</main>
}
