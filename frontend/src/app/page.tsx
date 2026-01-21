'use client';

import Link from 'next/link';
import { Button } from '@/components/Button';
import Image from 'next/image';
import { getNaverLoginUrl } from '@/utils/oauth';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const handleNaverLogin = () => {
    const loginUrl = getNaverLoginUrl();
    if (loginUrl === '#') {
      alert('로그인 설정 오류가 발생했습니다.');
      return;
    }
    router.push(loginUrl);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/wave-bg.svg"
          alt="wave background"
          width={0}
          height={0}
          sizes="100vw"
          className="w-full h-auto"
          priority
        />
      </div>
      <div className="absolute bottom-[10%] right-[5%] md:bottom-[15%] md:right-[15%] z-20">
        <Link href="/quizzes">
          <Button
            variant="secondary"
            size="cta"
            className="hover:var[(--color-accent-sky)] text-lg transition-transform hover:scale-105"
          >
            비회원으로 체험해보기
          </Button>
        </Link>
        <button
          type="button"
          onClick={handleNaverLogin}
          className="inline-block transition-transform hover:scale-105 p-0 bg-transparent"
        >
          <Image src="/naver-login.svg" alt="네이버 아이디로 로그인" priority />
        </button>
      </div>
    </div>
  );
}
