import type { Metadata } from "next"
import Link from "next/link"
import { WORKS } from "@/lib/data"

export const metadata: Metadata = {
  title: "制作実績",
  description: "Paradigm合同会社のWeb制作・MEO対策・SEO/GEO対策・AI導入支援の実績をご紹介します。",
}

const TAG_COLORS: Record<string, string> = {
  "Web制作": "bg-indigo-100 text-indigo-700",
  "LP制作": "bg-blue-100 text-blue-700",
  "MEO": "bg-emerald-100 text-emerald-700",
  "SEO": "bg-amber-100 text-amber-700",
  "GEO": "bg-orange-100 text-orange-700",
  "AI導入": "bg-purple-100 text-purple-700",
  "チャットボット": "bg-violet-100 text-violet-700",
  "SNS": "bg-pink-100 text-pink-700",
  "Next.js": "bg-gray-100 text-gray-700",
  "CRO": "bg-cyan-100 text-cyan-700",
}

export default function WorksPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 px-6 bg-gradient-to-br from-primary to-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-accent-light text-sm font-semibold tracking-widest uppercase mb-3">Works</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">制作実績</h1>
          <p className="text-lg text-gray-300">お客様のビジネス成長をサポートした実績をご紹介します。</p>
        </div>
      </section>

      {/* Works Grid */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {WORKS.map((w, i) => (
              <div key={i} className="group rounded-2xl border border-gray-100 bg-white overflow-hidden hover:shadow-xl transition-all duration-300">
                {/* Color bar */}
                <div className={`h-2 bg-gradient-to-r ${
                  w.color === "emerald" ? "from-emerald-400 to-emerald-600" :
                  w.color === "blue" ? "from-blue-400 to-blue-600" :
                  w.color === "purple" ? "from-purple-400 to-purple-600" :
                  w.color === "pink" ? "from-pink-400 to-pink-600" :
                  w.color === "amber" ? "from-amber-400 to-amber-600" :
                  "from-indigo-400 to-indigo-600"
                }`} />
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-accent/10 text-accent">{w.industry}</span>
                    {w.tags.map(t => (
                      <span key={t} className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${TAG_COLORS[t] || "bg-gray-100 text-gray-600"}`}>{t}</span>
                    ))}
                  </div>
                  <h3 className="font-bold text-primary text-xl mb-3">{w.title}</h3>
                  <p className="text-sm text-text-muted leading-relaxed mb-6">{w.desc}</p>
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-xs text-text-muted mb-1">成果指標</p>
                    <p className="text-xl font-bold text-primary">{w.metrics}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-accent to-indigo-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">次の成功事例は、御社かもしれません</h2>
        <p className="text-white/80 mb-8">まずは無料相談で、御社のデジタル課題をお聞かせください。</p>
        <Link href="/contact" className="inline-flex bg-white text-accent px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all shadow-lg">
          無料相談を予約する
        </Link>
      </section>
    </>
  )
}
