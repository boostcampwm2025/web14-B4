import React from 'react';
import Image from 'next/image';

interface FeelingButtonProps {
  comprehensionLevel: 'LOW' | 'NORMAL' | 'HIGH';
  label: string;
  selected: boolean;
  onClick: () => void;
}

const IMAGE_PATHS = {
  LOW: '/images/low-blue.svg',
  NORMAL: '/images/normal-blue.svg',
  HIGH: '/images/high-blue.svg',
};

export const FeelingButton: React.FC<FeelingButtonProps> = ({
  comprehensionLevel,
  label,
  selected,
  onClick,
}) => {
  const imagePath = IMAGE_PATHS[comprehensionLevel];

  return (
    <label
      className={[
        'group flex flex-col items-center gap-3 p-6 rounded-2xl cursor-pointer',
        'hover:scale-110',
      ].join(' ')}
    >
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
          className={[
            'object-contain',
            selected
              ? 'grayscale-0 opacity-100'
              : 'grayscale brightness-90 contrast-125 opacity-80 group-hover:grayscale-0 group-hover:brightness-100 group-hover:contrast-100 group-hover:opacity-100',
          ].join(' ')}
          draggable={false}
        />
      </div>
      <span
        className={[
          'text-base font-medium',
          selected
            ? 'text-[var(--color-primary)]'
            : 'text-gray-700 group-hover:text-[var(--color-primary)]',
        ].join(' ')}
      >
        {label}
      </span>
    </label>
  );
};
