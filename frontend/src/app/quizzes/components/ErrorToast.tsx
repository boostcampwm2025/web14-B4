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

  return null;
}
