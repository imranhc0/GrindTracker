"use client";
import { useMemo, useState } from "react";
import { useApp } from "@/context/AppContext";
import { daysInMonth, startOfMonth, todayKey } from "@/lib/date";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Icon from "@/components/Icon";
import ContributionHeatmap from "@/components/ContributionHeatmap";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function StatsMonthly() {
  const { goals, logs, tasks } = useApp();

  // Month navigation
  const [monthDate, setMonthDate] = useState(() => new Date());
  const [goalFilter, setGoalFilter] = useState("all");

  const monthStart = useMemo(() => new Date(monthDate.getFullYear(), monthDate.getMonth(), 1), [monthDate]);
  const monthEnd = useMemo(() => new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0), [monthDate]);
  const days = daysInMonth(monthDate);
  const labels = Array.from({ length: days }, (_, i) => String(i + 1));

  const summary = useMemo(() => {
    // Build day keys of this month
    const keys = Array.from({ length: days }, (_, i) => {
      const d = new Date(monthStart);
      d.setDate(i + 1);
      return todayKey(d);
    });

    // Gather all items for selected scope
    const goalId = goalFilter === 'all' ? null : goalFilter;

    const dayCounts = new Map(keys.map(k => [k, 0]));

    logs.forEach(l => {
      if (keys.includes(l.date) && (!goalId || l.goalId === goalId)) {
        dayCounts.set(l.date, (dayCounts.get(l.date) || 0) + (l.tasksCompleted || 0));
      }
    });

    // include in-progress tasks (e.g., today) within this month
    tasks.forEach(t => {
      if (goalId && t.goalId !== goalId) return;
      const key = todayKey(new Date(t.date));
      if (!keys.includes(key)) return;
      if (t.isCompleted) dayCounts.set(key, (dayCounts.get(key) || 0) + 1);
    });

    const data = keys.map(k => dayCounts.get(k) || 0);
    const total = data.reduce((a, b) => a + b, 0);
    const activeDays = data.filter(v => v > 0).length;
    const best = Math.max(0, ...data);

    return { keys, data, total, activeDays, best };
  }, [logs, tasks, days, monthStart, goalFilter]);

  const dataset = useMemo(() => {
    return {
      labels,
      datasets: [
        {
          label: 'Completed',
          data: summary.data,
          backgroundColor: (ctx) => {
            const { ctx: c, chartArea } = ctx.chart;
            if (!chartArea) return 'rgba(109,94,252,0.7)';
            const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            g.addColorStop(0, 'rgba(109,94,252,0.9)');
            g.addColorStop(1, 'rgba(168,85,247,0.5)');
            return g;
          },
          borderRadius: 6,
          barThickness: 14,
          categoryPercentage: 0.9,
          maxBarThickness: 18,
        }
      ]
    };
  }, [labels, summary.data]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        grid: { display: false },
        ticks: { maxRotation: 0, color: 'var(--text-muted)', autoSkip: true, maxTicksLimit: 15 },
      },
      y: {
        grid: { color: 'rgba(0,0,0,0.06)' },
        ticks: { color: 'var(--text-muted)', precision: 0 }
      }
    }
  };

  function prevMonth() {
    const d = new Date(monthDate);
    d.setMonth(d.getMonth() - 1);
    setMonthDate(d);
  }
  function nextMonth() {
    const d = new Date(monthDate);
    d.setMonth(d.getMonth() + 1);
    setMonthDate(d);
  }

  const monthLabel = monthDate.toLocaleString(undefined, { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-4">
      {/* Controls + Summary */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button className="btn btn-outline" onClick={prevMonth}><Icon name="ChevronLeft" className="w-4 h-4"/></button>
          <div className="text-sm font-semibold">{monthLabel}</div>
          <button className="btn btn-outline" onClick={nextMonth}><Icon name="ChevronRight" className="w-4 h-4"/></button>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700 dark:text-gray-300">Goal:</label>
          <select className="input px-2 py-1 rounded text-gray-900 dark:text-gray-100" value={goalFilter} onChange={e => setGoalFilter(e.target.value)}>
            <option value="all">All goals</option>
            {goals.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="section p-3 text-center"><div className="text-xs text-muted">Completed</div><div className="text-xl font-bold">{summary.total}</div></div>
        <div className="section p-3 text-center"><div className="text-xs text-muted">Active Days</div><div className="text-xl font-bold">{summary.activeDays}</div></div>
        <div className="section p-3 text-center"><div className="text-xs text-muted">Best Day</div><div className="text-xl font-bold">{summary.best}</div></div>
      </div>

      {goals.length === 0 ? (
        <div className="section p-6 text-center">
          <Icon name="Award" className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400">No goals yet. Create a goal to see your progress stats!</p>
        </div>
      ) : (
        <div className="section p-4 stats-pattern" style={{ height: 300 }}>
          <Bar data={dataset} options={options} />
        </div>
      )}

      {/* Optional mini heatmap for the month – helps spot streaks visually */}
      {/* <div>
        <div className="text-sm font-semibold mb-2">Monthly Heatmap</div>
        <ContributionHeatmap logs={logs} tasks={tasks} weeks={12} />
      </div> */}
    </div>
  );
}

