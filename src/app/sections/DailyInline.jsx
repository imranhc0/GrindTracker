"use client";
import { useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { todayKey } from "@/lib/date";
import Icon from "@/components/Icon";

export default function DailyInline() {
  const { goals, tasks, toggleTask, removeTask } = useApp();
  const today = todayKey();

  const tasksByGoal = useMemo(() => {
    const map = new Map();
    tasks.filter(t => t.date === today).forEach(t => {
      const arr = map.get(t.goalId) || [];
      arr.push(t);
      map.set(t.goalId, arr);
    });
    return map;
  }, [tasks, today]);

  return (
    <div className="space-y-3">
      {goals.filter(g => g.isActive !== false).map(g => (
        <div key={g.id} className="section p-3">
          <div className="font-medium mb-2 flex items-center gap-2 text-sm">
            <Icon name="Target" className="w-3 h-3 text-indigo-600" />
            {g.name}
          </div>
          <ul className="space-y-2">
            {(tasksByGoal.get(g.id) || []).map(t => (
              <li key={t.id} className="flex items-center justify-between group">
                <label className="flex items-center gap-2 flex-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={t.isCompleted}
                    onChange={() => toggleTask(t.id)}
                    className="w-3 h-3 text-indigo-600 rounded focus:ring-indigo-500 focus:ring-1"
                  />
                  <span className={`text-sm transition-all ${t.isCompleted ? 'line-through opacity-60' : ''}`}>
                    {t.name}
                  </span>
                </label>
                <button
                  className="text-xs text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-700"
                  onClick={() => removeTask(t.id)}
                >
                  ×
                </button>
              </li>
            ))}
            {(tasksByGoal.get(g.id) || []).length === 0 && (
              <li className="text-xs text-gray-500 dark:text-gray-500 italic">No tasks for today.</li>
            )}
          </ul>
        </div>
      ))}
      {goals.filter(g => g.isActive !== false).length === 0 && (
        <div className="section p-4 text-center">
          <Icon name="Target" className="w-8 h-8 text-gray-400 dark:text-gray-600 mx-auto mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">No active goals. Create a goal to start tracking daily tasks!</p>
        </div>
      )}
    </div>
  );
}

