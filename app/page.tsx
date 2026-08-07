"use client";

import { useState, useEffect } from "react";
import { 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Sun, 
  Moon, 
  Flame, 
  BookOpen, 
  Bot, 
  ArrowRight,
  Upload
} from "lucide-react";
import Link from "next/link";

interface Task {
  id: string;
  title: string;
  priority: string;
  category: string;
  status: string;
}

export default function TodayHubPage() {
  // Morning Journal Form State
  const [gratitude, setGratitude] = useState("");
  const [accomplishments, setAccomplishments] = useState("");
  const [excitement, setExcitement] = useState("");
  const [emotionalTarget, setEmotionalTarget] = useState("");
  const [journalSaved, setJournalSaved] = useState(false);

  // Tasks State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState("TOP_3");

  // AI Advice State
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Fetch initial tasks
  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      const res = await fetch("/api/planner/tasks");
      const data = await res.json();
      if (data.tasks) {
        setTasks(data.tasks);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const res = await fetch("/api/planner/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTaskTitle,
          category: newTaskCategory,
          priority: newTaskCategory === "TOP_3" ? "HIGH" : "MEDIUM",
        }),
      });
      const data = await res.json();
      if (data.task) {
        setTasks([data.task, ...tasks]);
        setNewTaskTitle("");
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleToggleTask(id: string, currentStatus: string) {
    const nextStatus = currentStatus === "COMPLETED" ? "TODO" : "COMPLETED";
    try {
      await fetch("/api/planner/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: nextStatus }),
      });
      setTasks(
        tasks.map((t) => (t.id === id ? { ...t, status: nextStatus } : t))
      );
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSaveMorningJournal(e: React.FormEvent) {
    e.preventDefault();
    if (!gratitude.trim()) return;

    try {
      await fetch("/api/journal/morning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gratitude,
          dailyAccomplishments: accomplishments,
          excitementPoints: excitement,
          emotionalTarget,
        }),
      });
      setJournalSaved(true);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleGetAiAdvice() {
    setLoadingAi(true);
    try {
      const topTaskTitles = tasks
        .filter((t) => t.category === "TOP_3")
        .map((t) => t.title);

      const res = await fetch("/api/ai/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gratitude,
          dailyAccomplishments: accomplishments,
          excitementPoints: excitement,
          emotionalTarget,
          topTasks: topTaskTitles,
        }),
      });
      const data = await res.json();
      if (data.advice?.response) {
        setAiAdvice(data.advice.response);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAi(false);
    }
  }

  const top3Tasks = tasks.filter((t) => t.category === "TOP_3");
  const otherTasks = tasks.filter((t) => t.category !== "TOP_3");

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-900/40 via-indigo-900/30 to-purple-900/40 border border-sky-500/20 p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 text-xs font-semibold mb-3">
              <Sun className="w-3.5 h-3.5" /> Good Morning • Ready to Focus
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Life OS Dashboard
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              Align your day with purpose. Track your morning reflection, structure top priorities, and generate AI insights via Ollama Gemma.
            </p>
          </div>

          <button
            onClick={handleGetAiAdvice}
            disabled={loadingAi}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-sky-500/25 transition-all disabled:opacity-50"
          >
            <Bot className="w-5 h-5 animate-bounce" />
            {loadingAi ? "Consulting Gemma..." : "Get AI Morning Advice"}
          </button>
        </div>
      </div>

      {/* AI Advice Output Card */}
      {aiAdvice && (
        <div className="glass-card p-6 border-sky-500/40 bg-gradient-to-br from-sky-950/40 to-slate-900/80 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-sky-500/20 pb-3 mb-4">
            <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
              <Sparkles className="w-4 h-4" /> AI Coach Advice (Ollama • Gemma)
            </div>
            <span className="text-xs text-slate-400">Just now</span>
          </div>
          <div className="text-slate-200 text-sm whitespace-pre-line leading-relaxed font-sans">
            {aiAdvice}
          </div>
        </div>
      )}

      {/* Main Grid: Journal & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Morning Reflection Card */}
        <div className="glass-card p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Sun className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-bold text-slate-100 text-base">Morning Journal</h2>
                <p className="text-xs text-slate-400">Set intention & gratitude</p>
              </div>
            </div>
            {journalSaved && (
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                ✓ Saved
              </span>
            )}
          </div>

          <form onSubmit={handleSaveMorningJournal} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                What are 3 things you are grateful for today? *
              </label>
              <textarea
                value={gratitude}
                onChange={(e) => setGratitude(e.target.value)}
                placeholder="1. Fresh morning coffee&#10;2. A good night's sleep&#10;3. Exciting project milestone"
                rows={3}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Key Accomplishment Today
                </label>
                <input
                  type="text"
                  value={accomplishments}
                  onChange={(e) => setAccomplishments(e.target.value)}
                  placeholder="Complete Phase 1 MVP"
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Emotional Target
                </label>
                <input
                  type="text"
                  value={emotionalTarget}
                  onChange={(e) => setEmotionalTarget(e.target.value)}
                  placeholder="Focused & Energetic"
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium text-sm transition-colors shadow-md shadow-sky-600/20"
            >
              Save Morning Journal
            </button>
          </form>
        </div>

        {/* Priorities & To-Do List */}
        <div className="glass-card p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-bold text-slate-100 text-base">Top 3 Priorities & Tasks</h2>
                <p className="text-xs text-slate-400">Essential focus areas</p>
              </div>
            </div>

            <span className="text-xs text-slate-400">
              {tasks.filter((t) => t.status === "COMPLETED").length}/{tasks.length} Done
            </span>
          </div>

          {/* Quick Add Task */}
          <form onSubmit={handleAddTask} className="flex gap-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Add a new task or priority..."
              className="flex-1 bg-slate-900/90 border border-slate-700/80 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
            <select
              value={newTaskCategory}
              onChange={(e) => setNewTaskCategory(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none"
            >
              <option value="TOP_3">Top 3</option>
              <option value="WOULD_BE_NICE">Nice-to-Have</option>
              <option value="GENERAL">General</option>
            </select>
            <button
              type="submit"
              className="p-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white flex items-center justify-center transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </form>

          {/* Task List */}
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {tasks.length === 0 ? (
              <p className="text-center text-xs text-slate-500 py-6">
                No tasks added yet. Create your first task above!
              </p>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleToggleTask(task.id, task.status)}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                    task.status === "COMPLETED"
                      ? "bg-slate-900/40 border-slate-800/60 text-slate-500 line-through"
                      : "bg-slate-900/80 border-slate-700/60 text-slate-200 hover:border-sky-500/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {task.status === "COMPLETED" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    )}
                    <span className="text-sm font-medium">{task.title}</span>
                  </div>

                  {task.category === "TOP_3" && (
                    <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      Top 3
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Module Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <Link href="/journal" className="glass-card glass-card-hover p-5 group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 transition-colors" />
          </div>
          <h3 className="font-bold text-slate-100 text-base mb-1">Journal & Reflections</h3>
          <p className="text-xs text-slate-400">Nightly reflections, gratitude & photo dump upload.</p>
        </Link>

        <Link href="/bookshelf" className="glass-card glass-card-hover p-5 group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 transition-colors" />
          </div>
          <h3 className="font-bold text-slate-100 text-base mb-1">Personal Bookshelf</h3>
          <p className="text-xs text-slate-400">Track books, insights, and AI summarizer tool.</p>
        </Link>

        <Link href="/wellness" className="glass-card glass-card-hover p-5 group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 transition-colors" />
          </div>
          <h3 className="font-bold text-slate-100 text-base mb-1">Wellness & Photo Dump</h3>
          <p className="text-xs text-slate-400">Mood tracking, steps, workout logs & image gallery.</p>
        </Link>
      </div>
    </div>
  );
}
