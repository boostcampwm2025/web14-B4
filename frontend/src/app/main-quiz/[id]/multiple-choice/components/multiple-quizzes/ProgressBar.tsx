'use client';

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = Math.min((current / total) * 100, 100);
  const progress = `${current}/${total}`;

  return (
    <div className="flex items-center gap-4 mb-2">
      {/* bar */}
      <div className="flex-1 h-2 bg-gray-200 rounded-[10px] overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-300 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <span className="text-sm font-bold text-blue-500">{progress}</span>
    </div>
  );
}
