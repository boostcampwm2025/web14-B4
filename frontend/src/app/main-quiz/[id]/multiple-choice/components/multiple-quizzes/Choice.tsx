import { useState } from 'react';

interface ChoiceProps {
  text?: string;
  isCorrect: boolean;
}

const defaultClass =
  'bg-white border-[var(--color-gray-light)] text-gray-800 hover:border-[var(--color-primary)] hover:bg-[var(--color-accent-sky)] hover:-translate-y-[2px]';
const correctClass =
  'bg-[var(--color-primary)] border-[var(--color-primary)] text-white shadow-[0_10px_20px_rgba(74,137,255,0.3)] transform scale-[1.03] transition-transform duration-200 ease-out';
const wrongClass =
  'bg-red-500 border-red-500 text-white shadow-[0_10px_20px_rgba(239,68,68,0.3)] shake';

export default function Choice({ text = '선택지 내용이 없습니다', isCorrect }: ChoiceProps) {
  const [selected, setSelected] = useState(false);

  const selectedClass = isCorrect ? correctClass : wrongClass;

  const handleClick = () => {
    setSelected(true);

    if (!isCorrect) {
      setTimeout(() => {
        setSelected(false);
      }, 500);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`relative text-left text-base cursor-pointer w-150 h-16 px-6 rounded-4xl border-3 transition-all duration-200 ease-in-out ${
        selected ? selectedClass : defaultClass
      }`}
    >
      {text}
    </button>
  );
}
