"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  CalendarDays, 
  CheckSquare, 
  Library, 
  Activity, 
  Bot, 
  Sparkles 
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "پیشخوان امروز", href: "/", icon: LayoutDashboard },
  { name: "دفترچه روزانه", href: "/journal", icon: BookOpen },
  { name: "برنامه‌ریزی و کارها", href: "/planner", icon: CalendarDays },
  { name: "ردیاب عادت‌ها", href: "/habits", icon: CheckSquare },
  { name: "کتابخانه من", href: "/bookshelf", icon: Library },
  { name: "سلامت و عکس‌ها", href: "/wellness", icon: Activity },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900/80 border-l border-slate-800 flex flex-col justify-between h-screen sticky top-0 backdrop-blur-md z-40">
      <div>
        {/* App Logo & Header */}
        <div className="p-6 flex items-center gap-3 border-b border-slate-800/60">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-100 tracking-tight">Life OS</h1>
            <p className="text-xs text-sky-400 font-medium flex items-center gap-1">
              <Bot className="w-3.5 h-3.5" /> مربی هوشمند (Gemma)
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-sky-600/20 text-sky-300 border border-sky-500/30 shadow-md shadow-sky-500/10"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-sky-400" : "text-slate-400")} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/60">
        <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800 text-xs text-slate-400 space-y-1">
          <div className="flex items-center justify-between text-slate-300 font-medium">
            <span>هوش مصنوعی محلی</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          </div>
          <p className="text-[11px] text-slate-500">سرور Ollama • مدل: Gemma</p>
        </div>
      </div>
    </aside>
  );
}
