import { useState } from 'react';

interface ChoiceProps {
  text?: string;
}

export default function Choice({ text = '선택지 내용' }: ChoiceProps) {
  const [selected, setSelected] = useState(false);

  const defaultClass =
    'bg-white border-gray-100 text-gray-500 ' +
    'hover:border-blue-500 hover:bg-blue-50 hover:-translate-y-[2px]';

  const selectedClass =
    'bg-blue-500 border-blue-500 text-white ' + 'shadow-[0_10px_20px_rgba(74,137,255,0.3)]';

  return (
    <button
      type="button"
      onClick={() => setSelected((prev) => !prev)}
      className={`'relative text-left text-base cursor-pointer w-150 h-16 px-5 rounded-4xl border-3 transition-all duration-200 ease-in-out ${selected ? selectedClass : defaultClass}`}
    >
      {text}
    </button>
  );
}
