import { NextRequest, NextResponse } from "next/server"

const DIFY_BASE = process.env.DIFY_BASE_URL || "https://dify.appexx.me"
const DIFY_API_KEY = process.env.DIFY_API_KEY || ""
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ""

const SYSTEM_PROMPT = `あなたはParadigm合同会社の公式AIアシスタントです。
誠実で親切な口調で、以下の知識をもとに正確・具体的に答えてください。

【会社概要】
会社名: Paradigm合同会社
所在地: 東京都
創業: 2022年
得意分野: ホームページ制作・LP・MEO対策・SEO/GEO・AI導入支援・ECサイト構築
特徴: 実績200社以上、継続率98%、格安×高品質×スピード納品
問い合わせ先: https://paradigmjp.com/contact（無料相談）
メール: info@paradigmjp.com

【料金・サービス一覧】
■ ホームページ制作
 - シンプルプラン (5P): ¥198,000〜（独自ドメイン・SSL・レスポンシブ対応）
 - スタンダード (10P): ¥350,000〜（CMS付き・ブログ機能・お問合せフォーム）
 - プレミアム (20P〜): ¥600,000〜（EC連携・予約システム・AI機能）
■ ランディングページ (LP)
 - ¥150,000〜¥400,000（SEO最適化・A/Bテスト対応）
■ MEO対策（Googleマップ集客）
 - 月額¥30,000〜¥80,000（Googleビジネスプロフィール最適化・口コミ管理・月次レポート）
 - 効果: 3ヶ月でマップ上位表示実績多数
■ SEO/GEO対策
 - 月額¥50,000〜¥200,000（コンテンツ制作・内部対策・AI検索最適化）
■ ECサイト構築
 - ¥500,000〜（Shopify/WooCommerce/カスタム）
■ AI導入支援
 - ¥200,000〜（チャットボット・業務自動化・AI集客）

【制作の流れ】
1. 無料相談（15分・オンライン可）
2. ヒアリング・お見積もり提出（3営業日以内）
3. デザイン制作・フィードバック
4. 開発・構築
5. テスト・修正
6. 納品・公開

【納期目安】
- LP: 1〜2週間
- ホームページ (5P): 2〜4週間
- ホームページ (10P〜): 4〜8週間
- ECサイト: 6〜10週間

【サポート・保守】
- 納品後3ヶ月間: 修正・相談無料
- 月額保守プラン: ¥10,000〜（セキュリティ・バックアップ・定期更新）
- 平日9:00〜18:00 チャット・メール対応
- 緊急対応（障害・サーバーダウン）は即日対応

【よくある質問】
Q: 分割払いは可能ですか？ A: はい、最大6回払いに対応しています。
Q: 既存サイトのリニューアルも対応？ A: はい、既存資産を活かしたリニューアルが得意です。
Q: 他社より安い？ A: 都内同水準のサービスと比較して20〜40%程度お安くご提供しています。
Q: 遠方でも対応？ A: 全国対応・オンライン打ち合わせのみでも制作可能です。

回答は200文字以内で簡潔に、日本語で。具体的な数字や料金を積極的に提示してください。`

async function callGemini(message: string, history?: { role: string; text: string }[]): Promise<string> {
  if (!GEMINI_API_KEY) return getFallbackAnswer(message)
  try {
    const contents: { role: string; parts: { text: string }[] }[] = []
    if (history && history.length > 0) {
      for (const h of history.slice(-4)) {
        contents.push({ role: h.role === "user" ? "user" : "model", parts: [{ text: h.text }] })
      }
    }
    contents.push({ role: "user", parts: [{ text: message }] })

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
          generationConfig: { maxOutputTokens: 400, temperature: 0.4 },
        }),
        signal: AbortSignal.timeout(10000),
      }
    )
    if (!res.ok) return getFallbackAnswer(message)
    const data = await res.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text || getFallbackAnswer(message)
  } catch {
    return getFallbackAnswer(message)
  }
}

export async function POST(req: NextRequest) {
  const { message, conversationId } = await req.json()
  if (!message?.trim()) return NextResponse.json({ error: "message required" }, { status: 400 })

  // Try Dify first if API key is set
  if (DIFY_API_KEY) {
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
        signal: AbortSignal.timeout(12000),
      })

      if (res.ok) {
        const data = await res.json()
        const answer = data.answer?.trim()
        if (answer && answer.length > 10) {
          return NextResponse.json({
            answer,
            conversation_id: data.conversation_id || null,
          })
        }
      }
    } catch {
      // Dify unavailable, fall through to Gemini
    }
  }

  // Gemini fallback
  const answer = await callGemini(message)
  return NextResponse.json({ answer, conversation_id: null })
}

function getFallbackAnswer(question: string): string {
  const q = question.toLowerCase()

  if (q.includes("見積") || q.includes("料金") || q.includes("費用") || q.includes("価格") || q.includes("いくら") || q.includes("cost") || q.includes("price")) {
    return "料金の目安です。\n\n💰 主なサービス料金：\n\n• HP制作（シンプル）: ¥198,000〜\n• HP制作（スタンダード）: ¥350,000〜\n• LP: ¥150,000〜\n• MEO対策: ¥30,000〜/月\n• SEO/GEO: ¥50,000〜/月\n• ECサイト: ¥500,000〜\n• AI導入支援: ¥200,000〜\n\n✅ 分割払い（最大6回）対応\n\n無料相談で正式お見積もりをご提示します → https://paradigmjp.com/contact"
  }

  if (q.includes("流れ") || q.includes("プロセス") || q.includes("ステップ") || q.includes("手順") || q.includes("どうやって")) {
    return "制作の流れです。\n\n📋 5ステップで完成：\n\n1️⃣ 無料相談（15分・オンライン可）\n2️⃣ お見積もり提出（3営業日以内）\n3️⃣ デザイン制作・フィードバック\n4️⃣ 開発・構築\n5️⃣ テスト・納品・公開\n\n全国対応・オンラインのみでもOKです。"
  }

  if (q.includes("納期") || q.includes("期間") || q.includes("どのくらい") || q.includes("何日") || q.includes("何週間") || q.includes("いつ")) {
    return "納期の目安です。\n\n⏰ サービス別標準納期：\n\n• LP: 1〜2週間\n• HP（5P）: 2〜4週間\n• HP（10P〜）: 4〜8週間\n• ECサイト: 6〜10週間\n• MEO初期設定: 約1週間\n\n急ぎの案件もご相談ください。"
  }

  if (q.includes("meo") || q.includes("googleマップ") || q.includes("地図") || q.includes("マップ") || q.includes("グーグル")) {
    return "MEO対策についてです！\n\n📍 Googleマップで上位表示を実現：\n\n• Googleビジネスプロフィール最適化\n• 写真・投稿の定期更新代行\n• 口コミ返信・評判管理\n• 競合調査・改善提案\n• 月次順位レポート\n\n💰 月額¥30,000〜でスタート\n効果: 3ヶ月で上位表示実績多数\n\nまずは現状の無料診断はこちら → https://paradigmjp.com/contact"
  }

  if (q.includes("seo") || q.includes("geo") || q.includes("検索") || q.includes("上位") || q.includes("順位") || q.includes("アクセス")) {
    return "SEO/GEO対策についてです！\n\n🔍 Google・AI検索で上位表示：\n\n• キーワード戦略立案\n• コンテンツ制作・最適化\n• 技術的SEO対策（表示速度等）\n• AI検索（Perplexity等）への最適化\n• 月次レポート提出\n\n💰 月額¥50,000〜\n\n無料相談 → https://paradigmjp.com/contact"
  }

  if (q.includes("サポート") || q.includes("保守") || q.includes("運用") || q.includes("after") || q.includes("アフター")) {
    return "サポート体制についてです。\n\n🛡️ 充実のサポート：\n\n• 納品後3ヶ月間: 修正・相談無料\n• 月額保守プラン: ¥10,000〜\n  （セキュリティ・バックアップ・更新）\n• 平日9:00〜18:00 チャット・メール対応\n• 緊急障害は即日対応\n\nCMS付きのサイトはご自身での更新も可能です。"
  }

  if (q.includes("修正") || q.includes("変更") || q.includes("更新") || q.includes("追加") || q.includes("リニューアル")) {
    return "修正・変更対応についてです。\n\n🔄 柔軟に対応します：\n\n• 制作中の修正: 2回まで無料\n• 納品後3ヶ月以内: テキスト修正は無料\n• CMS付きサイト: お客様ご自身で更新可\n• 既存サイトのリニューアルも得意\n\n大幅な変更は別途お見積もりとなります。"
  }

  if (q.includes("ai") || q.includes("人工知能") || q.includes("自動化") || q.includes("チャットボット") || q.includes("chatbot")) {
    return "AI導入支援についてです！\n\n🤖 主なAI活用サービス：\n\n• AIチャットボット（24時間自動応答）\n• 問い合わせ・集客の自動化\n• 業務フロー自動化（Excel作業等）\n• AI活用のSEO/コンテンツ制作\n• Dify・n8n等のAIツール導入\n\n💰 ¥200,000〜\n御社の課題に合わせてご提案します。\n\n無料相談 → https://paradigmjp.com/contact"
  }

  if (q.includes("ec") || q.includes("ショッピング") || q.includes("通販") || q.includes("ネットショップ") || q.includes("shopify") || q.includes("カート")) {
    return "ECサイト構築についてです！\n\n🛒 対応プラットフォーム：\n\n• Shopify（おすすめ・拡張性◎）\n• WooCommerce（WordPress連携）\n• フルカスタム開発\n\n💰 ¥500,000〜\n決済・在庫・配送管理まで対応\n\n無料相談で要件を確認します → https://paradigmjp.com/contact"
  }

  if (q.includes("会社") || q.includes("paradigm") || q.includes("パラダイム") || q.includes("実績") || q.includes("どんな会社")) {
    return "Paradigm合同会社についてです。\n\n🏢 会社概要：\n\n• 所在地: 東京都\n• 得意: Web制作・MEO・SEO・AI導入\n• 実績: 200社以上\n• 継続率: 98%（高品質の証）\n• 特徴: 格安×高品質×スピード納品\n\n全国対応・オンライン打ち合わせ可能\n\nご質問・相談はお気軽に → https://paradigmjp.com/contact"
  }

  if (q.includes("分割") || q.includes("後払い") || q.includes("支払い") || q.includes("払い")) {
    return "お支払いについてです。\n\n💳 柔軟な支払い対応：\n\n• 銀行振込・クレジットカード対応\n• 分割払い（最大6回）OK\n• 着手金50%→納品時50%が基本\n\n詳細はご相談ください → https://paradigmjp.com/contact"
  }

  if (q.includes("相談") || q.includes("問い合わせ") || q.includes("連絡") || q.includes("contact") || q.includes("申し込み")) {
    return "ご相談はいつでも歓迎です！\n\n📞 お問い合わせ方法：\n\n• 無料相談フォーム → https://paradigmjp.com/contact\n• メール: info@paradigmjp.com\n• 所要時間: 15〜30分\n• オンライン（Zoom/Google Meet）可\n\n👉 初回相談は完全無料・押し売りなしです。"
  }

  // default
  return "ご質問ありがとうございます！\n\nもう少し詳しく教えていただけると、より具体的にご回答できます。\n\n\uD83D\uDCAC 気になること：\n• 料金・見積もり\n• 制作の流れ・納期\n• MEO・SEO対策\n• AI導入支援\n• サポート体制\n\nまたは直接ご相談 → https://paradigmjp.com/contact\n📧 info@paradigmjp.com"
}
