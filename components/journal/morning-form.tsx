"use client";

import { useState, useEffect } from "react";
import { Sun, CheckCircle2, Sparkles, Heart, Target, Smile, Loader2 } from "lucide-react";
import { saveMorningJournalAction, getTodayMorningJournalAction } from "@/app/actions/journal";

export function MorningJournalForm() {
  const [gratitude, setGratitude] = useState("");
  const [accomplishments, setAccomplishments] = useState("");
  const [excitement, setExcitement] = useState("");
  const [emotionalTarget, setEmotionalTarget] = useState("");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [saved, setSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load today's existing journal entry on mount
  useEffect(() => {
    async function loadJournal() {
      setFetching(true);
      const res = await getTodayMorningJournalAction();
      if (res.success && res.journal) {
        setGratitude(res.journal.gratitude || "");
        setAccomplishments(res.journal.dailyAccomplishments || "");
        setExcitement(res.journal.excitementPoints || "");
        setEmotionalTarget(res.journal.emotionalTarget || "");
      }
      setFetching(false);
    }
    loadJournal();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    setSaved(false);

    if (!gratitude.trim()) {
      setErrorMessage("لطفاً حداقل یک مورد شکرگزاری ثبت کنید.");
      return;
    }

    setLoading(true);

    try {
      const res = await saveMorningJournalAction({
        gratitude,
        dailyAccomplishments: accomplishments,
        excitementPoints: excitement,
        emotionalTarget,
      });

      if (res.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 4000);
      } else {
        setErrorMessage(res.error || "خطایی رخ داد.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("ارتباط با دیتابیس برقرار نشد.");
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div className="glass-card p-8 flex items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-5 h-5 animate-spin text-sky-400" />
        <span className="text-sm">در حال دریافت یادداشت امروز...</span>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 space-y-6 border-amber-500/20 shadow-xl relative overflow-hidden">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/10">
            <Sun className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="font-bold text-slate-100 text-lg">یادداشت صبحگاهی | Daily Morning Journal</h2>
            <p className="text-xs text-slate-400">ثبت شکرگزاری، اهداف و حالت احساسی امروز</p>
          </div>
        </div>

        {saved && (
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/30 flex items-center gap-1.5 animate-in fade-in zoom-in">
            <CheckCircle2 className="w-4 h-4" /> با موفقیت ذخیره شد
          </span>
        )}
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
          {errorMessage}
        </div>
      )}

      {/* Journal Form */}
      <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
        {/* Field 1: Gratitude */}
        <div>
          <label className="block text-xs font-semibold text-amber-300 mb-1.5 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-amber-400" />
            امروز بابت چه چیزهایی شکرگزار هستید؟ / Today I am grateful for *
          </label>
          <textarea
            value={gratitude}
            onChange={(e) => setGratitude(e.target.value)}
            placeholder="۱. سلامتی و تندرستی خود و خانواده&#10;۲. فرصت شروع یک روز جدید&#10;۳. پروژه و مسیر شغلی لذت‌بخش"
            rows={3}
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
          />
        </div>

        {/* Field 2: Accomplishments */}
        <div>
          <label className="block text-xs font-semibold text-sky-300 mb-1.5 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-sky-400" />
            امروز چه چیزی را می‌خواهید به دست آورید؟ / What I want to accomplish today
          </label>
          <input
            type="text"
            value={accomplishments}
            onChange={(e) => setAccomplishments(e.target.value)}
            placeholder="تکمیل کامل فاز اول اپلیکیشن و مرور کدها..."
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-all"
          />
        </div>

        {/* Grid for Fields 3 & 4 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Field 3: Excitement / Looking forward to */}
          <div>
            <label className="block text-xs font-semibold text-purple-300 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              منتظر چه اتفاق هیجان‌انگیزی هستید؟ / Looking forward to
            </label>
            <input
              type="text"
              value={excitement}
              onChange={(e) => setExcitement(e.target.value)}
              placeholder="پیاده‌روی غروب و مطالعه کتاب..."
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all"
            />
          </div>

          {/* Field 4: Emotional Target */}
          <div>
            <label className="block text-xs font-semibold text-emerald-300 mb-1.5 flex items-center gap-1.5">
              <Smile className="w-3.5 h-3.5 text-emerald-400" />
              امروز دوست دارید چه احساسی داشته باشید؟ / How I want to feel today
            </label>
            <input
              type="text"
              value={emotionalTarget}
              onChange={(e) => setEmotionalTarget(e.target.value)}
              placeholder="پرانرژی، متمرکز و با آرامش خاطر..."
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>در حال ذخیره در دیتابیس...</span>
            </>
          ) : (
            <>
              <Sun className="w-4 h-4" />
              <span>ذخیره یادداشت صبحگاهی (Save Morning Journal)</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
