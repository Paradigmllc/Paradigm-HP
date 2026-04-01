"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Briefcase, Edit3, Save, X, Plus, Trash2 } from "lucide-react";

interface Service {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  features: string[];
  results: string[];
  icon: string;
  color: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Service>>({});
  const [saving, setSaving] = useState(false);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "list_services" }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setServices(data.services || data || []);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "サービスの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const startEdit = (svc: Service) => {
    setEditingId(svc.id);
    setForm({
      ...svc,
      features: svc.features || [],
      results: svc.results || [],
    });
  };

  const handleSave = async () => {
    if (!form.title) {
      toast.error("タイトルは必須です");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_service", ...form }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      toast.success("サービスを更新しました");
      setEditingId(null);
      fetchServices();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "保存に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  const updateArrayItem = (field: "features" | "results", index: number, value: string) => {
    setForm((prev) => {
      const arr = [...(prev[field] as string[] || [])];
      arr[index] = value;
      return { ...prev, [field]: arr };
    });
  };

  const addArrayItem = (field: "features" | "results") => {
    setForm((prev) => ({
      ...prev,
      [field]: [...(prev[field] as string[] || []), ""],
    }));
  };

  const removeArrayItem = (field: "features" | "results", index: number) => {
    setForm((prev) => ({
      ...prev,
      [field]: (prev[field] as string[] || []).filter((_, i) => i !== index),
    }));
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
      <h1 className="text-2xl font-bold text-slate-900 mb-6">サービス管理</h1>

      <div className="space-y-4">
        {services.map((svc) => (
          <motion.div
            key={svc.id}
            layout
            className="bg-white rounded-xl border border-slate-200 overflow-hidden"
          >
            {editingId === svc.id ? (
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">サービス編集</h3>
                  <button
                    onClick={() => setEditingId(null)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">タイトル</label>
                    <input
                      value={form.title || ""}
                      onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">キャッチフレーズ</label>
                    <input
                      value={form.tagline || ""}
                      onChange={(e) => setForm((p) => ({ ...p, tagline: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">説明</label>
                  <textarea
                    value={form.description || ""}
                    onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">アイコン</label>
                    <input
                      value={form.icon || ""}
                      onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      placeholder="Globe, Search, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">カラー</label>
                    <input
                      value={form.color || ""}
                      onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      placeholder="indigo"
                    />
                  </div>
                </div>

                {/* Features editor */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-2">特徴</label>
                  <div className="space-y-2">
                    {(form.features || []).map((f, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          value={f}
                          onChange={(e) => updateArrayItem("features", i, e.target.value)}
                          className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                        <button
                          onClick={() => removeArrayItem("features", i)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addArrayItem("features")}
                      className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700"
                    >
                      <Plus className="w-3 h-3" /> 追加
                    </button>
                  </div>
                </div>

                {/* Results editor */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-2">実績数値</label>
                  <div className="space-y-2">
                    {(form.results || []).map((r, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          value={r}
                          onChange={(e) => updateArrayItem("results", i, e.target.value)}
                          className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                        <button
                          onClick={() => removeArrayItem("results", i)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addArrayItem("results")}
                      className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700"
                    >
                      <Plus className="w-3 h-3" /> 追加
                    </button>
                  </div>
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
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 truncate">{svc.title}</p>
                    <p className="text-xs text-slate-500 truncate">{svc.tagline}</p>
                  </div>
                </div>
                <button
                  onClick={() => startEdit(svc)}
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition shrink-0"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        ))}

        {services.length === 0 && (
          <div className="text-center py-12 text-slate-500 text-sm">サービスが登録されていません</div>
        )}
      </div>
    </div>
  );
}
