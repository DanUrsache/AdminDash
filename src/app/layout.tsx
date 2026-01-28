import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AdminDash",
  description: "Personal admin dashboard for tasks, projects, and ideas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex min-h-screen w-full bg-transparent">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-4 md:p-10">
            <MobileNav />
            <div className="rounded-3xl border border-white/10 bg-[rgba(20,20,24,0.85)] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.45)] md:p-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
