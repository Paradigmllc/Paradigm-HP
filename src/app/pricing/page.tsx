import type { Metadata } from "next"
import Link from "next/link"
import { PRICING, SERVICES } from "@/lib/data"

export const metadata: Metadata = {
  title: "料金プラン",
  description: "Web制作・MEO対策・SEO/GEO対策・AI導入支援の料金プラン一覧。明確な料金体系で安心してご依頼いただけます。",
}

const COLOR_MAP: Record<string, { accent: string; bg: string; ring: string; btn: string }> = {
  web: { accent: "text-indigo-600", bg: "bg-indigo-50", ring: "ring-indigo-500 border-indigo-500", btn: "bg-indigo-500 hover:bg-indigo-600" },
  meo: { accent: "text-emerald-600", bg: "bg-emerald-50", ring: "ring-emerald-500 border-emerald-500", btn: "bg-emerald-500 hover:bg-emerald-600" },
  seo: { accent: "text-amber-600", bg: "bg-amber-50", ring: "ring-amber-500 border-amber-500", btn: "bg-amber-500 hover:bg-amber-600" },
  ai: { accent: "text-purple-600", bg: "bg-purple-50", ring: "ring-purple-500 border-purple-500", btn: "bg-purple-500 hover:bg-purple-600" },
}

export default function PricingPage() {
  const categories = Object.entries(PRICING) as [keyof typeof PRICING, (typeof PRICING)[keyof typeof PRICING]][]

  return (
    <>
      {/* Hero */}
      <section className="py-20 px-6 bg-gradient-to-br from-primary to-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-accent-light text-sm font-semibold tracking-widest uppercase mb-3">Pricing</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">料金プラン</h1>
          <p className="text-lg text-gray-300">明確な料金体系。隠れた費用は一切ありません。</p>
        </div>
      </section>

      {/* Pricing Sections */}
      {categories.map(([key, data]) => {
        const service = SERVICES.find(s => s.id === key)!
        const colors = COLOR_MAP[key]
        return (
          <section key={key} className="py-20 px-6 even:bg-gray-50 odd:bg-white" id={key}>
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-4xl block mb-3">{service.icon}</span>
                <h2 className="text-3xl font-bold text-primary">{service.title}</h2>
                <p className="text-text-muted mt-2">{service.tagline}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {data.plans.map(p => (
                  <div key={p.name} className={`rounded-2xl p-8 border bg-white ${p.popular ? `shadow-xl ring-2 ${colors.ring}` : "border-gray-200"}`}>
                    {p.popular && <p className={`${colors.accent} text-xs font-bold uppercase tracking-wider mb-2`}>人気No.1</p>}
                    <h3 className="text-xl font-bold text-primary">{p.name}</h3>
                    <p className="text-sm text-text-muted mt-1 mb-4">{p.desc}</p>
                    <p className="text-3xl font-bold text-primary mb-1">
                      &yen;{p.price}
                      <span className="text-base font-normal text-text-muted">{p.period}</span>
                    </p>
                    <ul className="mt-6 space-y-2">
                      {p.features.map(f => (
                        <li key={f} className="flex items-start gap-2 text-sm text-text-muted">
                          <span className={`${colors.accent} mt-0.5`}>&#10003;</span>{f}
                        </li>
                      ))}
                    </ul>
                    <Link href="/contact" className={`block mt-8 text-center py-3 rounded-xl font-semibold text-sm transition-colors ${p.popular ? `${colors.btn} text-white` : "bg-gray-100 text-primary hover:bg-gray-200"}`}>
                      相談する
                    </Link>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-center text-sm text-text-muted">{data.monthly}</p>
            </div>
          </section>
        )
      })}

      {/* Notes */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-primary text-center mb-8">料金に関する補足</h2>
          <div className="space-y-4 text-sm text-text-muted">
            <div className="flex gap-3 p-4 rounded-xl bg-gray-50">
              <span className="text-accent font-bold shrink-0">Q.</span>
              <div>
                <p className="font-medium text-primary">表示価格は税込みですか？</p>
                <p className="mt-1">表示価格はすべて税別です。別途消費税がかかります。</p>
              </div>
            </div>
            <div className="flex gap-3 p-4 rounded-xl bg-gray-50">
              <span className="text-accent font-bold shrink-0">Q.</span>
              <div>
                <p className="font-medium text-primary">お支払い方法は？</p>
                <p className="mt-1">銀行振込（請求書払い）に対応しています。月額プランは毎月月初に請求書を発行します。</p>
              </div>
            </div>
            <div className="flex gap-3 p-4 rounded-xl bg-gray-50">
              <span className="text-accent font-bold shrink-0">Q.</span>
              <div>
                <p className="font-medium text-primary">カスタムプランは可能ですか？</p>
                <p className="mt-1">はい。ご要望に応じたカスタムプランも作成可能です。まずは無料相談でご要件をお聞かせください。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-accent to-indigo-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">最適なプランをご提案します</h2>
        <p className="text-white/80 mb-8">初回30分の無料オンライン相談で、御社に合ったプランをご案内します。</p>
        <Link href="/contact" className="inline-flex bg-white text-accent px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all shadow-lg">
          無料相談を予約する
        </Link>
      </section>
    </>
  )
}
