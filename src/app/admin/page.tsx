"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  FileText,
  Briefcase,
  HelpCircle,
  Users,
  TrendingUp,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

interface Stats {
  posts: number;
  services: number;
  faqs: number;
  leads: number;
}

const STAT_CARDS = [
  { key: "posts" as const, label: "ブログ記事", icon: FileText, color: "bg-blue-500", href: "/admin/posts" },
  { key: "services" as const, label: "サービス", icon: Briefcase, color: "bg-indigo-500", href: "/admin/services" },
  { key: "faqs" as const, label: "FAQ", icon: HelpCircle, color: "bg-emerald-500", href: "/admin/faqs" },
  { key: "leads" as const, label: "問い合わせ", icon: Users, color: "bg-rose-500", href: "/admin/leads" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "dashboard_stats" }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setStats(data);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "統計の取得に失敗しました";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">ダッシュボード</h1>
          <p className="text-sm text-slate-500 mt-1">サイト全体の概要</p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          更新
        </button>
      </div>

      {/* Stat cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {STAT_CARDS.map((card) => (
          <motion.div key={card.key} variants={item}>
            <Link
              href={card.href}
              className="block bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition group"
            >
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center`}>
                  <card.icon className="w-5 h-5 text-white" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition" />
              </div>
              <div className="mt-4">
                {loading ? (
                  <div className="h-8 w-16 bg-slate-100 rounded animate-pulse" />
                ) : (
                  <p className="text-3xl font-bold text-slate-900">{stats?.[card.key] ?? 0}</p>
                )}
                <p className="text-sm text-slate-500 mt-1">{card.label}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl border border-slate-200 p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-slate-900">クイックアクション</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "新規ブログ作成", href: "/admin/posts", color: "text-blue-600 bg-blue-50 hover:bg-blue-100" },
            { label: "FAQ追加", href: "/admin/faqs", color: "text-emerald-600 bg-emerald-50 hover:bg-emerald-100" },
            { label: "リード確認", href: "/admin/leads", color: "text-rose-600 bg-rose-50 hover:bg-rose-100" },
          ].map((a) => (
            <Link
              key={a.label}
              href={a.href}
              className={`px-4 py-3 rounded-lg text-sm font-medium text-center transition ${a.color}`}
            >
              {a.label}
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
