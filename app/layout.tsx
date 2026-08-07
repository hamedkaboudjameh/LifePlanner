import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export const metadata: Metadata = {
  title: "سیستم مدیریت زندگی و مربی هوش مصنوعی | Life OS",
  description: "مدیریت روزانه، یادداشت‌برداری، برنامه‌ریزی کارها، ردیاب عادت‌ها، کتابخانه شخصی و مربی هوش مصنوعی محلی.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex antialiased">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
