import Link from "next/link"
import { SERVICES } from "@/lib/data"

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex items-center justify-center min-h-[85vh] bg-gradient-to-br from-primary via-slate-900 to-primary text-white px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(79,70,229,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(99,102,241,0.1),transparent_60%)]" />
        <div className="relative max-w-4xl text-center">
          <p className="text-accent-light text-sm font-semibold tracking-widest uppercase mb-4">
            Paradigm合同会社
          </p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            デジタルで、<br />
            <span className="bg-gradient-to-r from-accent-light to-indigo-300 bg-clip-text text-transparent">事業を加速する。</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Web制作・MEO対策・SEO/GEO・AI導入支援。<br />
            中小企業のデジタル変革をワンストップで支援します。
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/contact" className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-8 py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-accent/25 hover:shadow-accent/40">
              無料相談を予約
            </Link>
            <Link href="/services" className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white px-8 py-3.5 rounded-xl font-semibold transition-all hover:bg-white/5">
              サービスを見る
            </Link>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-2">Services</p>
            <h2 className="text-3xl md:text-4xl font-bold text-primary">事業を成長させる4つのサービス</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map(s => (
              <Link key={s.id} href={`/services/${s.id}`} className="group rounded-2xl border border-gray-100 bg-white p-8 hover:border-accent/20 hover:shadow-xl transition-all duration-300">
                <span className="text-4xl block mb-4">{s.icon}</span>
                <h3 className="text-lg font-bold text-primary mb-2 group-hover:text-accent transition-colors">{s.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed mb-3">{s.tagline}</p>
                <p className="text-xs text-accent font-medium">{s.results}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-2">Why Paradigm</p>
            <h2 className="text-3xl md:text-4xl font-bold text-primary">選ばれる3つの理由</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: "01", title: "AI営業基盤で高効率", desc: "自社開発のAI営業基盤を活用。徹底的なデータ分析と効率的な提案で、最短で成果を実現します。" },
              { num: "02", title: "SEO+GEO=未来の検索対応", desc: "従来のSEOに加え、ChatGPT/GeminiなどのAI検索最適化（GEO）にも対応。次世代の集客を先取り。" },
              { num: "03", title: "Web+集客+AIのワンストップ", desc: "サイト制作・MEO・SEO・AI導入を一貫して対応。複数業者に発注する手間もコストもかかりません。" },
            ].map(r => (
              <div key={r.num} className="text-center">
                <span className="text-5xl font-bold text-accent/10 block mb-4">{r.num}</span>
                <h3 className="text-lg font-bold text-primary mb-3">{r.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-accent to-indigo-600">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">まずは無料相談から</h2>
          <p className="text-lg text-white/80 mb-8">御社の課題をヒアリングし、最適なデジタル戦略をご提案します。</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-accent px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all shadow-lg">
              無料相談を予約する
            </Link>
            <Link href="/services" className="inline-flex items-center gap-2 border border-white/30 hover:border-white/60 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all">
              サービスを見る
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
