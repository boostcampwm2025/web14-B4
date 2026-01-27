import { ImportanceItem } from '../../types/importanceItem';
import { ImportanceBadge } from './ImportanceBadge';

export function ImportanceGroup({ title, items }: { title: string; items: ImportanceItem[] }) {
  const isEmpty = items.length === 0;

  return (
    <div className="grid grid-cols-[130px_1fr] h-40 gap-4 py-5 items-start">
      <div className="flex items-center pl-2 py-1.5 text-xl font-semibold">{title}</div>

      {isEmpty ? (
        <div className="flex items-center py-2.5 text-sm text-slate-400">
          아직 푼 문제가 없습니다
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {items.map((item) => (
            <ImportanceBadge key={item.solvedQuizId} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
