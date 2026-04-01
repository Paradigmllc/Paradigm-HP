"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Award,
  ArrowLeft,
} from "lucide-react";

interface Metric {
  label: string;
  value: string;
  suffix: string;
}

interface Work {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  challenge: string;
  solution: string;
  tags: string;
  color: string;
  metrics: Metric[];
  created_at: string;
}

const COLORS = [
  { value: "indigo", label: "Indigo", bg: "bg-indigo-500" },
  { value: "emerald", label: "Emerald", bg: "bg-emerald-500" },
  { value: "amber", label: "Amber", bg: "bg-amber-500" },
  { value: "purple", label: "Purple", bg: "bg-purple-500" },
  { value: "blue", label: "Blue", bg: "bg-blue-500" },
  { value: "rose", label: "Rose", bg: "bg-rose-500" },
];

const EMPTY_WORK: Omit<Work, "id" | "created_at"> = {
  slug: "",
  title: "",
  subtitle: "",
  description: "",
  challenge: "",
  solution: "",
  tags: "",
  color: "indigo",
  metrics: [],
};

const EMPTY_METRIC: Metric = { label: "", value: "", suffix: "" };

export default function WorksPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"list" | "edit">("list");
  const [form, setForm] = useState<Omit<Work, "id" | "created_at"> & { id?: string }>(EMPTY_WORK);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchWorks = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "list_works" }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setWorks(data.works || data || []);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "実績の取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorks();
  }, []);

  const handleSave = async () => {
    if (!form.title || !form.slug) {
      toast.error("タイトルとスラッグは必須です");
      return;
    }
    setSaving(true);
    try {
      const action = form.id ? "update_work" : "create_work";
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...form }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      toast.success(form.id ? "実績を更新しました" : "実績を作成しました");
      setMode("list");
      fetchWorks();
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
        body: JSON.stringify({ action: "delete_work", id }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      toast.success("実績を削除しました");
      setDeleteConfirm(null);
      fetchWorks();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "削除に失敗しました");
    }
  };

  const openEdit = (work?: Work) => {
    if (work) {
      setForm({ ...work, metrics: work.metrics || [] });
    } else {
      setForm({ ...EMPTY_WORK, metrics: [] });
    }
    setMode("edit");
  };

  const updateMetric = (index: number, field: keyof Metric, value: string) => {
    setForm((prev) => {
      const metrics = [...prev.metrics];
      metrics[index] = { ...metrics[index], [field]: value };
      return { ...prev, metrics };
    });
  };

  // --- Edit mode ---
  if (mode === "edit") {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setMode("list")}
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            一覧に戻る
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "保存中..." : "保存"}
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <h3 className="font-semibold text-slate-900">{form.id ? "実績編集" : "新規実績"}</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">タイトル</label>
              <input
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">スラッグ</label>
              <input
                value={form.slug}
                onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">サブタイトル</label>
            <input
              value={form.subtitle}
              onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">説明</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">課題</label>
            <textarea
              value={form.challenge}
              onChange={(e) => setForm((p) => ({ ...p, challenge: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">解決策</label>
            <textarea
              value={form.solution}
              onChange={(e) => setForm((p) => ({ ...p, solution: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">タグ (カンマ区切り)</label>
            <input
              value={form.tags}
              onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              placeholder="Web制作, SEO, デザイン"
            />
          </div>

          {/* Color picker */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-2">カラー</label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setForm((p) => ({ ...p, color: c.value }))}
                  className={`w-8 h-8 rounded-full ${c.bg} transition ring-2 ring-offset-2 ${
                    form.color === c.value ? "ring-indigo-500" : "ring-transparent"
                  }`}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* Metrics editor */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-2">成果指標</label>
            <div className="space-y-2">
              {form.metrics.map((m, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <input
                    value={m.label}
                    onChange={(e) => updateMetric(i, "label", e.target.value)}
                    placeholder="ラベル"
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                  <input
                    value={m.value}
                    onChange={(e) => updateMetric(i, "value", e.target.value)}
                    placeholder="値"
                    className="w-24 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                  <input
                    value={m.suffix}
                    onChange={(e) => updateMetric(i, "suffix", e.target.value)}
                    placeholder="単位"
                    className="w-20 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                  <button
                    onClick={() =>
                      setForm((p) => ({
                        ...p,
                        metrics: p.metrics.filter((_, idx) => idx !== i),
                      }))
                    }
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() =>
                  setForm((p) => ({ ...p, metrics: [...p.metrics, { ...EMPTY_METRIC }] }))
                }
                className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700"
              >
                <Plus className="w-3 h-3" /> 指標を追加
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- List mode ---
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">実績管理</h1>
        <button
          onClick={() => openEdit()}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus className="w-4 h-4" />
          新規作成
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : works.length === 0 ? (
        <div className="text-center py-12">
          <Award className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">実績がありません</p>
        </div>
      ) : (
        <div className="space-y-3">
          {works.map((work) => {
            const colorClass = COLORS.find((c) => c.value === work.color)?.bg || "bg-indigo-500";
            return (
              <motion.div
                key={work.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-slate-200 p-5 flex items-center justify-between"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-3 h-10 rounded-full ${colorClass} shrink-0`} />
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 truncate">{work.title}</p>
                    <p className="text-xs text-slate-500 truncate">{work.subtitle}</p>
                    {work.tags && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {work.tags.split(",").slice(0, 3).map((t) => (
                          <span key={t} className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-full">
                            {t.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => openEdit(work)}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(work.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

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
              <h3 className="text-lg font-semibold text-slate-900 mb-2">実績を削除</h3>
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
