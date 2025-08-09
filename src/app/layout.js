import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AppProvider } from "@/context/AppContext";
import { ThemeProvider } from "@/context/ThemeContext";
import ToastHost from "@/components/ToastHost";
import LevelUpHost from "@/components/LevelUpHost";
import MilestoneHost from "@/components/MilestoneHost";
import DebugStorage from "@/components/DebugStorage";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "GrindTracker",
  description: "Browser-only goal + grind tracker",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 min-h-screen`}>
        <ThemeProvider>
          <AppProvider>
            <Navbar />
            <main className="max-w-5xl mx-auto p-4 space-y-6">{children}</main>
            <ToastHost />
            <LevelUpHost />
            <MilestoneHost />
            <DebugStorage />
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
