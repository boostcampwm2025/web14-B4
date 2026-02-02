'use client';

import { useEffect, useRef, Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Loader from '@/components/Loader';
import Popup from '@/components/Popup';
import { loginWithNaver } from '@/services/apis/authApi';
import { verifyState } from '@/utils/oauth';

type PopupType = 'stateError' | 'loginError' | null;

function NaverLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestSent = useRef(false);
  const [popupType, setPopupType] = useState<PopupType>(null);

  const handlePopupClose = () => {
    setPopupType(null);
    router.push('/');
  };

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    // state 검증
    if (code && state) {
      if (!verifyState(state)) {
        setTimeout(() => setPopupType('stateError'), 0);
        return;
      }
    }

    // 로그인 요청
    if (code && !requestSent.current) {
      requestSent.current = true;
      loginWithNaver(code, state)
        .then(() => {
          router.push('/quizzes');
        })
        .catch((err) => {
          console.error('로그인 실패:', err);
          setTimeout(() => setPopupType('loginError'), 0);
        });
    }
  }, [searchParams, router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <Loader message="로그인 처리 중입니다..." />

      <Popup
        isOpen={popupType === 'stateError'}
        title="잘못된 요청"
        description="잘못된 요청입니다. State가 불일치합니다."
        confirmText="확인"
        onConfirm={handlePopupClose}
        singleButton
      />

      <Popup
        isOpen={popupType === 'loginError'}
        title="로그인 실패"
        description="로그인 처리에 실패했습니다."
        confirmText="확인"
        onConfirm={handlePopupClose}
        singleButton
      />
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
