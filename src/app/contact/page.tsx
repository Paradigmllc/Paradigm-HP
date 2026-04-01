import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "Paradigm合同会社へのお問い合わせ・無料相談のご予約はこちらから。Web制作・MEO・SEO/GEO・AI導入のご相談を承ります。",
}

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 px-6 bg-gradient-to-br from-primary to-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-accent-light text-sm font-semibold tracking-widest uppercase mb-3">Contact</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">お問い合わせ</h1>
          <p className="text-lg text-gray-300">お気軽にご相談ください。初回30分のオンライン相談は無料です。</p>
        </div>
      </section>

      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-16">
          {/* Form */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold text-primary mb-8">お問い合わせフォーム</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">お名前 <span className="text-red-500">*</span></label>
                  <input type="text" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm" placeholder="山田 太郎" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">会社名</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm" placeholder="株式会社○○" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">メールアドレス <span className="text-red-500">*</span></label>
                <input type="email" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm" placeholder="info@example.com" />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">電話番号</label>
                <input type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm" placeholder="090-1234-5678" />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">ご興味のあるサービス</label>
                <div className="grid grid-cols-2 gap-3">
                  {["Web制作", "MEO対策", "SEO/GEO対策", "AI導入支援"].map(s => (
                    <label key={s} className="flex items-center gap-2 p-3 rounded-xl border border-gray-200 cursor-pointer hover:border-accent/30 transition-colors">
                      <input type="checkbox" className="rounded border-gray-300 text-accent focus:ring-accent" />
                      <span className="text-sm text-text-muted">{s}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">ご相談内容 <span className="text-red-500">*</span></label>
                <textarea required rows={5} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm resize-none" placeholder="御社の課題やご要望をお聞かせください。" />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">ご予算</label>
                <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm text-text-muted">
                  <option value="">選択してください</option>
                  <option value="~30">~30万円</option>
                  <option value="30-50">30~50万円</option>
                  <option value="50-100">50~100万円</option>
                  <option value="100~">100万円以上</option>
                  <option value="undecided">未定・相談したい</option>
                </select>
              </div>

              <button type="submit" className="w-full py-4 bg-accent text-white rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors shadow-lg shadow-accent/25">
                送信する
              </button>
              <p className="text-xs text-text-muted text-center">
                送信いただいた内容は<Link href="/privacy" className="underline hover:text-accent">プライバシーポリシー</Link>に基づき適切に管理いたします。
              </p>
            </form>
          </div>

          {/* Info Sidebar */}
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-2xl bg-gray-50 p-8">
              <h3 className="font-bold text-primary text-lg mb-4">無料相談について</h3>
              <ul className="space-y-3 text-sm text-text-muted">
                <li className="flex gap-2"><span>&#9200;</span>初回30分間、完全無料</li>
                <li className="flex gap-2"><span>&#128187;</span>Zoom / Google Meetで実施</li>
                <li className="flex gap-2"><span>&#128197;</span>平日 10:00〜18:00</li>
                <li className="flex gap-2"><span>&#128221;</span>課題ヒアリング+簡易提案</li>
              </ul>
            </div>

            <div className="rounded-2xl bg-gray-50 p-8">
              <h3 className="font-bold text-primary text-lg mb-4">お問い合わせ先</h3>
              <div className="space-y-3 text-sm text-text-muted">
                <p><span className="font-medium text-primary">メール:</span> contact@paradigmjp.com</p>
                <p><span className="font-medium text-primary">対応時間:</span> 平日 10:00〜18:00</p>
                <p><span className="font-medium text-primary">返信:</span> 1営業日以内にご連絡します</p>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-accent/20 bg-accent/5 p-8">
              <h3 className="font-bold text-accent text-lg mb-3">お急ぎの方へ</h3>
              <p className="text-sm text-text-muted mb-4">
                Cal.comでオンライン相談をすぐにご予約いただけます。
              </p>
              <a href="https://cal.appexx.me" target="_blank" rel="noopener noreferrer" className="inline-flex w-full justify-center py-3 bg-accent text-white rounded-xl font-semibold text-sm hover:bg-accent/90 transition-colors">
                オンライン相談を予約
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
