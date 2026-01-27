'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface PreventBackNavigationProps {
  redirectTo?: string;
  message?: string;
}

export default function PreventBackNavigation({
  redirectTo = '/quizzes',
  message = '현재 페이지를 나가시겠습니까?\n확인을 누르면 메인 페이지로 이동합니다.',
}: PreventBackNavigationProps = {}) {
  const router = useRouter();
  const isConfirmingRef = useRef(false);

  useEffect(() => {
    // 초기 히스토리 상태 설정
    window.history.pushState(null, '', window.location.href);

    const handlePopState = () => {
      // 이미 confirm이 떠있으면 무시
      if (isConfirmingRef.current) {
        return;
      }

      isConfirmingRef.current = true;

      // confirm 전에 히스토리를 다시 추가 (현재 페이지 유지)
      window.history.pushState(null, '', window.location.href);

      const shouldLeave = confirm(message);

      if (shouldLeave) {
        // 확인 클릭 시 메인으로 이동
        isConfirmingRef.current = false;
        router.push(redirectTo);
      } else {
        // 취소 클릭 시 현재 페이지 유지
        isConfirmingRef.current = false;
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [router, redirectTo, message]);

  return null;
}
