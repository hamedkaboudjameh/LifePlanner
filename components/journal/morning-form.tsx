"use client";

import { useState, useEffect } from "react";
import { 
  Sun, 
  CheckCircle2, 
  Sparkles, 
  Heart, 
  Target, 
  Smile, 
  Loader2, 
  Pencil, 
  X, 
  Quote
} from "lucide-react";
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
  const [isEditing, setIsEditing] = useState(false);
  const [hasExistingEntry, setHasExistingEntry] = useState(false);

  // Load today's existing journal entry on mount
  useEffect(() => {
    async function loadJournal() {
      setFetching(true);
      const res = await getTodayMorningJournalAction();
      if (res.success && res.journal) {
        const grat = res.journal.gratitude || "";
        const accomp = res.journal.dailyAccomplishments || "";
        const excit = res.journal.excitementPoints || "";
        const emot = res.journal.emotionalTarget || "";

        setGratitude(grat);
        setAccomplishments(accomp);
        setExcitement(excit);
        setEmotionalTarget(emot);

        if (grat.trim() || accomp.trim() || excit.trim() || emot.trim()) {
          setHasExistingEntry(true);
          setIsEditing(false);
        } else {
          setIsEditing(true);
        }
      } else {
        setIsEditing(true);
      }
      setFetching(false);
    }
    loadJournal();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

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
        setHasExistingEntry(true);
        setIsEditing(false);
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
        <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
        <span className="text-sm">در حال دریافت یادداشت امروز...</span>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 space-y-6 border-amber-500/20 shadow-xl relative overflow-hidden transition-all duration-300">
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

        <div className="flex items-center gap-2">
          {saved && (
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/30 flex items-center gap-1.5 animate-in fade-in zoom-in">
              <CheckCircle2 className="w-4 h-4" /> ذخیره شد
            </span>
          )}

          {/* Edit Button (Pen Icon) when in View Mode */}
          {!isEditing && hasExistingEntry && (
            <button
              onClick={() => setIsEditing(true)}
              className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-amber-500/20 border border-slate-700/80 hover:border-amber-500/40 text-slate-300 hover:text-amber-300 transition-all text-xs font-semibold shadow-sm"
              title="ویرایش یادداشت"
            >
              <Pencil className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
              <span>ویرایش</span>
            </button>
          )}

          {/* Cancel Editing button */}
          {isEditing && hasExistingEntry && (
            <button
              onClick={() => {
                setIsEditing(false);
                setErrorMessage(null);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-slate-200 transition-all text-xs font-semibold"
              title="انصراف از ویرایش"
            >
              <X className="w-3.5 h-3.5" />
              <span>انصراف</span>
            </button>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium relative z-10 animate-in fade-in">
          {errorMessage}
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. BEAUTIFUL VIEW MODE (نوشتاری و زیبا) */}
      {/* ========================================================= */}
      {!isEditing ? (
        <div className="space-y-4 relative z-10 animate-in fade-in duration-300">
          {/* Gratitude Section */}
          <div className="relative rounded-2xl bg-gradient-to-br from-amber-950/30 via-slate-900/60 to-slate-900/90 border border-amber-500/20 p-5 shadow-lg overflow-hidden group hover:border-amber-500/30 transition-all">
            <div className="absolute top-2 left-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <Quote className="w-16 h-16 text-amber-400" />
            </div>
            
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-2.5">
              <div className="p-1 rounded-md bg-amber-500/10 border border-amber-500/20">
                <Heart className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <span>شکرگزاری‌های امروز (Today I am grateful for)</span>
            </div>

            <div className="text-slate-100 text-sm font-normal leading-relaxed whitespace-pre-line pr-2 border-r-2 border-amber-500/40">
              {gratitude || "موردی ثبت نشده است."}
            </div>
          </div>

          {/* Accomplishments Section */}
          {accomplishments && (
            <div className="rounded-2xl bg-gradient-to-br from-sky-950/25 via-slate-900/60 to-slate-900/90 border border-sky-500/20 p-4 shadow-sm hover:border-sky-500/30 transition-all">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-400 mb-2">
                <div className="p-1 rounded-md bg-sky-500/10 border border-sky-500/20">
                  <Target className="w-3.5 h-3.5 text-sky-400" />
                </div>
                <span>هدف و دستاورد امروز (What I want to accomplish today)</span>
              </div>
              <div className="text-slate-200 text-sm leading-relaxed pr-2 border-r-2 border-sky-500/40 font-medium">
                {accomplishments}
              </div>
            </div>
          )}

          {/* Two-Column Mini Cards for Excitement and Feelings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Excitement */}
            <div className="rounded-xl bg-slate-900/70 border border-purple-500/20 p-4 hover:border-purple-500/30 transition-all">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-300 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>اتفاق هیجان‌انگیز</span>
              </div>
              <p className="text-slate-200 text-sm leading-relaxed">
                {excitement || <span className="text-slate-500 text-xs italic">ثبت نشده</span>}
              </p>
            </div>

            {/* Emotional Target */}
            <div className="rounded-xl bg-slate-900/70 border border-emerald-500/20 p-4 hover:border-emerald-500/30 transition-all">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 mb-1.5">
                <Smile className="w-3.5 h-3.5 text-emerald-400" />
                <span>حالت احساسی مطلوب</span>
              </div>
              <p className="text-slate-200 text-sm leading-relaxed">
                {emotionalTarget || <span className="text-slate-500 text-xs italic">ثبت نشده</span>}
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================= */
        /* 2. EDIT FORM MODE (حالت فرم و ورودی) */
        /* ========================================================= */
        <form onSubmit={handleSubmit} className="space-y-5 relative z-10 animate-in fade-in duration-200">
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

          {/* Submit / Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>در حال ذخیره در دیتابیس...</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4" />
                  <span>{hasExistingEntry ? "ذخیره تغییرات یادداشت" : "ذخیره یادداشت صبحگاهی (Save Morning Journal)"}</span>
                </>
              )}
            </button>

            {hasExistingEntry && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setErrorMessage(null);
                }}
                disabled={loading}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-all border border-slate-700"
              >
                انصراف
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}

