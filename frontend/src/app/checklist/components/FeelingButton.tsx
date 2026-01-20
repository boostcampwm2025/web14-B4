import React from 'react';
import Image from 'next/image';

interface FeelingButtonProps {
  comprehensionLevel: 'LOW' | 'NORMAL' | 'HIGH';
  label: string;
  selected: boolean;
  onClick: () => void;
}

const IMAGE_PATHS = {
  LOW: {
    blue: '/images/low-blue.svg',
    gray: '/images/low-gray.svg',
  },
  NORMAL: {
    blue: '/images/normal-blue.svg',
    gray: '/images/normal-gray.svg',
  },
  HIGH: {
    blue: '/images/high-blue.svg',
    gray: '/images/high-gray.svg',
  },
};

export const FeelingButton: React.FC<FeelingButtonProps> = ({
  comprehensionLevel,
  label,
  selected,
  onClick,
}) => {
  const imagePath = IMAGE_PATHS[comprehensionLevel][selected ? 'blue' : 'gray'];

  return (
    <label className={`flex flex-col items-center gap-3 p-6 rounded-2xl cursor-pointer`}>
      <input
        type="radio"
        name="feeling"
        value={comprehensionLevel}
        checked={selected}
        onChange={onClick}
        className="hidden"
      />
      <div className="w-[94px] h-[93px] relative">
        <Image
          src={imagePath}
          alt={label}
          width={94}
          height={93}
          className="object-contain"
          draggable={false}
        />
      </div>
      <span className="text-base font-medium text-gray-700">{label}</span>
    </label>
  );
};
