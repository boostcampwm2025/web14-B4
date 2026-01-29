import React from 'react';
import { FeelingButton } from './FeelingButton';
import { ChecklistItem } from './ChecklistItem';
import { ChecklistProps } from '../types/checklist.types';

export const Checklist: React.FC<ChecklistProps> = ({
  username,
  selectedFeeling = 'NORMAL',
  options,
  onFeelingChange,
  onOptionChange,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-5">
      <h1 className="text-2xl font-bold text-center mb-8">📝 체크리스트</h1>

      <div className="mb-6">
        <h2 className="text-xl font-medium mb-2">{username}님,</h2>
        <h2 className="text-xl font-medium mb-2">얼마나 답변했다고 생각하시나요?</h2>
        <p className="text-base text-gray-500">
          어디서 막혔었는지 뒤돌아보신다면 성장에 도움이 되실거에요.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <FeelingButton
          comprehensionLevel="LOW"
          label="답변을 못했어요"
          selected={selectedFeeling === 'LOW'}
          onClick={() => onFeelingChange?.('LOW')}
        />
        <FeelingButton
          comprehensionLevel="NORMAL"
          label="보통이에요"
          selected={selectedFeeling === 'NORMAL'}
          onClick={() => onFeelingChange?.('NORMAL')}
        />
        <FeelingButton
          comprehensionLevel="HIGH"
          label="답변을 잘했어요"
          selected={selectedFeeling === 'HIGH'}
          onClick={() => onFeelingChange?.('HIGH')}
        />
      </div>

      {/* Checklist Options */}
      <div className="flex flex-col gap-3">
        {options.map((option) => (
          <ChecklistItem
            key={option.id}
            id={option.id}
            content={option.content}
            checked={option.checked}
            onChange={(checked) => {
              onOptionChange?.(option.id, checked);
            }}
          />
        ))}
      </div>
    </div>
  );
};
