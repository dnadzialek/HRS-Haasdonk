import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "U8 Haasdonk",
  description: "Officiële website van U8 HRS Haasdonk",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-50 text-slate-900 flex min-h-screen overflow-hidden selection:bg-red-600 selection:text-white`} suppressHydrationWarning>
        {/* Sidebar */}
        <aside className="w-72 bg-white shadow-[4px_0_24px_rgba(0,0,0,0.05)] border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto z-20 relative">
          <div className="p-8 text-center border-b border-slate-100">
            <h1 className="text-3xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-red-600 to-red-800 drop-shadow-sm">
              U8 HAASDONK
            </h1>
            <p className="text-slate-500 text-sm mt-2 font-bold tracking-widest uppercase">HRS Haasdonk</p>
          </div>
          <nav className="flex-1 p-6 space-y-3">
            <Link href="/" className="flex items-center gap-3 py-3 px-4 rounded-xl text-slate-700 hover:bg-red-50 hover:text-red-700 font-bold transition-all group">
              <span className="text-xl group-hover:scale-110 transition-transform">⚽</span>
              Laatste Wedstrijden
            </Link>
            <Link href="/quiz" className="flex items-center gap-3 py-3 px-4 rounded-xl text-slate-700 hover:bg-red-50 hover:text-red-700 font-bold transition-all group">
              <span className="text-xl group-hover:scale-110 transition-transform">🧠</span>
              Positie Quiz
            </Link>
            <Link href="/training" className="flex items-center gap-3 py-3 px-4 rounded-xl text-slate-700 hover:bg-red-50 hover:text-red-700 font-bold transition-all group">
              <span className="text-xl group-hover:scale-110 transition-transform">🎮</span>
              3D Training
            </Link>
          </nav>
          <div className="p-6 text-xs text-slate-400 font-bold text-center border-t border-slate-100">
            &copy; {new Date().getFullYear()} HRS Haasdonk U8
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col bg-slate-50 overflow-hidden relative">
          {children}
        </main>
      </body>
    </html>
  );
}
