import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

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
        <div className="flex h-screen w-full bg-[var(--background)]">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-8">
            <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(108,92,231,0.12)]">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
