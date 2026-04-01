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
  ChevronUp,
  ChevronDown,
  HelpCircle,
  GripVertical,
} from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
}

const EMPTY_FAQ = { question: "", answer: "", category: "" };

export default function FaqsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Partial<FAQ>>(EMPTY_FAQ);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "list_faqs" }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const list = data.faqs || data || [];
      setFaqs(list.sort((a: FAQ, b: FAQ) => (a.sort_order ?? 0) - (b.sort_order ?? 0)));
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "FAQの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleSave = async () => {
    if (!form.question || !form.answer) {
      toast.error("質問と回答は必須です");
      return;
    }
    setSaving(true);
    try {
      const action = creating ? "create_faq" : "update_faq";
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...form }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      toast.success(creating ? "FAQを作成しました" : "FAQを更新しました");
      setEditingId(null);
      setCreating(false);
      setForm(EMPTY_FAQ);
      fetchFaqs();
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
        body: JSON.stringify({ action: "delete_faq", id }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      toast.success("FAQを削除しました");
      setDeleteConfirm(null);
      fetchFaqs();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "削除に失敗しました");
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const newFaqs = [...faqs];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newFaqs.length) return;

    [newFaqs[index], newFaqs[swapIndex]] = [newFaqs[swapIndex], newFaqs[index]];
    setFaqs(newFaqs);

    try {
      const ids = newFaqs.map((f) => f.id);
      await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reorder_faqs", ids }),
      });
      toast.success("並び順を更新しました");
    } catch {
      toast.error("並び替えに失敗しました");
      fetchFaqs();
    }
  };

  const startEdit = (faq: FAQ) => {
    setCreating(false);
    setEditingId(faq.id);
    setForm({ ...faq });
  };

  const startCreate = () => {
    setEditingId(null);
    setCreating(true);
    setForm({ ...EMPTY_FAQ });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setCreating(false);
    setForm(EMPTY_FAQ);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">FAQ管理</h1>
        <button
          onClick={startCreate}
          disabled={creating}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          新規作成
        </button>
      </div>

      {/* Create form */}
      <AnimatePresence>
        {creating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="bg-white rounded-xl border border-indigo-200 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">新規FAQ</h3>
                <button onClick={cancelEdit} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">質問</label>
                <input
                  value={form.question || ""}
                  onChange={(e) => setForm((p) => ({ ...p, question: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="よくある質問を入力"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">回答</label>
                <textarea
                  value={form.answer || ""}
                  onChange={(e) => setForm((p) => ({ ...p, answer: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                  placeholder="回答を入力"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">カテゴリ</label>
                <input
                  value={form.category || ""}
                  onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="一般"
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "保存中..." : "作成"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAQ list */}
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <motion.div
            key={faq.id}
            layout
            className="bg-white rounded-xl border border-slate-200 overflow-hidden"
          >
            {editingId === faq.id ? (
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">FAQ編集</h3>
                  <button onClick={cancelEdit} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">質問</label>
                  <input
                    value={form.question || ""}
                    onChange={(e) => setForm((p) => ({ ...p, question: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">回答</label>
                  <textarea
                    value={form.answer || ""}
                    onChange={(e) => setForm((p) => ({ ...p, answer: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">カテゴリ</label>
                  <input
                    value={form.category || ""}
                    onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? "保存中..." : "保存"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-5 flex items-start gap-3">
                <div className="flex flex-col items-center gap-1 shrink-0 pt-1">
                  <GripVertical className="w-4 h-4 text-slate-300" />
                  <button
                    onClick={() => handleMove(index, "up")}
                    disabled={index === 0}
                    className="p-1 text-slate-300 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleMove(index, "down")}
                    disabled={index === faqs.length - 1}
                    className="p-1 text-slate-300 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900">{faq.question}</p>
                      <p className="text-sm text-slate-500 mt-1 line-clamp-2">{faq.answer}</p>
                      {faq.category && (
                        <span className="inline-block mt-2 px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-full">
                          {faq.category}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => startEdit(faq)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(faq.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ))}

        {faqs.length === 0 && (
          <div className="text-center py-12">
            <HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">FAQがありません</p>
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
              <h3 className="text-lg font-semibold text-slate-900 mb-2">FAQを削除</h3>
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
