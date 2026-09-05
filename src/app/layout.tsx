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
      <body className={`${inter.className} bg-slate-50 text-slate-900 flex flex-col-reverse md:flex-row min-h-[100dvh] overflow-hidden selection:bg-red-600 selection:text-white`} suppressHydrationWarning>
        
        {/* Navigation (Sidebar on Desktop, Bottom bar on Mobile) */}
        <aside className="w-full md:w-72 bg-white shadow-[0_-4px_24px_rgba(0,0,0,0.05)] md:shadow-[4px_0_24px_rgba(0,0,0,0.05)] border-t md:border-t-0 md:border-r border-slate-200 flex flex-row md:flex-col shrink-0 z-20 relative">
          <div className="hidden md:block p-8 text-center border-b border-slate-100">
            <h1 className="text-3xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-red-600 to-red-800 drop-shadow-sm">
              U8 HAASDONK
            </h1>
            <p className="text-slate-500 text-sm mt-2 font-bold tracking-widest uppercase">HRS Haasdonk</p>
          </div>
          
          <nav className="flex-1 p-2 md:p-6 flex flex-row md:flex-col justify-around md:justify-start space-x-1 md:space-x-0 md:space-y-3 overflow-x-auto">
            <Link href="/" className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 py-2 md:py-3 px-2 md:px-4 rounded-xl text-slate-700 hover:bg-red-50 hover:text-red-700 font-bold transition-all group min-w-[70px]">
              <span className="text-xl md:text-2xl group-hover:scale-110 transition-transform">📅</span>
              <span className="text-[11px] md:text-base text-center md:text-left">Volgende</span>
            </Link>
            <Link href="/laatste-wedstrijd" className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 py-2 md:py-3 px-2 md:px-4 rounded-xl text-slate-700 hover:bg-red-50 hover:text-red-700 font-bold transition-all group min-w-[70px]">
              <span className="text-xl md:text-2xl group-hover:scale-110 transition-transform">⚽</span>
              <span className="text-[11px] md:text-base text-center md:text-left">Laatste</span>
            </Link>
            <Link href="/quiz" className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 py-2 md:py-3 px-2 md:px-4 rounded-xl text-slate-700 hover:bg-red-50 hover:text-red-700 font-bold transition-all group min-w-[70px]">
              <span className="text-xl md:text-2xl group-hover:scale-110 transition-transform">🧠</span>
              <span className="text-[11px] md:text-base text-center md:text-left">Quiz</span>
            </Link>
            <Link href="/training" className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 py-2 md:py-3 px-2 md:px-4 rounded-xl text-slate-700 hover:bg-red-50 hover:text-red-700 font-bold transition-all group min-w-[70px]">
              <span className="text-xl md:text-2xl group-hover:scale-110 transition-transform">🎮</span>
              <span className="text-[11px] md:text-base text-center md:text-left">3D</span>
            </Link>
          </nav>
          
          <div className="hidden md:block p-6 text-xs text-slate-400 font-bold text-center border-t border-slate-100">
            &copy; {new Date().getFullYear()} HRS Haasdonk U8
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col bg-slate-50 overflow-hidden relative min-h-0">
          {/* Top header only visible on mobile */}
          <Link href="/" className="md:hidden bg-white p-4 text-center shadow-sm border-b border-slate-200 z-10 shrink-0 flex items-center justify-center gap-3">
            <img src="/opengraph-image.png" alt="Logo" className="w-8 h-8 object-contain" />
            <h1 className="text-xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-red-600 to-red-800">
              U8 HAASDONK
            </h1>
          </Link>
          
          <div className="flex-1 overflow-y-auto w-full h-full relative">
            {children}
          </div>
        </main>
        
      </body>
    </html>
  );
}
