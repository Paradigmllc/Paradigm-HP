import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, company, email, phone, services, message, budget } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: "必須項目が入力されていません" }, { status: 400 })
    }

    // 1. Slack通知（appexx.me経由）
    const slackText = [
      "📩 *paradigmjp.com お問い合わせ*",
      `*お名前:* ${name}`,
      company ? `*会社名:* ${company}` : null,
      `*メール:* ${email}`,
      phone ? `*電話:* ${phone}` : null,
      services?.length ? `*興味のあるサービス:* ${services.join(", ")}` : null,
      budget ? `*ご予算:* ${budget}` : null,
      `*ご相談内容:*\n${message}`,
    ].filter(Boolean).join("\n")

    // Try Slack via appexx.me API
    try {
      await fetch("https://appexx.me/api/studio/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: "#all-paradigm",
          text: slackText,
        }),
      })
    } catch {
      // Slack notification is best-effort
    }

    // 2. Supabase保存（リード化）
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (supabaseUrl && supabaseKey) {
      try {
        await fetch(`${supabaseUrl}/rest/v1/leads`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            business_name: company || name,
            email,
            phone: phone || null,
            country: "JP",
            industry: services?.[0] || "問い合わせ",
            pipeline_stage: "inbound",
            source: "paradigmjp.com",
            meta: { contact_form: { name, company, services, message, budget, submitted_at: new Date().toISOString() } },
          }),
        })
      } catch {
        // DB save is best-effort
      }
    }

    return NextResponse.json({ success: true, message: "お問い合わせを受け付けました。1営業日以内にご連絡いたします。" })
  } catch {
    return NextResponse.json({ error: "送信に失敗しました。しばらく後にお試しください。" }, { status: 500 })
  }
}
