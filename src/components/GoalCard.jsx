"use client";
import { motion } from "framer-motion";
import ProgressBar from "@/components/ProgressBar";
import Icon from "@/components/Icon";

export default function GoalCard({ goal, onAddTask, onToggleActive }) {
  return (
    <motion.div
      className="section p-4 flex flex-col gap-3 h-full card-hover"
      whileHover={{ y: -2 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="font-semibold text-sm leading-tight flex-1">{goal.name}</div>
        <motion.button
          className={`text-xs px-2 py-1 rounded-full border transition-all font-semibold ${
            goal.isActive
              ? 'bg-green-600 text-white border-green-600 dark:bg-green-500 dark:text-white dark:border-green-500'
              : 'bg-gray-600 text-white border-gray-600 dark:bg-gray-500 dark:text-white dark:border-gray-500'
          }`}
          onClick={onToggleActive}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {goal.isActive ? 'Active' : 'Paused'}
        </motion.button>
      </div>

      {/* Meta info */}
      <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
        <div>Deadline: {goal.deadline || '—'}</div>
        <div>Type: {goal.type}</div>
      </div>

      {/* Progress */}
      <div className="space-y-2 flex-1">
        <ProgressBar value={goal.completion} color="var(--brand-accent)" />
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
          <div>Today: {goal.completedToday}/{goal.totalToday}</div>
          <div className="flex items-center gap-1">
            <Icon name="Flame" className="w-3 h-3 text-orange-500" />
            {goal.streak}d
          </div>
        </div>
      </div>

      {/* Action button */}
      <motion.button
        className="mt-auto text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg px-3 py-2 flex items-center gap-2 justify-center hover:from-indigo-600 hover:to-purple-700 transition-all shadow-sm"
        onClick={onAddTask}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Icon name="Plus" className="w-4 h-4" />
        Add Task
      </motion.button>
    </motion.div>
  );
}

