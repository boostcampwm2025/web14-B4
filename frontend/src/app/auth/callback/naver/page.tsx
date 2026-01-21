'use client';

import { useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Loader from '@/components/Loader';
import { loginWithNaver } from '@/services/authApi';

function NaverLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestSent = useRef(false);

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (code && !requestSent.current) {
      requestSent.current = true;
      loginWithNaver(code, state)
        .then(() => {
          router.push('/quizzes');
        })
        .catch((err) => {
          console.error('로그인 실패:', err);
          alert('로그인 처리에 실패했습니다.');
          router.push('/');
        });
    }
  }, [searchParams, router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <Loader message="로그인 처리 중입니다..." />
    </div>
  );
}

export default function NaverCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <Loader message="로딩 중..." />
        </div>
      }
    >
      <NaverLoginContent />
    </Suspense>
  );
}
