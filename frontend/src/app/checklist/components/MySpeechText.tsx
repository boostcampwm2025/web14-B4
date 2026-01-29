'use client';

import { useEffect, useRef } from 'react';
import { SpeechItemDto } from '../types/speeches.types';
import { MAX_SPEECH_TEXT_LENGTH } from '@/constants/speech.constants';

interface MySpeechTextProps {
  speechItem: SpeechItemDto;
  setSpeechItem: React.Dispatch<React.SetStateAction<SpeechItemDto>>;
}

export default function MySpeechText({ speechItem, setSpeechItem }: MySpeechTextProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [speechItem.speechText]);
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const speechTextValue = e.target.value;

    if (speechTextValue.length > MAX_SPEECH_TEXT_LENGTH) {
      return;
    }

    setSpeechItem({
      ...speechItem,
      speechText: speechTextValue,
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-5">
      <h1 className="text-2xl font-bold text-center mb-8">💬 나의 답변</h1>
      <p className="text-base mb-4 text-gray-500">
        말하기로 답변한 내용은 자동으로 글자로 변환됩니다.
        <br />
        정확한 결과를 보고 싶다면 자유롭게 고쳐주세요 ✨
      </p>
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
        {speechItem.speechText.length}자 / {MAX_SPEECH_TEXT_LENGTH}자
      </div>
    </div>
  );
}
