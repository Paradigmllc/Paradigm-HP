"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Users,
  Search,
  Mail,
  Building2,
  MessageSquare,
  Clock,
  ChevronDown,
  ExternalLink,
} from "lucide-react";

interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  message: string;
  status: string;
  pipeline_stage: string;
  created_at: string;
}

const STAGES = [
  { value: "new", label: "新規", color: "bg-blue-100 text-blue-700" },
  { value: "contacted", label: "接触済", color: "bg-indigo-100 text-indigo-700" },
  { value: "qualified", label: "適格", color: "bg-emerald-100 text-emerald-700" },
  { value: "proposal", label: "提案中", color: "bg-amber-100 text-amber-700" },
  { value: "won", label: "成約", color: "bg-green-100 text-green-800" },
  { value: "lost", label: "失注", color: "bg-red-100 text-red-700" },
];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "list_leads" }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setLeads(data.leads || data || []);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "リードの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const updateStatus = async (id: string, pipeline_stage: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_lead_status", id, pipeline_stage }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      toast.success("ステータスを更新しました");
      setLeads((prev) =>
        prev.map((l) => (l.id === id ? { ...l, pipeline_stage, status: pipeline_stage } : l))
      );
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "更新に失敗しました");
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      const stage = l.pipeline_stage || l.status || "new";
      if (filterStage !== "all" && stage !== filterStage) return false;
      if (
        search &&
        !l.name?.toLowerCase().includes(search.toLowerCase()) &&
        !l.email?.toLowerCase().includes(search.toLowerCase()) &&
        !l.company?.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [leads, search, filterStage]);

  const getStage = (lead: Lead) => {
    const s = lead.pipeline_stage || lead.status || "new";
    return STAGES.find((st) => st.value === s) || STAGES[0];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">リード管理</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="名前・メール・会社名で検索..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterStage("all")}
            className={`px-3 py-2 text-xs rounded-lg border transition ${
              filterStage === "all"
                ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            すべて ({leads.length})
          </button>
          {STAGES.map((s) => {
            const count = leads.filter((l) => (l.pipeline_stage || l.status || "new") === s.value).length;
            return (
              <button
                key={s.value}
                onClick={() => setFilterStage(s.value)}
                className={`px-3 py-2 text-xs rounded-lg border transition ${
                  filterStage === s.value
                    ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {s.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Leads list */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">リードがありません</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((lead) => {
            const stage = getStage(lead);
            const expanded = expandedId === lead.id;
            return (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedId(expanded ? null : lead.id)}
                  className="w-full p-4 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-slate-600">
                        {(lead.name || "?")[0].toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-slate-900 truncate">{lead.name || "名前なし"}</p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${stage.color}`}>
                          {stage.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                        {lead.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {lead.email}
                          </span>
                        )}
                        {lead.company && (
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {lead.company}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-slate-400 hidden sm:block">
                      {lead.created_at ? new Date(lead.created_at).toLocaleDateString("ja-JP") : ""}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition ${expanded ? "rotate-180" : ""}`}
                    />
                  </div>
                </button>

                <AnimatePresence>
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 border-t border-slate-100 pt-4 space-y-4">
                        {lead.message && (
                          <div>
                            <label className="text-xs font-medium text-slate-500 flex items-center gap-1 mb-1">
                              <MessageSquare className="w-3 h-3" />
                              メッセージ
                            </label>
                            <p className="text-sm text-slate-700 bg-slate-50 rounded-lg p-3 whitespace-pre-wrap">
                              {lead.message}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            受信日: {lead.created_at ? new Date(lead.created_at).toLocaleString("ja-JP") : "-"}
                          </span>
                          {lead.email && (
                            <a
                              href={`mailto:${lead.email}`}
                              className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700"
                            >
                              <ExternalLink className="w-3 h-3" />
                              メールを送る
                            </a>
                          )}
                        </div>

                        {/* Stage update */}
                        <div>
                          <label className="text-xs font-medium text-slate-500 mb-2 block">ステータス変更</label>
                          <div className="flex gap-2 flex-wrap">
                            {STAGES.map((s) => (
                              <button
                                key={s.value}
                                onClick={() => updateStatus(lead.id, s.value)}
                                disabled={updatingId === lead.id}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                                  (lead.pipeline_stage || lead.status || "new") === s.value
                                    ? `${s.color} border-transparent`
                                    : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                                } disabled:opacity-50`}
                              >
                                {s.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
