"use client";

import { useState } from "react";
import { CheckSquare, Plus, Flame, Sparkles, CheckCircle2, Award } from "lucide-react";

interface HabitItem {
  id: string;
  title: string;
  targetCount: number;
  completedDays: boolean[];
}

export default function HabitTrackerPage() {
  const [habits, setHabits] = useState<HabitItem[]>([
    { id: "1", title: "Morning Meditation (10m)", targetCount: 1, completedDays: [true, true, true, true, false, false, false] },
    { id: "2", title: "Read 20 pages", targetCount: 1, completedDays: [true, true, false, true, true, false, false] },
    { id: "3", title: "10,000 Daily Steps", targetCount: 1, completedDays: [true, true, true, true, true, false, false] },
    { id: "4", title: "No Sugar / Clean Diet", targetCount: 1, completedDays: [true, false, true, true, false, false, false] },
  ]);

  const [newHabitTitle, setNewHabitTitle] = useState("");

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  function handleToggleDay(habitId: string, dayIndex: number) {
    setHabits(
      habits.map((h) => {
        if (h.id === habitId) {
          const updatedDays = [...h.completedDays];
          updatedDays[dayIndex] = !updatedDays[dayIndex];
          return { ...h, completedDays: updatedDays };
        }
        return h;
      })
    );
  }

  function handleAddHabit(e: React.FormEvent) {
    e.preventDefault();
    if (!newHabitTitle.trim()) return;

    const newHabit: HabitItem = {
      id: Date.now().toString(),
      title: newHabitTitle,
      targetCount: 1,
      completedDays: [false, false, false, false, false, false, false],
    };

    setHabits([...habits, newHabit]);
    setNewHabitTitle("");
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-emerald-400 font-semibold text-xs mb-1">
            <CheckSquare className="w-4 h-4" /> Habit Consistency Engine
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Weekly Habit Tracker
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Build compounding momentum by completing your core daily routines.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300">
          <Award className="w-4 h-4 text-emerald-400" />
          <span>Weekly Completion Rate: <strong className="text-emerald-400">74%</strong></span>
        </div>
      </div>

      {/* Add Habit Bar */}
      <div className="glass-card p-6 border-emerald-500/30">
        <form onSubmit={handleAddHabit} className="flex gap-3">
          <input
            type="text"
            value={newHabitTitle}
            onChange={(e) => setNewHabitTitle(e.target.value)}
            placeholder="Add new habit routine (e.g. Cold Shower, 30m Coding)..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Habit
          </button>
        </form>
      </div>

      {/* Habit Matrix Table */}
      <div className="glass-card p-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-xs uppercase font-bold text-slate-400">
              <th className="pb-4 font-semibold">Habit Routine</th>
              {daysOfWeek.map((day, idx) => (
                <th key={idx} className="pb-4 text-center font-semibold w-16">
                  {day}
                </th>
              ))}
              <th className="pb-4 text-right font-semibold">Streak</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {habits.map((habit) => {
              const streakCount = habit.completedDays.filter(Boolean).length;
              return (
                <tr key={habit.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-4 font-medium text-slate-200">{habit.title}</td>
                  {habit.completedDays.map((completed, dayIdx) => (
                    <td key={dayIdx} className="py-4 text-center">
                      <button
                        onClick={() => handleToggleDay(habit.id, dayIdx)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                          completed
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm shadow-emerald-500/10"
                            : "bg-slate-900 border border-slate-800 text-slate-600 hover:border-slate-700"
                        }`}
                      >
                        {completed && <CheckCircle2 className="w-4 h-4" />}
                      </button>
                    </td>
                  ))}
                  <td className="py-4 text-right font-bold text-emerald-400">
                    <span className="inline-flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded text-xs">
                      <Flame className="w-3.5 h-3.5 fill-emerald-400" /> {streakCount}/7
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
