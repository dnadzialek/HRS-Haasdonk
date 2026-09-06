import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation, { MobileHeader } from "@/components/Navigation";

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
      <body className={`${inter.className} bg-slate-50 text-slate-900 flex flex-col-reverse md:flex-row h-[100dvh] max-h-[100dvh] w-full overflow-hidden selection:bg-red-600 selection:text-white`} suppressHydrationWarning>
        
        <Navigation />

        {/* Main Content */}
        <main className="flex-1 flex flex-col bg-slate-50 overflow-hidden relative min-h-0">
          <MobileHeader />
          
          <div className="flex-1 overflow-y-auto w-full h-full relative">
            {children}
          </div>
        </main>
        
      </body>
    </html>
  );
}
