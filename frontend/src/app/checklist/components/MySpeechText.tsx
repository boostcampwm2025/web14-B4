'use client';

import { useEffect, useRef } from 'react';
import { SpeechItemDto } from '../types/speeches.types';

interface MySpeechTextProps {
  speechItem: SpeechItemDto;
  setSpeechItem: React.Dispatch<React.SetStateAction<SpeechItemDto>>;
}

const TEXT_MAX_LENGTH = 2000;

export default function MySpeechText({ speechItem, setSpeechItem }: MySpeechTextProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [speechItem.speechText]);
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    if (value.length > TEXT_MAX_LENGTH) {
      return;
    }

    setSpeechItem({
      ...speechItem,
      speechText: value,
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-5">
      <h1 className="text-2xl font-bold text-center mb-8">나의 답변</h1>
      <div className="mb-6">
        <textarea
          ref={textareaRef}
          value={speechItem.speechText}
          onChange={handleChange}
          className="rounded-xl p-6 border-2 mb-6 w-full min-h-[700px] resize-none text-gray-800 text-lg leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-400"
          style={{ backgroundColor: '#4278FF10', borderColor: '#4278FF', overflow: 'hidden' }}
        />
      </div>
      <div className="flex justify-end text-sm text-gray-500">
        {speechItem.speechText.length}자 / {TEXT_MAX_LENGTH}자
      </div>
    </div>
  );
}
