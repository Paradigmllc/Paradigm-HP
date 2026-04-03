import { NextRequest, NextResponse } from "next/server"

const DIFY_BASE = process.env.DIFY_BASE_URL || "https://dify.appexx.me"
const DIFY_API_KEY = process.env.DIFY_API_KEY || ""

export async function POST(req: NextRequest) {
  const { message, conversationId } = await req.json()
  if (!message?.trim()) return NextResponse.json({ error: "message required" }, { status: 400 })

  if (!DIFY_API_KEY) {
    // APIキー未設定の場合はフォールバック回答を返す
    return NextResponse.json({ answer: getFallbackAnswer(message), conversation_id: null })
  }

  try {
    const body: Record<string, unknown> = {
      inputs: {},
      query: message,
      response_mode: "blocking",
      user: `visitor-${Date.now()}`,
    }
    if (conversationId) body.conversation_id = conversationId

    const res = await fetch(`${DIFY_BASE}/v1/chat-messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DIFY_API_KEY}`,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error("Dify API error:", res.status, err)
      return NextResponse.json({ answer: getFallbackAnswer(message), conversation_id: null })
    }

    const data = await res.json()
    return NextResponse.json({
      answer: data.answer || getFallbackAnswer(message),
      conversation_id: data.conversation_id || null,
    })
  } catch (e) {
    console.error("Dify fetch error:", e)
    return NextResponse.json({ answer: getFallbackAnswer(message), conversation_id: null })
  }
}

function getFallbackAnswer(question: string): string {
  const q = question.toLowerCase()
  if (q.includes("見積") || q.includes("料金") || q.includes("費用") || q.includes("価格")) {
    return "お見積もりについてですね。\n\n📋 主なサービス料金の目安：\n\n• ホームページ制作: ¥300,000〜¥800,000\n• ランディングページ: ¥150,000〜¥400,000\n• MEO対策: ¥30,000〜¥80,000/月\n• SEO/GEO対策: ¥50,000〜¥200,000/月\n• ECサイト構築: ¥500,000〜\n\n正式なお見積もりは無料相談にてご案内します。上部の「15分オンライン相談」からご予約ください。"
  }
  if (q.includes("サポート") || q.includes("保守") || q.includes("運用")) {
    return "サポート体制についてですね。\n\n🛡️ 安心のサポート体制：\n\n• 納品後3ヶ月間は無料修正対応\n• 月額保守プラン（¥10,000〜）で継続サポート\n• 平日9:00-18:00のチャット・メール対応\n• 緊急時は24時間以内に対応\n\nまずは無料相談でご説明いたします。"
  }
  if (q.includes("流れ") || q.includes("プロセス") || q.includes("ステップ")) {
    return "制作の流れをご説明します。\n\n📋 5ステップで完成：\n\n1️⃣ 無料相談（15分）— ご要望のヒアリング\n2️⃣ お見積もり・ご提案 — 1〜3営業日\n3️⃣ デザイン制作 — ラフ→確定\n4️⃣ 開発・構築 — 2〜4週間\n5️⃣ 納品・公開\n\n最短2週間での納品実績もございます。"
  }
  if (q.includes("納期") || q.includes("期間") || q.includes("どのくらい")) {
    return "納期の目安です。\n\n⏰ サービス別の目安：\n\n• ランディングページ: 1〜2週間\n• ホームページ（5P〜）: 3〜6週間\n• ECサイト: 4〜8週間\n• MEO対策: 初期設定1週間、効果実感1〜3ヶ月\n\nお急ぎの場合は特急対応も可能です。"
  }
  if (q.includes("修正") || q.includes("変更") || q.includes("追加")) {
    return "修正・変更について。\n\n🔄 柔軟に対応します：\n\n• 制作中の修正は2回まで無料\n• 納品後3ヶ月以内のテキスト差替えは無料\n• CMS付きサイトはお客様自身で更新可能\n\nご安心ください。"
  }
  if (q.includes("ai") || q.includes("人工知能") || q.includes("chatgpt") || q.includes("自動化")) {
    return "AI導入支援についてですね！\n\n🤖 主なAI活用例：\n\n• チャットボット（24時間自動応答）\n• AI集客・営業自動化\n• 業務フロー自動化（n8n/Dify）\n• SEO/GEO最適化（AI検索対策）\n\n御社の業務に合わせた提案をいたします。無料相談でご相談ください。"
  }
  return "ご質問ありがとうございます。\n\nより詳しい回答をお伝えするために、ページ上部の「15分オンライン相談」をご利用ください。\n\n画面共有をしながら具体的にご案内いたします。\n\n📧 メール: info@paradigmjp.com"
}
