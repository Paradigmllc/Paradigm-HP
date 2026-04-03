"use client";

import { useState, useEffect, createContext, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  HelpCircle,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

const AuthContext = createContext<{ logout: () => void }>({ logout: () => {} });

const NAV_ITEMS = [
  { href: "/admin", label: "ダッシュボード", icon: LayoutDashboard },
  { href: "/admin/posts", label: "ブログ", icon: FileText },
  { href: "/admin/services", label: "サービス", icon: Briefcase },
  { href: "/admin/faqs", label: "FAQ", icon: HelpCircle },
  { href: "/admin/leads", label: "リード", icon: Users },
  { href: "/admin/settings", label: "設定", icon: Settings },
];

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", password }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("ログインしました");
        onSuccess();
      } else {
        toast.error(data.error || "パスワードが正しくありません");
      }
    } catch {
      toast.error("ログインに失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center mb-4">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">管理画面ログイン</h1>
          <p className="text-sm text-slate-500 mt-1">パスワードを入力してください</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワード"
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium text-sm hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "ログイン中..." : "ログイン"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/admin", { method: "GET" });
      const data = await res.json();
      setAuthed(!!data.authenticated);
    } catch {
      setAuthed(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const logout = async () => {
    try {
      await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });
    } catch { /* noop */ }
    setAuthed(false);
    toast.success("ログアウトしました");
  };

  if (authed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authed) {
    return <LoginForm onSuccess={() => setAuthed(true)} />;
  }

  return (
    <AuthContext.Provider value={{ logout }}>
      <div className="min-h-screen bg-slate-50 flex">
        {/* Mobile overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="flex items-center justify-between px-5 h-16 border-b border-slate-100">
            <Link href="/admin" className="text-lg font-bold text-indigo-600">
              Paradigm 管理
            </Link>
            <button className="lg:hidden text-slate-400 hover:text-slate-600" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    active
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="p-3 border-t border-slate-100">
            <button
              onClick={logout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition w-full"
            >
              <LogOut className="w-5 h-5" />
              ログアウト
            </button>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 flex items-center px-4 lg:px-6">
            <button className="lg:hidden mr-3 text-slate-600 hover:text-slate-900" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-sm font-semibold text-slate-700">
              {NAV_ITEMS.find((n) => pathname === n.href || (n.href !== "/admin" && pathname.startsWith(n.href)))?.label || "管理画面"}
            </h2>
          </header>
          <main className="flex-1 p-4 lg:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </AuthContext.Provider>
  );
}
