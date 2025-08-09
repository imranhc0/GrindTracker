"use client";
import Icon from "@/components/Icon";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 text-white backdrop-blur border-b border-white/10 gradient-bg">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="Rocket" className="w-5 h-5 text-white" />
          <div className="font-semibold tracking-wide">GrindTracker</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-xs opacity-90">Stay on the grind 💪</div>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

