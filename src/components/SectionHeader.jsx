"use client";
import Icon from "@/components/Icon";

export default function SectionHeader({ icon, title, subtitle, actions }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-start gap-3">
        <div className="shrink-0 p-2 rounded-lg text-white shadow-sm" style={{ background: 'var(--gradient-primary)' }}>
          <Icon name={icon} className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xl font-bold gradient-text">{title}</div>
          {subtitle && <div className="text-xs text-muted mt-1">{subtitle}</div>}
        </div>
      </div>
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}

