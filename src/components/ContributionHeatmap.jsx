"use client";
import { useMemo } from "react";
import { addDays, toDateKey } from "@/lib/date";

// Responsive GitHub-style contribution heatmap
// Renders the last `weeks` weeks ending today, aligned Sunday-Saturday
export default function ContributionHeatmap({ logs = [], tasks = [], weeks = 16, className = "" }) {
  const { cells, max } = useMemo(() => {
    const today = new Date();
    const daysTotal = weeks * 7;

    // Start from the Sunday of the earliest week
    const start = new Date(today);
    start.setHours(0, 0, 0, 0);
    const tmp = addDays(start, -(daysTotal - 1));
    const startSunday = addDays(tmp, -tmp.getDay());

    const counts = new Map();

    // Aggregate from logs (historical)
    logs.forEach(l => {
      const key = l.date;
      counts.set(key, (counts.get(key) || 0) + (l.tasksCompleted || 0));
    });

    // Include current tasks (e.g., today) that may not yet be logged
    tasks.forEach(t => {
      if (t.isCompleted) {
        const key = toDateKey(t.date);
        counts.set(key, (counts.get(key) || 0) + 1);
      }
    });

    const cells = [];
    let max = 0;
    for (let i = 0; i < daysTotal; i++) {
      const d = addDays(startSunday, i);
      const key = toDateKey(d);
      const value = counts.get(key) || 0;
      if (value > max) max = value;
      cells.push({ date: d, key, value });
    }
    return { cells, max };
  }, [logs, tasks, weeks]);

  function level(v) {
    if (v <= 0 || max <= 0) return 0;
    const ratio = v / max; // 0..1
    if (ratio > 0.75) return 4;
    if (ratio > 0.5) return 3;
    if (ratio > 0.25) return 2;
    return 1;
  }

  function colorFor(lvl) {
    switch (lvl) {
      case 1: return "rgba(109,94,252,0.25)"; // brand-primary @ 25%
      case 2: return "rgba(109,94,252,0.45)";
      case 3: return "rgba(109,94,252,0.7)";
      case 4: return "rgba(109,94,252,1)";
      default: return "rgba(0,0,0,0.08)";
    }
  }

  return (
    <div className={className}>
      <div className="section p-4 overflow-x-auto sm:overflow-x-visible" style={{ maxWidth: '100%' }}>
        <div className="heatmap-grid">
          {cells.map((c, i) => {
            const lvl = level(c.value);
            return (
              <div
                key={c.key + i}
                title={`${c.key}: ${c.value} completed`}
                className="heatmap-cell"
                style={{ backgroundColor: colorFor(lvl) }}
              />
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-3 flex items-center gap-2 text-xs text-muted">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map(l => (
            <span key={l} className="heatmap-legend" style={{ backgroundColor: colorFor(l) }} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}

