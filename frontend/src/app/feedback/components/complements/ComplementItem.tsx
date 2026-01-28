'use client';

type ComplementItemProps = {
  item: {
    title: string;
    content: string;
  };
  idx: number;
  isExpanded: boolean;
  onToggle: () => void;
};

export default function ComplementItem({ item, idx, isExpanded, onToggle }: ComplementItemProps) {
  return (
    <article
      className={`relative overflow-hidden rounded-2xl border transition-all duration-500 ${
        isExpanded
          ? 'border-blue-200 bg-blue-50/40 shadow-[0_8px_20px_-6px_rgba(37,99,235,0.1)]'
          : 'border-slate-100 bg-white hover:border-blue-100 hover:bg-slate-50/50'
      }`}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between p-5 text-left cursor-pointer"
      >
        <div className="group flex items-center gap-5">
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-black transition-all ${
              isExpanded ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
            }`}
          >
            {idx + 1}
          </span>
          <h3
            className={`text-md group-hover:font-bold ${isExpanded ? 'text-blue-700' : 'text-slate-700'}`}
          >
            {item.title}
          </h3>
        </div>

        <div className={`relative h-6 w-6 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`h-0.5 w-4 rounded-full ${isExpanded ? 'bg-blue-600' : 'bg-slate-300'}`}
            />
          </div>
          <div
            className={`absolute inset-0 flex items-center justify-center transition-transform ${
              isExpanded ? 'rotate-90 scale-0' : 'rotate-90'
            }`}
          >
            <div className="h-0.5 w-4 rounded-full bg-slate-300" />
          </div>
        </div>
      </button>

      <div
        className={`grid transition-all duration-500 ${
          isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-6 pl-[4.5rem]">
            <div className="rounded-xl bg-white/80 p-5 text-[15px] leading-8 text-slate-600 shadow-inner border border-blue-50/50">
              <div className="whitespace-pre-wrap break-keep font-medium">{item.content}</div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
