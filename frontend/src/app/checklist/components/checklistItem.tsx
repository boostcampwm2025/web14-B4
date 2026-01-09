import React from 'react';
import Image from 'next/image';

interface ChecklistItemProps {
  id: string;
  content: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const ChecklistItem: React.FC<ChecklistItemProps> = ({
  id,
  content,
  checked = false,
  onChange,
}) => {
  return (
    <label
      htmlFor={id}
      className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-colors ${
        checked ? 'bg-primary text-white' : 'text-gray-700'
      }`}
      style={{ backgroundColor: checked ? undefined : 'var(--color-bg-default)' }}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="hidden"
      />
      <div className="w-5 h-5 relative shrink-0">
        <Image
          src={checked ? '/images/checkbox-checked.png' : '/images/checkbox-unchecked.png'}
          alt={checked ? '체크됨' : '체크안됨'}
          width={20}
          height={20}
          className="object-contain"
        />
      </div>
      <span className="text-base font-medium">{content}</span>
    </label>
  );
};
