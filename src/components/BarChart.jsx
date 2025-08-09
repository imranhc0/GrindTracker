"use client";
// Lightweight bar chart using plain divs; data: [{label, value}] with 0..1 values
export default function BarChart({ data }) {
  const max = Math.max(1, ...data.map(d => d.value));
  return (
    <div className="w-full">
      <div className="flex items-end gap-1 h-32">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center">
            <div
              className="w-full bg-green-500 rounded-t"
              style={{ height: `${(d.value / max) * 100}%` }}
              title={`${d.label}: ${d.value}`}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-1 text-[10px] text-center mt-1">
        {data.map((d, i) => (
          <div key={i} className="flex-1 truncate" title={d.label}>{d.label}</div>
        ))}
      </div>
    </div>
  );
}

