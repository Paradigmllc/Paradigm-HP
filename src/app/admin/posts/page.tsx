"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  ArrowLeft,
  Save,
  FileText,
  X,
} from "lucide-react";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string;
  read_time: number;
  status: string;
  created_at: string;
}

const EMPTY_POST: Omit<Post, "id" | "created_at"> = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  category: "",
  tags: "",
  read_time: 5,
  status: "draft",
};

function simpleMarkdown(md: string): string {
  let html = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  html = html.replace(/^### (.+)$/gm, "<h3 class='text-lg font-semibold mt-4 mb-2'>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2 class='text-xl font-bold mt-6 mb-3'>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1 class='text-2xl font-bold mt-6 mb-3'>$1</h1>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(/`(.+?)`/g, "<code class='bg-slate-100 px-1.5 py-0.5 rounded text-sm'>$1</code>");
  html = html.replace(/^- (.+)$/gm, "<li class='ml-4 list-disc'>$1</li>");
  html = html.replace(/\n\n/g, "<br/><br/>");
  return html;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"list" | "edit">("list");
  const [editing, setEditing] = useState<Omit<Post, "id" | "created_at"> & { id?: string }>(EMPTY_POST);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "draft" | "published">("all");
  const [showPreview, setShowPreview] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "list_posts" }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPosts(data.posts || data || []);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "記事の取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      if (filterStatus !== "all" && p.status !== filterStatus) return false;
      if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.category.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [posts, search, filterStatus]);

  const handleSave = async () => {
    if (!editing.title || !editing.slug) {
      toast.error("タイトルとスラッグは必須です");
      return;
    }
    setSaving(true);
    try {
      const action = editing.id ? "update_post" : "create_post";
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...editing }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      toast.success(editing.id ? "記事を更新しました" : "記事を作成しました");
      setMode("list");
      fetchPosts();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "保存に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_post", id }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      toast.success("記事を削除しました");
      setDeleteConfirm(null);
      fetchPosts();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "削除に失敗しました");
    }
  };

  const openEdit = async (post?: Post) => {
    if (post) {
      setEditing({ ...post });
    } else {
      setEditing({ ...EMPTY_POST });
    }
    setShowPreview(false);
    setMode("edit");
  };

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]+/g, "-")
      .replace(/^-|-$/g, "");

  // --- Edit mode ---
  if (mode === "edit") {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setMode("list")}
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            一覧に戻る
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition"
            >
              <Eye className="w-4 h-4" />
              {showPreview ? "エディタ" : "プレビュー"}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? "保存中..." : "保存"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
              <h3 className="font-semibold text-slate-900">基本情報</h3>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">タイトル</label>
                <input
                  value={editing.title}
                  onChange={(e) => {
                    setEditing((prev) => ({
                      ...prev,
                      title: e.target.value,
                      slug: prev.slug || slugify(e.target.value),
                    }));
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="記事タイトル"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">スラッグ</label>
                <input
                  value={editing.slug}
                  onChange={(e) => setEditing((prev) => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="url-slug"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">概要</label>
                <textarea
                  value={editing.excerpt}
                  onChange={(e) => setEditing((prev) => ({ ...prev, excerpt: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                  placeholder="記事の概要"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">カテゴリ</label>
                  <input
                    value={editing.category}
                    onChange={(e) => setEditing((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    placeholder="Web制作"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">読了時間(分)</label>
                  <input
                    type="number"
                    min={1}
                    value={editing.read_time}
                    onChange={(e) => setEditing((prev) => ({ ...prev, read_time: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">タグ (カンマ区切り)</label>
                <input
                  value={editing.tags}
                  onChange={(e) => setEditing((prev) => ({ ...prev, tags: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="Next.js, SEO, デザイン"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">ステータス</label>
                <select
                  value={editing.status}
                  onChange={(e) => setEditing((prev) => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="draft">下書き</option>
                  <option value="published">公開</option>
                </select>
              </div>
            </div>
          </div>

          {/* Content / Preview */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900 mb-3">
              {showPreview ? "プレビュー" : "本文 (Markdown)"}
            </h3>
            {showPreview ? (
              <div
                className="prose prose-sm max-w-none min-h-[400px] text-slate-700"
                dangerouslySetInnerHTML={{ __html: simpleMarkdown(editing.content) }}
              />
            ) : (
              <textarea
                value={editing.content}
                onChange={(e) => setEditing((prev) => ({ ...prev, content: e.target.value }))}
                rows={20}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-y min-h-[400px]"
                placeholder="# 見出し&#10;&#10;本文を入力..."
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- List mode ---
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-900">ブログ管理</h1>
        <button
          onClick={() => openEdit()}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus className="w-4 h-4" />
          新規作成
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="タイトル・カテゴリで検索..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "published", "draft"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-2 text-sm rounded-lg border transition ${
                filterStatus === s
                  ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {s === "all" ? "すべて" : s === "published" ? "公開" : "下書き"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-slate-500 mt-3">読み込み中...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">記事がありません</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left px-4 py-3 font-medium text-slate-500">タイトル</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 hidden sm:table-cell">カテゴリ</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500">ステータス</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 hidden md:table-cell">作成日</th>
                  <th className="text-right px-4 py-3 font-medium text-slate-500">操作</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((post) => (
                    <motion.tr
                      key={post.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-slate-50 hover:bg-slate-50/50 transition"
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900 truncate max-w-[240px]">{post.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">/{post.slug}</p>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-slate-600">{post.category || "-"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                            post.status === "published"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {post.status === "published" ? "公開" : "下書き"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 hidden md:table-cell">
                        {post.created_at ? new Date(post.created_at).toLocaleDateString("ja-JP") : "-"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(post)}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            title="編集"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(post.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="削除"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-2">記事を削除</h3>
              <p className="text-sm text-slate-500 mb-6">この操作は取り消せません。本当に削除しますか?</p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                >
                  キャンセル
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  削除する
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
