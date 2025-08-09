"use client";
import { useApp } from "@/context/AppContext";
import GoalCard from "@/components/GoalCard";
import { todayKey } from "@/lib/date";

import GoalsInline from "./sections/GoalsInline";
import DailyInline from "./sections/DailyInline";
import StatsMonthly from "./sections/StatsMonthly";


export default function Home() {
  const { goalsWithProgress, addTask, updateGoal, setToast, gamification } = useApp();

  return (
    <div className="space-y-6">
      <Hero
        gamification={gamification}
        onNewGoal={() => {
          // Scroll to goals section
          document.getElementById('goals')?.scrollIntoView({ behavior: 'smooth' });
        }}
        onQuickTask={() => {
          // Scroll to daily section
          document.getElementById('daily')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />
      {/* <Tabs /> */}
      <section id="dashboard" className="space-y-4">
        <h2 className="text-2xl font-bold gradient-text">Dashboard</h2>
        <div className="hr-accent" />
        <div className="grid-goals">
          {goalsWithProgress.map(g => (
            <GoalCard
              key={g.id}
              goal={g}
              onAddTask={() => {
                // Open the GoalsInline task modal instead of prompt
                const evt = new CustomEvent('open-add-task-modal', { detail: { goalId: g.id } });
                window.dispatchEvent(evt);
              }}
              onToggleActive={() => updateGoal(g.id, { isActive: !g.isActive })}
            />
          ))}
          {goalsWithProgress.length === 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400">No goals yet. Create one below.</p>
          )}
        </div>
      </section>

      {/* Goals and Daily in same row with aligned tops */}
      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <section id="goals" className="space-y-3 scroll-mt-24">
          <div className="flex items-center gap-2">
            <Icon name="Target" className="w-5 h-5 text-indigo-600" />
            <h2 className="text-2xl font-bold">Goals</h2>
          </div>
          <div className="hr-accent" />
          <GoalsInline />
        </section>

        <section id="daily" className="space-y-3 scroll-mt-24">
          <div className="flex items-center gap-2">
            <Icon name="CheckCircle" className="w-5 h-5 text-green-600" />
            <h2 className="text-2xl font-bold">Today's Grind</h2>
          </div>
          <div className="hr-accent" />
          <DailyInline />
        </section>
      </div>

      <section id="stats" className="space-y-4 scroll-mt-24">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Icon name="Award" className="w-5 h-5 text-purple-600" />
          Stats
        </h2>
        <StatsMonthly />
      </section>
    </div>
  );
}

function Tabs() {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'Target' },
    { id: 'goals', label: 'Goals', icon: 'Plus' },
    { id: 'daily', label: "Today's Grind", icon: 'CheckCircle' },
    { id: 'stats', label: 'Stats', icon: 'Award' },
  ];
  return (
    <div className="sticky top-[56px] z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-black/10 dark:border-white/10">
      <div className="max-w-5xl mx-auto flex gap-1 overflow-x-auto p-2 scrollbar-hide">
        {tabs.map(t => (
          <a
            key={t.id}
            href={`#${t.id}`}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm border border-transparent hover:bg-black/5 dark:hover:bg-white/10 hover:border-indigo-200 dark:hover:border-indigo-700 transition-all whitespace-nowrap"
          >
            <Icon name={t.icon} className="w-4 h-4" />
            <span className="hidden sm:inline">{t.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

import { motion } from "framer-motion";
import Icon from "@/components/Icon";

function Hero({ gamification, onNewGoal, onQuickTask }) {
  const pct = Math.round((gamification.xp / (gamification.level * 100)) * 100);

  return (
    <motion.div layout className="grid-hero section p-6">
      {/* Stats Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted">Level</div>
            <div className="text-3xl font-bold">{gamification.level}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted">XP</div>
            <div className="text-3xl font-bold">{gamification.xp}</div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-2 bg-black/10 dark:bg-white/10 rounded overflow-hidden">
            <motion.div
              className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ type: 'spring', stiffness: 200, damping: 24 }}
            />
          </div>
          <div className="text-xs text-muted">{pct}% to next level</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col gap-3">
        <motion.button
          onClick={onNewGoal}
          className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Icon name="Target" className="w-5 h-5" />
          New Goal
        </motion.button>
        <motion.button
          onClick={onQuickTask}
          className="flex items-center gap-2 px-4 py-3 border border-black/20 dark:border-white/20 rounded-lg button-hover transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Icon name="Plus" className="w-5 h-5" />
          Quick Task
        </motion.button>
      </div>
    </motion.div>
  );
}


