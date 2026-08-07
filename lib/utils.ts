import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a Date object or ISO string into a Persian (Shamsi / Jalali) date string.
 * Example output: "جمعه، ۱۷ مرداد ۱۴۰۵"
 */
export function formatJalaliDate(dateStr?: string | Date): string {
  const d = dateStr ? (typeof dateStr === "string" ? new Date(dateStr) : dateStr) : new Date();
  
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      calendar: "persian",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(d);
  } catch (err) {
    console.error("Jalali date format error:", err);
    return d.toLocaleDateString("fa-IR");
  }
}

/**
 * Converts English digits to Persian digits.
 */
export function toPersianDigits(n: number | string): string {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(n).replace(/\d/g, (x) => persianDigits[parseInt(x)]);
}
