export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative flex items-center justify-center min-h-[80vh] bg-gradient-to-br from-primary to-slate-900 text-white px-6">
        <div className="max-w-4xl text-center">
          <p className="text-accent-light text-sm font-semibold tracking-widest uppercase mb-4">
            Paradigm合同会社
          </p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            デジタルで、<br />
            <span className="text-accent-light">事業を加速する。</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
            Web制作・MEO対策・SEO/GEO・AI導入支援。<br />
            中小企業のデジタル変革をワンストップで支援します。
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a href="/contact" className="inline-flex items-center gap-2 bg-accent hover:bg-accent-light text-white px-8 py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-accent/25">
              お問い合わせ
            </a>
            <a href="/services" className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white px-8 py-3.5 rounded-xl font-semibold transition-all">
              サービスを見る
            </a>
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
            {[
              { icon: "🌐", title: "Web制作", desc: "最新技術で高速・美しいサイトを構築。Next.js/WordPressに対応。" },
              { icon: "📍", title: "MEO対策", desc: "Googleマップで上位表示。地域ビジネスの集客を最大化します。" },
              { icon: "🔍", title: "SEO/GEO", desc: "検索エンジン最適化+AI検索対応。見込み客が自然に集まる仕組み。" },
              { icon: "🤖", title: "AI導入支援", desc: "業務効率化からAIチャットボットまで。最新AI技術を導入支援。" },
            ].map(s => (
              <div key={s.title} className="group rounded-2xl border border-gray-100 bg-white p-8 hover:border-accent/20 hover:shadow-xl transition-all duration-300">
                <span className="text-4xl block mb-4">{s.icon}</span>
                <h3 className="text-lg font-bold text-primary mb-2">{s.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-accent">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">まずは無料相談から</h2>
          <p className="text-lg text-white/80 mb-8">御社の課題をヒアリングし、最適なデジタル戦略をご提案します。</p>
          <a href="/contact" className="inline-flex items-center gap-2 bg-white text-accent px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all shadow-lg">
            無料相談を予約する
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-primary text-white/60">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white font-bold text-lg">Paradigm合同会社</p>
            <p className="text-sm mt-1">デジタルで事業を加速する</p>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a href="/about" className="hover:text-white transition-colors">会社概要</a>
            <a href="/services" className="hover:text-white transition-colors">サービス</a>
            <a href="/works" className="hover:text-white transition-colors">実績</a>
            <a href="/blog" className="hover:text-white transition-colors">ブログ</a>
            <a href="/contact" className="hover:text-white transition-colors">お問い合わせ</a>
          </div>
          <p className="text-xs">&copy; {new Date().getFullYear()} Paradigm LLC. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
