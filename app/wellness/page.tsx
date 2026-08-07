"use client";

import { useState } from "react";
import { Activity, Heart, Flame, Footprints, Dumbbell, Upload, Image as ImageIcon } from "lucide-react";

export default function WellnessPage() {
  const [workout, setWorkout] = useState("Upper Body Hypertrophy (45 mins)");
  const [supplements, setSupplements] = useState("Creatine 5g, Vitamin D3, Omega 3, Magnesium");
  const [steps, setSteps] = useState(10420);
  const [saved, setSaved] = useState(false);

  function handleSaveWellness(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 text-rose-400 font-semibold text-xs mb-1">
          <Activity className="w-4 h-4" /> Wellness & Physical Vitality
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Wellness Log & Photo Gallery
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Monitor workout intensity, supplement schedules, step goals, and local photo memories.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric Cards */}
        <div className="glass-card p-6 border-rose-500/30 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
            <Footprints className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Daily Steps</p>
            <h3 className="text-2xl font-black text-white">{steps.toLocaleString()}</h3>
            <span className="text-[11px] text-emerald-400 font-semibold">Goal: 10,000 ✓ Achieved</span>
          </div>
        </div>

        <div className="glass-card p-6 border-sky-500/30 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
            <Dumbbell className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Workout Status</p>
            <h3 className="text-lg font-bold text-white">45 min Lift</h3>
            <span className="text-[11px] text-sky-400 font-semibold">Completed at 08:30 AM</span>
          </div>
        </div>

        <div className="glass-card p-6 border-amber-500/30 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Overall Energy</p>
            <h3 className="text-2xl font-black text-white">9 / 10</h3>
            <span className="text-[11px] text-amber-400 font-semibold">Optimal Recovery</span>
          </div>
        </div>
      </div>

      {/* Wellness Form */}
      <div className="glass-card p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="font-bold text-slate-100 text-base flex items-center gap-2">
            <Activity className="w-5 h-5 text-rose-400" /> Log Today's Workout & Nutrition
          </h2>
          {saved && (
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              ✓ Log Saved
            </span>
          )}
        </div>

        <form onSubmit={handleSaveWellness} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Workout Activity & Duration
              </label>
              <input
                type="text"
                value={workout}
                onChange={(e) => setWorkout(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Meals & Supplements Tracker
              </label>
              <input
                type="text"
                value={supplements}
                onChange={(e) => setSupplements(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium text-sm transition-colors shadow-md shadow-rose-600/20"
          >
            Update Daily Wellness Log
          </button>
        </form>
      </div>
    </div>
  );
}
