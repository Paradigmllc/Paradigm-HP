"use client"

import { useState, useCallback } from "react"

// Difyアプリ設定（dify.appexx.me）
const DIFY_BASE_URL = "https://dify.appexx.me"
// TODO: Dify管理画面で作成したチャットボットのアプリIDに変更
const DIFY_APP_ID = "paradigm-consultation"

// 用意された質問リスト
const QUICK_QUESTIONS = [
  { icon: "💰", label: "見積もりについて", message: "サービスの見積もりについて教えてください" },
  { icon: "🛠️", label: "サポート体制", message: "サポート体制について教えてください" },
  { icon: "📋", label: "制作の流れ", message: "制作の流れを教えてください" },
  { icon: "⏰", label: "納期について", message: "納期はどのくらいですか？" },
  { icon: "🔄", label: "修正・変更", message: "制作後の修正・変更は可能ですか？" },
  { icon: "📊", label: "実績を見たい", message: "過去の制作実績を教えてください" },
]

export default function DifyChatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([
    { role: "bot", text: "こんにちは！Paradigm合同会社のAIアシスタントです。\nご質問をお選びいただくか、自由にメッセージをお送りください。" },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return

    setMessages(prev => [...prev, { role: "user", text }])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch(`${DIFY_BASE_URL}/v1/chat-messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${DIFY_APP_ID}`,
        },
        body: JSON.stringify({
          inputs: {},
          query: text,
          response_mode: "blocking",
          user: `visitor-${Date.now()}`,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setMessages(prev => [...prev, { role: "bot", text: data.answer || "回答を生成中..." }])
      } else {
        // Dify APIが利用不可の場合のフォールバック回答
        const fallback = getFallbackAnswer(text)
        setMessages(prev => [...prev, { role: "bot", text: fallback }])
      }
    } catch {
      const fallback = getFallbackAnswer(text)
      setMessages(prev => [...prev, { role: "bot", text: fallback }])
    }

    setLoading(false)
  }, [loading])

  return (
    <>
      {/* フローティングボタン */}
      {!open && (
        <button
          id="dify-chatbot-bubble-button"
          data-dify-btn
          onClick={() => setOpen(true)}
          style={{
            position: "fixed", bottom: 24, right: 24, zIndex: 9999,
            width: 60, height: 60, borderRadius: "50%",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            border: "none", cursor: "pointer", boxShadow: "0 8px 32px rgba(99,102,241,.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "transform .2s, box-shadow .2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(99,102,241,.5)" }}
          onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(99,102,241,.4)" }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      )}

      {/* チャットパネル */}
      {open && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 9999,
          width: 380, maxWidth: "calc(100vw - 32px)", height: 560, maxHeight: "calc(100vh - 48px)",
          background: "#fff", borderRadius: 20, overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,.15), 0 0 0 1px rgba(0,0,0,.05)",
          display: "flex", flexDirection: "column",
          fontFamily: "'Noto Sans JP', sans-serif",
        }}>
          {/* ヘッダー */}
          <div style={{
            padding: "16px 20px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>💬 Paradigm アシスタント</div>
              <div style={{ fontSize: 11, opacity: .8, marginTop: 2 }}>お気軽にご質問ください</div>
            </div>
            <button onClick={() => setOpen(false)} style={{
              background: "rgba(255,255,255,.2)", border: "none", borderRadius: 8,
              width: 32, height: 32, cursor: "pointer", color: "#fff", fontSize: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>✕</button>
          </div>

          {/* メッセージ一覧 */}
          <div style={{
            flex: 1, overflowY: "auto", padding: "16px 16px 8px",
            display: "flex", flexDirection: "column", gap: 12,
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start",
              }}>
                <div style={{
                  maxWidth: "85%", padding: "10px 14px", borderRadius: 16,
                  fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap",
                  ...(m.role === "user"
                    ? { background: "#6366f1", color: "#fff", borderBottomRightRadius: 4 }
                    : { background: "#f3f4f6", color: "#1e293b", borderBottomLeftRadius: 4 }),
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{ background: "#f3f4f6", borderRadius: 16, padding: "10px 18px", fontSize: 13, color: "#94a3b8" }}>
                  入力中...
                </div>
              </div>
            )}

            {/* クイック質問ボタン（最初の会話時のみ） */}
            {messages.length <= 1 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                {QUICK_QUESTIONS.map((q, i) => (
                  <button key={i} onClick={() => sendMessage(q.message)} style={{
                    background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 100,
                    padding: "6px 14px", fontSize: 12, color: "#374151", cursor: "pointer",
                    transition: "all .2s", fontFamily: "'Noto Sans JP', sans-serif",
                    display: "flex", alignItems: "center", gap: 4,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.background = "#f5f3ff" }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.background = "#fff" }}
                  >
                    <span>{q.icon}</span> {q.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 入力欄 */}
          <div style={{
            padding: "12px 16px", borderTop: "1px solid #f1f5f9",
            display: "flex", gap: 8, background: "#fff",
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
              placeholder="メッセージを入力..."
              style={{
                flex: 1, height: 40, border: "1.5px solid #e5e7eb", borderRadius: 12,
                padding: "0 14px", fontSize: 13, outline: "none",
                fontFamily: "'Noto Sans JP', sans-serif",
              }}
              onFocus={e => e.currentTarget.style.borderColor = "#6366f1"}
              onBlur={e => e.currentTarget.style.borderColor = "#e5e7eb"}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              style={{
                width: 40, height: 40, borderRadius: 12, border: "none",
                background: input.trim() ? "#6366f1" : "#e5e7eb",
                cursor: input.trim() ? "pointer" : "default",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background .2s",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}

// Dify APIが利用不可の場合のフォールバック回答
function getFallbackAnswer(question: string): string {
  const q = question.toLowerCase()
  if (q.includes("見積") || q.includes("料金") || q.includes("費用") || q.includes("価格")) {
    return "お見積もりについてですね。\n\n📋 主なサービス料金の目安：\n\n• ホームページ制作: ¥300,000〜¥800,000\n• ランディングページ: ¥150,000〜¥400,000\n• MEO対策: ¥30,000〜¥80,000/月\n• SEO対策: ¥50,000〜¥200,000/月\n• ECサイト構築: ¥500,000〜¥1,500,000\n\n正式なお見積もりは無料相談にてご案内いたします。ページ上部の「15分オンライン相談」からご予約ください。"
  }
  if (q.includes("サポート") || q.includes("保守") || q.includes("運用")) {
    return "サポート体制についてですね。\n\n🛡️ 安心のサポート体制：\n\n• 納品後3ヶ月間は無料修正対応\n• 月額保守プラン（¥10,000〜）で継続サポート\n• 営業時間内（平日9:00-18:00）のチャット・メール対応\n• 緊急時は24時間以内に対応\n• 月次レポートで成果を可視化\n\nまずは無料相談で詳しくご説明いたします。"
  }
  if (q.includes("流れ") || q.includes("プロセス") || q.includes("手順") || q.includes("ステップ")) {
    return "制作の流れをご説明します。\n\n📋 5ステップで完成：\n\n1️⃣ 無料相談（15分） — ご要望のヒアリング\n2️⃣ お見積もり・ご提案 — 1〜3営業日\n3️⃣ デザイン制作 — ラフ→確定（修正2回まで無料）\n4️⃣ 開発・構築 — 2〜4週間\n5️⃣ 納品・公開 — テスト→本番リリース\n\n最短2週間での納品実績もございます。"
  }
  if (q.includes("納期") || q.includes("期間") || q.includes("どのくらい")) {
    return "納期の目安です。\n\n⏰ サービス別の目安：\n\n• ランディングページ: 1〜2週間\n• ホームページ（5P〜）: 3〜6週間\n• ECサイト: 4〜8週間\n• MEO対策: 初期設定1週間、効果実感1〜3ヶ月\n• SEO対策: 効果実感3〜6ヶ月\n\nお急ぎの場合は特急対応も可能です。無料相談でご相談ください。"
  }
  if (q.includes("修正") || q.includes("変更") || q.includes("追加")) {
    return "修正・変更について。\n\n🔄 柔軟に対応します：\n\n• 制作中の軽微な修正は何度でも無料\n• デザイン大幅変更は2回まで無料（3回目以降は別途見積）\n• 納品後3ヶ月以内のテキスト・画像差替えは無料\n• CMS付きサイトならお客様自身で更新可能\n• 保守プラン加入で月間修正対応\n\nご安心ください。"
  }
  if (q.includes("実績") || q.includes("事例") || q.includes("ポートフォリオ")) {
    return "実績についてですね。\n\n📊 これまでの主な実績：\n\n• 飲食店HP制作 — 予約数2倍\n• クリニックMEO対策 — 地域検索1位獲得\n• ECサイト構築 — 月商3倍達成\n• 美容室LP制作 — CVR 8.5%達成\n\n詳しくは paradigmjp.com/works をご覧ください。\n具体的な業種のご相談はお気軽にどうぞ。"
  }
  return "ご質問ありがとうございます。\n\nお問い合わせ内容を確認いたしました。より詳しい回答をお伝えするために、ページ上部の「15分オンライン相談」をご利用ください。\n\n画面共有をしながら、具体的にご案内いたします。\n\n📞 お急ぎの場合: info@paradigmjp.com\n📅 オンライン相談予約: ページ上部のCTAボタンから"
}
