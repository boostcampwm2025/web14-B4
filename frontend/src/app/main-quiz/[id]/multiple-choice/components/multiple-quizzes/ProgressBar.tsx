'use client';

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = Math.min(((current + 1) / total) * 100, 100);
  const progress = `${current + 1}/${total}`;

  return (
    <div className="flex items-center gap-4 mb-2">
      {/* bar */}
      <div className="flex-1 h-2 bg-[var(--color-gray-light)] rounded-[10px] overflow-hidden">
        <div
          className="h-full bg-[var(--color-primary)] transition-all duration-300 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <span className="text-sm font-bold text-[var(--color-primary)]">{progress}</span>
    </div>
  );
}
