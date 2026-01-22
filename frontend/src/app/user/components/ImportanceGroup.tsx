import { Importance } from '@/types/solvedQuiz.types';
import { Item } from './ImportanceBoard';

export function ImportanceGroup({
  title,
  importance,
  items,
}: {
  title: string;
  importance: Importance;
  items: Item[];
}) {
  const borderColor =
    importance === 'HIGH'
      ? 'border-l-red-400'
      : importance === 'NORMAL'
        ? 'border-l-yellow-400'
        : 'border-l-emerald-500';

  return (
    <div className="mb-3 rounded-2xl bg-white p-6 shadow-sm">
      <div
        className={`mb-5 flex items-center gap-2 border-l-4 pl-2 text-base font-bold text-slate-800 ${borderColor}`}
      >
        {title}
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            className={`group flex cursor-pointer flex-col gap-2 rounded-lg border border-slate-200 bg-white p-3 text-center text-sm font-medium text-slate-500 transition-all hover:-translate-y-0.5 hover:border-blue-500 hover:text-blue-500 hover:shadow-md ${
              importance === 'HIGH'
                ? 'border-l-4 border-l-red-400'
                : importance === 'NORMAL'
                  ? 'border-l-4 border-l-yellow-400'
                  : 'border-l-4 border-l-emerald-500'
            }`}
          >
            <span className="text-[11px] text-slate-400">{item.id}</span>
            <span className="truncate">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
