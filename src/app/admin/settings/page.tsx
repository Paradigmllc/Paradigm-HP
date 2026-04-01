"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Settings, Save, Plus, Trash2, RefreshCw } from "lucide-react";

interface Setting {
  key: string;
  value: string;
}

const DEFAULT_KEYS = [
  { key: "site_name", label: "サイト名" },
  { key: "site_description", label: "サイト説明" },
  { key: "contact_email", label: "連絡先メール" },
  { key: "phone", label: "電話番号" },
  { key: "address", label: "住所" },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get_settings" }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const raw: Record<string, string> = data.settings || data || {};

      // Merge default keys
      const merged = [...DEFAULT_KEYS.map((d) => ({ key: d.key, value: raw[d.key] || "" }))];
      // Add any extra keys from server
      Object.entries(raw).forEach(([k, v]) => {
        if (!merged.find((m) => m.key === k)) {
          merged.push({ key: k, value: v as string });
        }
      });

      setSettings(merged);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "設定の取得に失敗しました");
      // Fallback to defaults
      setSettings(DEFAULT_KEYS.map((d) => ({ key: d.key, value: "" })));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (key: string, value: string) => {
    setSavingKey(key);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save_setting", key, value }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      toast.success(`「${getLabel(key)}」を保存しました`);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "保存に失敗しました");
    } finally {
      setSavingKey(null);
    }
  };

  const updateValue = (key: string, value: string) => {
    setSettings((prev) => prev.map((s) => (s.key === key ? { ...s, value } : s)));
  };

  const addSetting = () => {
    if (!newKey.trim()) {
      toast.error("キーを入力してください");
      return;
    }
    if (settings.find((s) => s.key === newKey.trim())) {
      toast.error("このキーは既に存在します");
      return;
    }
    setSettings((prev) => [...prev, { key: newKey.trim(), value: newValue }]);
    setNewKey("");
    setNewValue("");
    toast.success("設定項目を追加しました。保存ボタンで確定してください");
  };

  const removeSetting = (key: string) => {
    if (DEFAULT_KEYS.find((d) => d.key === key)) {
      toast.error("デフォルト設定は削除できません");
      return;
    }
    setSettings((prev) => prev.filter((s) => s.key !== key));
    toast.success("設定項目を削除しました");
  };

  const getLabel = (key: string) => DEFAULT_KEYS.find((d) => d.key === key)?.label || key;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">設定</h1>
        <button
          onClick={fetchSettings}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition"
        >
          <RefreshCw className="w-4 h-4" />
          更新
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
        {settings.map((setting, index) => {
          const isDefault = DEFAULT_KEYS.find((d) => d.key === setting.key);
          return (
            <motion.div
              key={setting.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="p-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-slate-700">{getLabel(setting.key)}</label>
                    <span className="text-xs text-slate-400 font-mono">{setting.key}</span>
                  </div>
                  {setting.key === "address" || setting.key === "site_description" ? (
                    <textarea
                      value={setting.value}
                      onChange={(e) => updateValue(setting.key, e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                    />
                  ) : (
                    <input
                      value={setting.value}
                      onChange={(e) => updateValue(setting.key, e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                  )}
                </div>
                <div className="flex items-center gap-1 pt-7">
                  <button
                    onClick={() => handleSave(setting.key, setting.value)}
                    disabled={savingKey === setting.key}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition disabled:opacity-50"
                    title="保存"
                  >
                    <Save className={`w-4 h-4 ${savingKey === setting.key ? "animate-pulse" : ""}`} />
                  </button>
                  {!isDefault && (
                    <button
                      onClick={() => removeSetting(setting.key)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="削除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add new setting */}
      <div className="mt-6 bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <Settings className="w-4 h-4" />
          カスタム設定の追加
        </h3>
        <div className="flex gap-3 flex-col sm:flex-row">
          <input
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            placeholder="キー (例: twitter_url)"
            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          />
          <input
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="値"
            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          />
          <button
            onClick={addSetting}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            追加
          </button>
        </div>
      </div>
    </div>
  );
}
