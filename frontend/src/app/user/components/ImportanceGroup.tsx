import { Importance } from '@/types/solvedQuiz.types';
import { ImportanceItem } from '../types/importanceItem';
import { ImportanceBadge } from './ImportanceBadge';

export function ImportanceGroup({
  title,
  importance,
  items,
}: {
  title: string;
  importance: Importance;
  items: ImportanceItem[];
}) {
  const borderColor =
    importance === 'HIGH'
      ? 'border-l-red-400'
      : importance === 'NORMAL'
        ? 'border-l-yellow-400'
        : 'border-l-emerald-500';

  return (
    <div className="grid grid-cols-[130px_1fr] gap-4 py-8 items-start h-45">
      <div className={`flex items-center pl-2 py-1.5 text-xl font-semibold`}>{title}</div>

      <div className="flex flex-wrap gap-3">
        {items.map((item) => (
          <ImportanceBadge key={item.solvedQuizId} item={item} />
        ))}
      </div>
    </div>
  );
}
