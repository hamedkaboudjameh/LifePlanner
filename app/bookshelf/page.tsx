"use client";

import { useState, useEffect } from "react";
import { Library, Plus, Star, BookOpen, Sparkles } from "lucide-react";
import { toPersianDigits } from "@/lib/utils";

interface Book {
  id: string;
  title: string;
  author: string;
  rating?: number;
  category?: string;
  status: string;
  review?: {
    summary?: string;
    personalThoughts?: string;
  };
}

export default function BookshelfPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("توسعه فردی");
  const [rating, setRating] = useState(5);
  const [status, setStatus] = useState("FINISHED");
  const [userNotes, setUserNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  async function fetchBooks() {
    try {
      const res = await fetch("/api/bookshelf");
      const data = await res.json();
      if (data.books) {
        setBooks(data.books);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAddBook(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !author) return;

    setLoading(true);
    try {
      const res = await fetch("/api/bookshelf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          author,
          category,
          rating,
          status,
          userNotes,
        }),
      });
      const data = await res.json();
      if (data.book) {
        setBooks([data.book, ...books]);
        setShowAddModal(false);
        setTitle("");
        setAuthor("");
        setUserNotes("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const getStatusText = (statusVal: string) => {
    switch (statusVal) {
      case "FINISHED":
        return "خوانده شده";
      case "READING":
        return "در حال خواندن";
      case "WANT_TO_READ":
        return "می‌خواهم بخوانم";
      default:
        return statusVal;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-purple-400 font-semibold text-xs mb-1">
            <Library className="w-4 h-4" /> کتابخانه شخصی و یادداشت‌ها
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            کتابخانه من و خلاصه‌ساز هوشمند
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            هدف‌گذاری مطالعه، یادداشت‌برداری از نکات مهم و خلاصه‌سازی هوشمند کتاب‌ها با Gemma.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-lg shadow-purple-600/25 transition-all text-sm"
        >
          <Plus className="w-4 h-4" /> افزودن کتاب جدید
        </button>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.length === 0 ? (
          <div className="col-span-full glass-card p-12 text-center space-y-3">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-slate-200 font-bold text-lg">کتابخانه شما خالی است</h3>
            <p className="text-slate-400 text-xs max-w-sm mx-auto">
              کتاب‌هایی که خوانده‌اید یا در حال مطالعه هستید را اضافه کنید تا نکات و خلاصه‌های هوشمند ثبت شوند.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white text-xs font-semibold"
            >
              <Plus className="w-4 h-4" /> افزودن اولین کتاب
            </button>
          </div>
        ) : (
          books.map((book) => (
            <div key={book.id} className="glass-card glass-card-hover p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                    {book.category || "عمومی"}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="text-xs font-bold">{toPersianDigits(book.rating || 5)} از ۵</span>
                  </div>
                </div>

                <h3 className="font-bold text-slate-100 text-lg leading-snug">{book.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">نویسنده: {book.author}</p>

                {book.review?.summary && (
                  <div className="mt-4 p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-1">
                    <div className="flex items-center gap-1.5 text-purple-400 font-semibold text-[11px] mb-1">
                      <Sparkles className="w-3 h-3" /> خلاصه هوشمند (Gemma)
                    </div>
                    <div className="whitespace-pre-line text-slate-300 text-[11px] leading-relaxed">
                      {book.review.summary}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                <span>وضعیت: <strong className="text-slate-300">{getStatusText(book.status)}</strong></span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Book Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-lg p-6 space-y-5 border-purple-500/30">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-400" /> افزودن کتاب به کتابخانه
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddBook} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">عنوان کتاب *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="عادت‌های اتمی"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">نویسنده *</label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="جیمز کلیر"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">دسته‌بندی</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="توسعه فردی"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">امتیاز (۱ تا ۵)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">وضعیت</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100"
                  >
                    <option value="FINISHED">خوانده شده</option>
                    <option value="READING">در حال خواندن</option>
                    <option value="WANT_TO_READ">می‌خواهم بخوانم</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  یادداشت‌های شخصی (جهت خلاصه‌سازی با هوش مصنوعی)
                </label>
                <textarea
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  placeholder="تغییرات کوچک ۱ درصدی روزانه نتایج فوق‌العاده‌ای می‌سازند..."
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-start gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-600/20 disabled:opacity-50"
                >
                  {loading ? "در حال خلاصه‌سازی..." : "ذخیره کتاب"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
