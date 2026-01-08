import React from 'react';
import Image from 'next/image';

interface FeelingButtonProps {
  feeling: 'bad' | 'normal' | 'good';
  label: string;
  selected: boolean;
  onClick: () => void;
}

export const FeelingButton: React.FC<FeelingButtonProps> = ({
  feeling,
  label,
  selected,
  onClick,
}) => {
  // 선택 여부에 따라 다른 이미지 사용
  const getImagePath = () => {
    const prefix = selected ? 'blue' : 'gray';
    return `/images/${feeling}-${prefix}.png`;
  };

  return (
    <label className={`flex flex-col items-center gap-3 p-6 rounded-2xl cursor-pointer`}>
      <input
        type="radio"
        name="feeling"
        value={feeling}
        checked={selected}
        onChange={onClick}
        className="hidden"
      />
      <div className="w-[94px] h-[93px] relative">
        <Image src={getImagePath()} alt={label} width={94} height={93} className="object-contain" />
      </div>
      <span className="text-base font-medium text-gray-700">{label}</span>
    </label>
  );
};
