"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { load, save, STORAGE_KEYS } from "@/lib/storage";
import { todayKey, startOfMonth, toDateKey } from "@/lib/date";

// Data shapes
// Goal: { id, name, deadline, type: 'one-time'|'recurring', createdAt, isActive }
// Task: { id, goalId, name, isCompleted, date, createdAt }
// Log:  { goalId, date, tasksCompleted, totalTasks }

const AppContext = createContext(null);

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function AppProvider({ children }) {
  const [goals, setGoals] = useState([]);
  const [tasks, setTasks] = useState([]); // per-day tasks
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null); // {type, message}
  const [gamification, setGamification] = useState({ xp: 0, level: 1, achievements: [] });
  const [levelUpShow, setLevelUpShow] = useState(false);
  const [levelUpLevel, setLevelUpLevel] = useState(1);
  const [milestoneShow, setMilestoneShow] = useState(false);
  const [milestoneValue, setMilestoneValue] = useState(0);

  // Initial load
  useEffect(() => {
    const g = load(STORAGE_KEYS.GOALS, []);
    const t = load(STORAGE_KEYS.TASKS, []);
    const l = load(STORAGE_KEYS.LOGS, []);
    const gm = load(STORAGE_KEYS.GAMIFICATION, { xp: 0, level: 1, achievements: [], lastCelebratedLevel: 0, achievedMilestones: [] });
    setGoals(g || []);
    setTasks(t || []);
    setLogs(l || []);
    setGamification(gm || { xp: 0, level: 1, achievements: [], lastCelebratedLevel: 0, achievedMilestones: [] });
    setLoading(false);
  }, []);

  // Persistence - only save after initial load is complete
  useEffect(() => {
    if (!loading) save(STORAGE_KEYS.GOALS, goals);
  }, [goals, loading]);
  useEffect(() => {
    if (!loading) save(STORAGE_KEYS.TASKS, tasks);
  }, [tasks, loading]);
  useEffect(() => {
    if (!loading) save(STORAGE_KEYS.LOGS, logs);
  }, [logs, loading]);
  useEffect(() => {
    if (!loading) save(STORAGE_KEYS.GAMIFICATION, gamification);
  }, [gamification, loading]);

  // Daily reset for recurring tasks and logging completion
  useEffect(() => {
    if (loading) return;

    // Ensure we have tasks for today for each active goal with recurring type
    const today = todayKey();
    const activeGoals = goals.filter(g => g.isActive !== false);
    let modified = false;

    activeGoals.forEach(g => {
      // For recurring goals, if there are tasks from previous day, log them and reset
      const prevTasks = tasks.filter(t => t.goalId === g.id && t.date !== today);
      const todaysTasks = tasks.filter(t => t.goalId === g.id && t.date === today);

      if (prevTasks.length > 0) {
        // compute per-date aggregations for prev dates
        const grouped = prevTasks.reduce((acc, t) => {
          acc[t.date] = acc[t.date] || { goalId: g.id, date: t.date, tasksCompleted: 0, totalTasks: 0 };
          acc[t.date].totalTasks += 1;
          if (t.isCompleted) acc[t.date].tasksCompleted += 1;
          return acc;
        }, {});
        const newLogs = Object.values(grouped);
        if (newLogs.length) {
          setLogs(prev => mergeLogs(prev, newLogs));
        }

        // Remove prev day's tasks for this goal (recurring reset)
        setTasks(prev => prev.filter(t => !(t.goalId === g.id && t.date !== today)));
        modified = true;
      }

      // If no tasks for today exist yet, carry over names from last day of this goal
      if (todaysTasks.length === 0) {
        const lastDayTasks = prevTasks.filter(t => t.date !== today);
        const base = lastDayTasks.length ? lastDayTasks : [];
        if (base.length) {
          const clones = base.map(t => ({
            ...t,
            id: uid(),
            isCompleted: false,
            date: today,
            createdAt: Date.now(),
          }));
          setTasks(prev => [...prev, ...clones]);
          modified = true;
        }
      }
    });

    if (modified) setToast({ type: 'info', message: 'Daily reset completed.' });
  }, [goals, tasks, loading]);

  function mergeLogs(existing, incoming) {
    const map = new Map(existing.map(l => [`${l.goalId}_${l.date}`, l]));
    incoming.forEach(l => {
      const key = `${l.goalId}_${l.date}`;
      const cur = map.get(key);
      if (!cur) map.set(key, l);
      else map.set(key, { ...cur, tasksCompleted: l.tasksCompleted, totalTasks: l.totalTasks });
    });
    return Array.from(map.values());
  }

  // CRUD for goals
  function createGoal({ name, deadline, type }) {
    const now = Date.now();
    const goal = { id: uid(), name, deadline, type, createdAt: now, isActive: true };
    setGoals(prev => [goal, ...prev]);
    return goal;
  }
  function updateGoal(id, patch) {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...patch } : g));
  }
  function deleteGoal(id) {
    setGoals(prev => prev.filter(g => g.id !== id));
    setTasks(prev => prev.filter(t => t.goalId !== id));
    setLogs(prev => prev.filter(l => l.goalId !== id));
  }

  // Tasks
  function addTask(goalId, name, date = todayKey()) {
    const task = { id: uid(), goalId, name, isCompleted: false, date, createdAt: Date.now() };
    setTasks(prev => [task, ...prev]);
    return task;
  }
  function toggleTask(taskId) {
    setTasks(prev => {
      const updated = prev.map(t => {
        if (t.id === taskId) {
          const newTask = { ...t, isCompleted: !t.isCompleted };
          // Award XP when task is completed (not uncompleted)
          if (!t.isCompleted && newTask.isCompleted) {
            setTimeout(() => awardXP(10, 'Task Completed'), 100);
          }
          return newTask;
        }
        return t;
      });
      return updated;
    });
  }
  function removeTask(taskId) {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  }

  // Computed helpers
  const goalsWithProgress = useMemo(() => {
    const today = todayKey();
    const monthStart = startOfMonth();

    return goals.map(g => {
      const goalLogs = logs.filter(l => l.goalId === g.id);
      const monthLogs = goalLogs.filter(l => new Date(l.date) >= monthStart);
      const daysWorked = monthLogs.filter(l => l.tasksCompleted > 0).length;

      const todayTasks = tasks.filter(t => t.goalId === g.id && t.date === today);
      const totalToday = todayTasks.length;
      const completedToday = todayTasks.filter(t => t.isCompleted).length;
      const completion = totalToday ? Math.round((completedToday / totalToday) * 100) : 0;

      const streak = computeStreak(g.id, logs, tasks, (milestone) => {
        // Check if this milestone hasn't been achieved yet
        const achievedMilestones = gamification.achievedMilestones || [];
        const milestoneKey = `${g.id}_${milestone}`;
        if (!achievedMilestones.includes(milestoneKey)) {
          setMilestoneValue(milestone);
          setMilestoneShow(true);
          // Update achieved milestones
          setGamification(prev => ({
            ...prev,
            achievedMilestones: [...(prev.achievedMilestones || []), milestoneKey]
          }));
        }
      });

      return { ...g, completion, daysWorked, streak, totalToday, completedToday };
    });
  }, [goals, logs, tasks]);

  function awardXP(amount, reason) {
    setGamification(prev => {
      let xp = prev.xp + amount;
      let level = prev.level;
      const nextLevelXp = level * 100;
      const achievements = [...prev.achievements];
      const lastCelebratedLevel = prev.lastCelebratedLevel || 0;

      while (xp >= nextLevelXp) {
        xp -= nextLevelXp;
        level += 1;
      }

      // Trigger level-up animation if we leveled up and haven't celebrated this level
      if (level > prev.level && level > lastCelebratedLevel) {
        setLevelUpLevel(level);
        setLevelUpShow(true);
        setTimeout(() => {
          setGamification(current => ({ ...current, lastCelebratedLevel: level }));
        }, 100);
      }

      if (reason && !achievements.includes(reason)) achievements.push(reason);
      return { xp, level, achievements, lastCelebratedLevel };
    });
    setToast({ type: 'success', message: `+${amount} XP` });
  }

  const value = {
    loading,
    toast, setToast,
    goals, setGoals,
    tasks, setTasks,
    logs, setLogs,
    gamification,
    levelUpShow, setLevelUpShow,
    levelUpLevel,
    milestoneShow, setMilestoneShow,
    milestoneValue,

    goalsWithProgress,

    createGoal, updateGoal, deleteGoal,
    addTask, toggleTask, removeTask,
    awardXP,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

function computeStreak(goalId, logs, tasks, onMilestone) {
  // Streak counts consecutive days up to today where at least 1 task completed.
  // Include today based on current tasks state.
  const byDate = new Map();
  logs.filter(l => l.goalId === goalId).forEach(l => byDate.set(l.date, l.tasksCompleted > 0));
  tasks.filter(t => t.goalId === goalId).forEach(t => {
    const key = toDateKey(t.date);
    const done = t.isCompleted || byDate.get(key) === true;
    byDate.set(key, done);
  });

  let streak = 0;
  let d = new Date();
  // Walk backwards until a day with no work
  while (true) {
    const key = toDateKey(d);
    const worked = byDate.get(key) === true;
    if (worked) streak += 1; else break;
    d.setDate(d.getDate() - 1);
    // guard for long loops
    if (streak > 3650) break;
  }

  // Check for milestone achievements
  const milestones = [7, 14, 30, 60, 100];
  const currentMilestone = milestones.find(m => streak >= m && streak < m + 1);
  if (currentMilestone && onMilestone) {
    onMilestone(currentMilestone, streak);
  }

  return streak;
}

