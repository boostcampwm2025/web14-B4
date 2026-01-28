'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function ErrorToast() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorType = searchParams.get('error');

    if (errorType === 'not_found') {
      toast.error('해당 퀴즈 기록이 존재하지 않습니다');
      router.replace('/quizzes');
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (searchParams.get('authRequired') === 'true') {
      toast.error('리포트 열람을 하기 위해서는 로그인이 필요합니다.');
      window.history.replaceState({}, '', '/quizzes');
    }
  }, [searchParams]);

  return null;
}
