"use client";

import { useState } from "react";
import { Moon, Sparkles, Upload, Image as ImageIcon, CheckCircle2 } from "lucide-react";

export default function JournalPage() {
  // Form state
  const [gratitude, setGratitude] = useState("");
  const [highlights, setHighlights] = useState("");
  const [dailyMemory, setDailyMemory] = useState("");
  const [selfImprovement, setSelfImprovement] = useState("");
  const [intentionTomorrow, setIntentionTomorrow] = useState("");
  const [moodScale, setMoodScale] = useState(8);

  // File upload state
  const [uploading, setUploading] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<Array<{ fileUrl: string; caption?: string }>>([]);

  // AI Review state
  const [aiReview, setAiReview] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const file = files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setUploadedPhotos([{ fileUrl: data.fileUrl }, ...uploadedPhotos]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  }

  async function handleSaveReflection(e: React.FormEvent) {
    e.preventDefault();
    if (!gratitude.trim()) return;

    try {
      await fetch("/api/journal/nightly", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gratitude,
          highlights,
          dailyMemory,
          selfImprovementNotes: selfImprovement,
          intentionTomorrow,
        }),
      });
      setSaved(true);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleGetAiReview() {
    setLoadingAi(true);
    try {
      const res = await fetch("/api/ai/reviewer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gratitude,
          highlights,
          dailyMemory,
          selfImprovementNotes: selfImprovement,
          intentionTomorrow,
          moodScale,
        }),
      });
      const data = await res.json();
      if (data.advice?.response) {
        setAiReview(data.advice.response);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAi(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-indigo-400 font-semibold text-xs mb-1">
            <Moon className="w-4 h-4" /> بازخورد شبانه و خاطرات تصویری
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            دفترچه شبانه و آلبوم عکس
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            نقاط برجسته روز را ثبت کنید، رشد فردی را جشن بگیرید و تحلیلی از مربی هوشمند دریافت کنید.
          </p>
        </div>

        <button
          onClick={handleGetAiReview}
          disabled={loadingAi}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50"
        >
          <Sparkles className="w-5 h-5 text-indigo-200" />
          {loadingAi ? "در حال تحلیل شبانه..." : "دریافت ارزیابی مربی هوشمند"}
        </button>
      </div>

      {/* AI Review Display */}
      {aiReview && (
        <div className="glass-card p-6 border-indigo-500/40 bg-gradient-to-br from-indigo-950/40 to-slate-900/80 shadow-lg">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm mb-3">
            <Sparkles className="w-4 h-4" /> ارزیابی شبانه مربی هوشمند (Gemma)
          </div>
          <div className="text-slate-200 text-sm whitespace-pre-line leading-relaxed font-sans">
            {aiReview}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Reflection Form */}
        <div className="lg:col-span-2 glass-card p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="font-bold text-slate-100 text-base">فرم یادداشت شبانه</h2>
            {saved && (
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> ذخیره شد
              </span>
            )}
          </div>

          <form onSubmit={handleSaveReflection} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                ۳ شکرگزاری از اتفاقات امروز *
              </label>
              <textarea
                value={gratitude}
                onChange={(e) => setGratitude(e.target.value)}
                placeholder="۱. وقت‌گذرانی با خانواده&#10;۲. جلسه کاری موفق&#10;۳. دریافت بازخورد مثبت"
                rows={3}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  لحظات لبخند و نقاط برجسته
                </label>
                <input
                  type="text"
                  value={highlights}
                  onChange={(e) => setHighlights(e.target.value)}
                  placeholder="پیاده‌روی غروب"
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  خاطره ماندگار امروز
                </label>
                <input
                  type="text"
                  value={dailyMemory}
                  onChange={(e) => setDailyMemory(e.target.value)}
                  placeholder="موفقیت در حل یک مسئله پیچیده"
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                نکات رشد و بهبود فردی
              </label>
              <textarea
                value={selfImprovement}
                onChange={(e) => setSelfImprovement(e.target.value)}
                placeholder="چه چیزی می‌توانست بهتر انجام شود؟ چه درس جدیدی آموختم؟"
                rows={2}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                هدف و قصد فردا
              </label>
              <input
                type="text"
                value={intentionTomorrow}
                onChange={(e) => setIntentionTomorrow(e.target.value)}
                placeholder="شروع صبح با ۳۰ دقیقه ورزش"
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Mood Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-medium text-slate-300 mb-1">
                <span>میزان خلق‌وخوی امروز</span>
                <span className="text-indigo-400 font-bold">{moodScale} از ۱۰</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={moodScale}
                onChange={(e) => setMoodScale(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors shadow-md shadow-indigo-600/20"
            >
              ذخیره بازخورد شبانه
            </button>
          </form>
        </div>

        {/* Photo Dump Section */}
        <div className="glass-card p-6 space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-800 pb-4 mb-4">
              <ImageIcon className="w-5 h-5 text-indigo-400" />
              <div>
                <h2 className="font-bold text-slate-100 text-base">بارگذاری عکس‌های امروز</h2>
                <p className="text-xs text-slate-400">ذخیره محلی خاطرات تصویری</p>
              </div>
            </div>

            {/* Upload Box */}
            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-700 hover:border-indigo-500/60 rounded-xl cursor-pointer bg-slate-900/40 hover:bg-slate-900/80 transition-all text-center group">
              <Upload className="w-8 h-8 text-slate-500 group-hover:text-indigo-400 mb-2 transition-colors" />
              <span className="text-xs font-medium text-slate-300">
                {uploading ? "در حال بارگذاری..." : "کلیک کنید یا عکس را اینجا رها کنید"}
              </span>
              <span className="text-[11px] text-slate-500 mt-1">PNG, JPG, WEBP • ذخیره محلی</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>

            {/* Uploaded Gallery Preview */}
            <div className="grid grid-cols-2 gap-3 mt-4 max-h-64 overflow-y-auto">
              {uploadedPhotos.map((photo, idx) => (
                <div key={idx} className="relative rounded-lg overflow-hidden border border-slate-700/60 aspect-square group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.fileUrl}
                    alt="پیش‌نمایش تصویر"
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                  />
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-slate-500 text-center">
            فایل‌ها به صورت محلی در مسیر <code className="text-slate-400">/public/uploads</code> ذخیره می‌شوند
          </p>
        </div>
      </div>
    </div>
  );
}
