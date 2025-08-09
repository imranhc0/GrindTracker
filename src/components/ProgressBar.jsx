export default function ProgressBar({ value = 0, color = 'var(--brand-accent)' }) {
  const pct = Math.min(Math.max(value, 0), 100);
  return (
    <div className="w-full h-2 rounded overflow-hidden" style={{ background: 'linear-gradient(to right, rgba(0,0,0,.06), rgba(0,0,0,.04))' }}>
      <div
        className="h-2 rounded transition-all"
        style={{
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${color}, var(--brand-primary))`
        }}
      />
    </div>
  );
}

