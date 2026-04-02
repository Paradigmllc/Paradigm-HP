import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

function getDB() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
}

// 提案ページ用 — get_prospectアクションのみ対応
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, slug, id } = body

    if (action !== "get_prospect") {
      return NextResponse.json({ error: "このAPIはget_prospectのみ対応" }, { status: 400 })
    }

    const db = getDB()
    if (!db) return NextResponse.json({ error: "DB未設定" }, { status: 500 })

    // prospect取得
    let query = db.from("prospects").select("*")
    if (slug) query = query.eq("slug", slug)
    else if (id) query = query.eq("id", id)
    else return NextResponse.json({ error: "slug or id required" }, { status: 400 })

    const { data: prospect, error } = await query.single()
    if (error || !prospect) return NextResponse.json({ error: "見つかりません" }, { status: 404 })

    // テンプレート取得
    let template = {}
    if (prospect.template_id) {
      const { data: tpl } = await db.from("proposal_templates").select("*").eq("id", prospect.template_id).single()
      if (tpl) template = tpl
    }

    // デモHTML取得
    let demo_html = ""
    if (prospect.demo_data?.demo_id) {
      const { data: demo } = await db.from("web_demos").select("html_content").eq("id", prospect.demo_data.demo_id).single()
      if (demo?.html_content) demo_html = demo.html_content
    }

    // パターンマッチング
    let matched_pattern = null
    if (prospect.pattern_id) {
      const { data: pat } = await db.from("prospect_patterns").select("*").eq("id", prospect.pattern_id).single()
      if (pat) matched_pattern = pat
    }

    // 閲覧カウントUP
    await db.from("prospects").update({
      view_count: (prospect.view_count || 0) + 1,
      last_viewed_at: new Date().toISOString(),
    }).eq("id", prospect.id)

    return NextResponse.json({ prospect, template, demo_html, matched_pattern })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
