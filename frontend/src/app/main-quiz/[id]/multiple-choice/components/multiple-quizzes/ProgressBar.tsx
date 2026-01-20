'use client';

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = Math.min((current / total) * 100, 100);

  return (
    <div className="flex items-center gap-[15px] mb-[30px]">
      {/* bar */}
      <div className="flex-1 h-2 bg-gray-200 rounded-[10px] overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-300 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* text */}
      <span className="text-sm font-bold text-blue-500">
        {current}/{total}
      </span>
    </div>
  );
}
