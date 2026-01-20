import { useState } from 'react';

interface ChoiceProps {
  text?: string;
}

export default function Choice({ text = '선택지 내용' }: ChoiceProps) {
  const [selected, setSelected] = useState(false);

  const defaultClass =
    'bg-white border-[var(--color-gray-light)] text-gray-800 hover:border-[var(--color-primary)] hover:bg-[var(--color-accent-sky)]  hover:-translate-y-[2px]';

  const selectedClass =
    'bg-[var(--color-primary)] border-[var(--color-primary)] text-white ' +
    'shadow-[0_10px_20px_rgba(74,137,255,0.3)]';

  return (
    <button
      type="button"
      onClick={() => setSelected((prev) => !prev)}
      className={`relative text-left text-base cursor-pointer w-150 h-16 px-6 rounded-4xl border-3 transition-all duration-200 ease-in-out ${selected ? selectedClass : defaultClass}`}
    >
      {text}
    </button>
  );
}
