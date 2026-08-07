"use client";

import { useState, useEffect } from "react";
import { Sparkles, Calendar, Bot } from "lucide-react";

export function Header() {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const today = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    setCurrentDate(today);
  }, []);

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <Calendar className="w-4 h-4 text-sky-400" />
        <span className="text-sm font-medium text-slate-300">{currentDate || "Today"}</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
          <Bot className="w-3.5 h-3.5 text-emerald-400" />
          <span>Ollama AI: <strong className="text-emerald-400">gemma</strong></span>
        </div>
      </div>
    </header>
  );
}
