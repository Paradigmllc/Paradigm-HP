"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  DollarSign,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  Star,
} from "lucide-react";

interface PricingPlan {
  id: string;
  service_id: string;
  service_title?: string;
  plan_name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  is_popular: boolean;
  monthly_note: string;
}

export default function PricingPage() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<PricingPlan>>({});
  const [saving, setSaving] = useState(false);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "list_pricing" }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPlans(data.plans || data || []);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "料金プランの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const startEdit = (plan: PricingPlan) => {
    setEditingId(plan.id);
    setForm({ ...plan, features: plan.features || [] });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_pricing", ...form }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      toast.success("料金プランを更新しました");
      setEditingId(null);
      fetchPlans();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "保存に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  const updateFeature = (index: number, value: string) => {
    setForm((prev) => {
      const arr = [...(prev.features || [])];
      arr[index] = value;
      return { ...prev, features: arr };
    });
  };

  const addFeature = () => {
    setForm((prev) => ({ ...prev, features: [...(prev.features || []), ""] }));
  };

  const removeFeature = (index: number) => {
    setForm((prev) => ({
      ...prev,
      features: (prev.features || []).filter((_, i) => i !== index),
    }));
  };

  // Group by service
  const grouped = plans.reduce<Record<string, PricingPlan[]>>((acc, plan) => {
    const key = plan.service_title || plan.service_id || "その他";
    if (!acc[key]) acc[key] = [];
    acc[key].push(plan);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">料金管理</h1>

      {Object.entries(grouped).map(([serviceTitle, servicePlans]) => (
        <div key={serviceTitle} className="mb-8">
          <h2 className="text-lg font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-indigo-500" />
            {serviceTitle}
          </h2>
          <div className="space-y-3">
            {servicePlans.map((plan) => (
              <motion.div
                key={plan.id}
                layout
                className="bg-white rounded-xl border border-slate-200 overflow-hidden"
              >
                {editingId === plan.id ? (
                  <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-900">プラン編集</h3>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">プラン名</label>
                        <input
                          value={form.plan_name || ""}
                          onChange={(e) => setForm((p) => ({ ...p, plan_name: e.target.value }))}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">価格</label>
                        <input
                          value={form.price || ""}
                          onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                          placeholder="¥50,000"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">期間</label>
                        <input
                          value={form.period || ""}
                          onChange={(e) => setForm((p) => ({ ...p, period: e.target.value }))}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                          placeholder="/月"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">説明</label>
                      <textarea
                        value={form.description || ""}
                        onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                        rows={2}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">月額注記</label>
                      <input
                        value={form.monthly_note || ""}
                        onChange={(e) => setForm((p) => ({ ...p, monthly_note: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        placeholder="※初期費用別途"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setForm((p) => ({ ...p, is_popular: !p.is_popular }))}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition ${
                          form.is_popular
                            ? "bg-amber-50 border-amber-200 text-amber-700"
                            : "bg-white border-slate-200 text-slate-500"
                        }`}
                      >
                        <Star className={`w-4 h-4 ${form.is_popular ? "fill-amber-500" : ""}`} />
                        人気プラン
                      </button>
                    </div>

                    {/* Features */}
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-2">機能一覧</label>
                      <div className="space-y-2">
                        {(form.features || []).map((f, i) => (
                          <div key={i} className="flex gap-2">
                            <input
                              value={f}
                              onChange={(e) => updateFeature(i, e.target.value)}
                              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            />
                            <button
                              onClick={() => removeFeature(i)}
                              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={addFeature}
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
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-slate-900">{plan.plan_name}</p>
                          {plan.is_popular && (
                            <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs rounded-full font-medium">
                              人気
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-indigo-600 font-semibold mt-0.5">
                          {plan.price}
                          <span className="text-slate-400 font-normal">{plan.period}</span>
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => startEdit(plan)}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition shrink-0"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      ))}

      {plans.length === 0 && (
        <div className="text-center py-12 text-slate-500 text-sm">料金プランが登録されていません</div>
      )}
    </div>
  );
}
