"use client";

import { useState, useEffect } from "react";
import { CalendarDays, Plus, CheckCircle2, Circle, Flame, Target, Clock } from "lucide-react";

interface Task {
  id: string;
  title: string;
  priority: string;
  category: string;
  status: string;
}

export default function PlannerPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("TOP_3");
  const [priority, setPriority] = useState("HIGH");

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      const res = await fetch("/api/planner/tasks");
      const data = await res.json();
      if (data.tasks) setTasks(data.tasks);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await fetch("/api/planner/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category, priority }),
      });
      const data = await res.json();
      if (data.task) {
        setTasks([data.task, ...tasks]);
        setTitle("");
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleToggleStatus(id: string, currentStatus: string) {
    const nextStatus = currentStatus === "COMPLETED" ? "TODO" : "COMPLETED";
    try {
      await fetch("/api/planner/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: nextStatus }),
      });
      setTasks(tasks.map((t) => (t.id === id ? { ...t, status: nextStatus } : t)));
    } catch (err) {
      console.error(err);
    }
  }

  const top3 = tasks.filter((t) => t.category === "TOP_3");
  const wouldBeNice = tasks.filter((t) => t.category === "WOULD_BE_NICE");
  const general = tasks.filter((t) => t.category === "GENERAL");

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 text-sky-400 font-semibold text-xs mb-1">
          <CalendarDays className="w-4 h-4" /> برنامه‌ریزی هفتگی و روزانه
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          مدیریت کارها و اولویت‌بندی
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          اولویت‌های اصلی خود را طبقه‌بندی کنید و کارهای روزانه را با وضوح بالا پیش ببرید.
        </p>
      </div>

      {/* Add Task Control Bar */}
      <div className="glass-card p-6 border-sky-500/30">
        <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
          <Plus className="w-4 h-4 text-sky-400" /> افزودن کار جدید
        </h3>
        <form onSubmit={handleAddTask} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="عنوان کار..."
            className="sm:col-span-2 bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200"
          >
            <option value="TOP_3">۳ اولویت اصلی</option>
            <option value="WOULD_BE_NICE">خوب است انجام شود</option>
            <option value="GENERAL">کارهای عمومی</option>
          </select>
          <button
            type="submit"
            className="py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-colors shadow-md shadow-sky-600/20"
          >
            افزودن کار
          </button>
        </form>
      </div>

      {/* Task Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Top 3 Column */}
        <div className="glass-card p-6 space-y-4 border-amber-500/30">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-amber-400 text-sm flex items-center gap-2">
              <Flame className="w-4 h-4" /> ۳ اولویت اصلی
            </h3>
            <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
              {top3.filter((t) => t.status === "COMPLETED").length} از {top3.length}
            </span>
          </div>

          <div className="space-y-2">
            {top3.map((task) => (
              <div
                key={task.id}
                onClick={() => handleToggleStatus(task.id, task.status)}
                className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                  task.status === "COMPLETED"
                    ? "bg-slate-900/40 border-slate-800 text-slate-500 line-through"
                    : "bg-slate-900/80 border-slate-700 text-slate-200 hover:border-amber-500/50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {task.status === "COMPLETED" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Circle className="w-4 h-4 text-amber-400" />
                  )}
                  <span className="text-sm font-medium">{task.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Would Be Nice Column */}
        <div className="glass-card p-6 space-y-4 border-indigo-500/30">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-indigo-400 text-sm flex items-center gap-2">
              <Target className="w-4 h-4" /> خوب است انجام شود
            </h3>
            <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
              {wouldBeNice.filter((t) => t.status === "COMPLETED").length} از {wouldBeNice.length}
            </span>
          </div>

          <div className="space-y-2">
            {wouldBeNice.map((task) => (
              <div
                key={task.id}
                onClick={() => handleToggleStatus(task.id, task.status)}
                className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                  task.status === "COMPLETED"
                    ? "bg-slate-900/40 border-slate-800 text-slate-500 line-through"
                    : "bg-slate-900/80 border-slate-700 text-slate-200 hover:border-indigo-500/50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {task.status === "COMPLETED" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Circle className="w-4 h-4 text-indigo-400" />
                  )}
                  <span className="text-sm font-medium">{task.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* General Tasks Column */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" /> کارهای عمومی
            </h3>
            <span className="text-xs font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
              {general.filter((t) => t.status === "COMPLETED").length} از {general.length}
            </span>
          </div>

          <div className="space-y-2">
            {general.map((task) => (
              <div
                key={task.id}
                onClick={() => handleToggleStatus(task.id, task.status)}
                className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                  task.status === "COMPLETED"
                    ? "bg-slate-900/40 border-slate-800 text-slate-500 line-through"
                    : "bg-slate-900/80 border-slate-700 text-slate-200 hover:border-slate-600"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {task.status === "COMPLETED" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-500" />
                  )}
                  <span className="text-sm font-medium">{task.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
