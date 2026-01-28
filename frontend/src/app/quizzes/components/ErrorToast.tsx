'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';

export default function ErrorToast() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorType = searchParams.get('error');

    if (!errorType) return;

    const messageMap: Record<string, string> = {
      not_found: '해당 퀴즈 기록이 존재하지 않습니다',
      auth_required: '리포트를 열람하기 위해서는 로그인이 필요합니다.',
      access_denied: '해당 리포트에 접근할 권한이 없습니다.',
    };

    const message = messageMap[errorType];
    if (!message) return;

    toast.error(message);
    window.history.replaceState({}, '', '/quizzes');
  }, [searchParams]);

  return null;
}
