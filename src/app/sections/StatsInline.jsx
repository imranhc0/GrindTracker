"use client";
import { useMemo, useState } from "react";
import { useApp } from "@/context/AppContext";
import { daysInMonth, startOfMonth, todayKey } from "@/lib/date";
import { Bar } from "react-chartjs-2";
import Icon from "@/components/Icon";
import ContributionHeatmap from "@/components/ContributionHeatmap";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function StatsInline() {
  const { goals, logs, tasks } = useApp();
  const [selectedGoal, setSelectedGoal] = useState(goals[0]?.id || "");

  const monthStart = startOfMonth();
  const days = daysInMonth();
  const labels = Array.from({ length: days }, (_, i) => {
    const d = new Date(monthStart);
    d.setDate(i + 1);
    return todayKey(d).slice(-2);
  });

  const dataset = useMemo(() => {
    const goalId = selectedGoal || goals[0]?.id;
    if (!goalId) return { labels, datasets: [] };

    const keys = Array.from({ length: days }, (_, i) => {
      const d = new Date(monthStart);
      d.setDate(i + 1);
      return todayKey(d);
    });

    const completedByDay = new Map(keys.map(l => [l, 0]));
    logs.filter(l => l.goalId === goalId && keys.includes(l.date)).forEach(l => {
      completedByDay.set(l.date, l.tasksCompleted);
    });
    tasks.filter(t => t.goalId === goalId).forEach(t => {
      const key = todayKey(new Date(t.date));
      const cur = completedByDay.get(key) || 0;
      completedByDay.set(key, cur + (t.isCompleted ? 1 : 0));
    });

    const data = keys.map(k => completedByDay.get(k) || 0);

    return {
      labels,
      datasets: [
        {
          label: 'Tasks Completed',
          data,
          backgroundColor: (ctx) => {
            const { ctx: c, chartArea } = ctx.chart;
            if (!chartArea) return 'rgba(109,94,252,0.6)';
            const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, 'rgba(109,94,252,0.9)');
            gradient.addColorStop(1, 'rgba(168,85,247,0.6)');
            return gradient;
          },
          borderRadius: 6,
          barThickness: 12,
        },
      ],
    };
  }, [selectedGoal, goals, logs, tasks]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, title: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: 'var(--text-muted)' } },
      y: { grid: { color: 'rgba(0,0,0,0.06)' }, ticks: { color: 'var(--text-muted)' } }
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-700 dark:text-gray-300">Goal:</label>
        <select className="input px-2 py-1 rounded text-gray-900 dark:text-gray-100" value={selectedGoal} onChange={e => setSelectedGoal(e.target.value)}>
          {goals.map(g => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
      </div>
      {goals.length === 0 ? (
        <div className="section p-6 text-center">
          <Icon name="Award" className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400">No goals yet. Create a goal to see your progress stats!</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="section p-4 stats-pattern" style={{ height: 280 }}>
            <Bar data={dataset} options={options} />
          </div>
          <div>
            <div className="text-sm font-semibold mb-2">Monthly Heatmap</div>
            <ContributionHeatmap logs={logs} tasks={tasks} weeks={16} />
          </div>
        </div>
      )}
    </div>
  );
}

