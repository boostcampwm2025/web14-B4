interface TooltipProps {
  title: string;
  description: string;
}

export function Tooltip({ title, description }: TooltipProps) {
  return (
    <div
      className="
        pointer-events-none absolute left-1/2 bottom-full z-50 mb-2 w-max max-w-[320px]
        h-15 flex items-center
        -translate-x-1/2 scale-95 opacity-0
        rounded-lg bg-slate-900 px-5 py-1.5 text-xs text-white shadow-lg
        transition-all duration-200
        group-hover:scale-100 group-hover:opacity-100
        whitespace-nowrap
      "
    >
      <span className="text-base font-medium">{title}</span>
      <span className="mx-1 text-slate-400 px-1">·</span>
      <span className="text-slate-200 truncate text-sm">{description}</span>

      {/* 화살표 */}
      <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-slate-900" />
    </div>
  );
}
