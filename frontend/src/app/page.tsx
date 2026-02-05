'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import Image from 'next/image';
import { getNaverLoginUrl } from '@/utils/oauth';
import { useRouter } from 'next/navigation';
import Popup from '@/components/Popup';

function ScrollReveal({
  children,
  delay = 0,
  direction = 'up',
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down';
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.15 },
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  const translateClass =
    direction === 'down'
      ? isVisible
        ? 'translate-y-0'
        : '-translate-y-10'
      : isVisible
        ? 'translate-y-0'
        : 'translate-y-10';

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out transform ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${translateClass} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function AnimatedUnderline({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0.8 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <span ref={ref} className="relative inline-block mx-1">
      <span className="relative z-10 font-bold">{children}</span>
      <span
        className="absolute bottom-[-1px] left-0 h-[8px] bg-[var(--color-primary)] -z-0 transition-all ease-out rounded-full"
        style={{
          width: isVisible ? '100%' : '0%',
          transitionDuration: '1000ms',
        }}
      />
    </span>
  );
}

export default function Home() {
  const router = useRouter();
  const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false);
  const introRef = useRef<HTMLElement>(null);

  const handleNaverLogin = () => {
    const loginUrl = getNaverLoginUrl();
    if (loginUrl === '#') {
      setIsErrorPopupOpen(true);
      return;
    }
    router.push(loginUrl);
  };

  const handleErrorPopupClose = () => {
    setIsErrorPopupOpen(false);
  };

  const scrollToContent = () => {
    introRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full flex flex-col font-pretendard bg-white">
      {/* =============================================
          SECTION 1: Hero Section
         ============================================= */}
      <section className="relative h-screen flex flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/wave-bg.svg"
            alt="메인 page 배경 이미지"
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-auto"
            priority
          />
        </div>

        <div className="flex flex-col gap-3 absolute bottom-[8%] right-[3%] md:bottom-[12%] md:right-[13%] z-20">
          <Link href="/quizzes">
            <Button
              variant="secondary"
              size="cta"
              className="w-[210px] h-[48px] rounded-[8px] p-0 hover:var[(--color-accent-sky)] text-base transition-transform hover:scale-105"
            >
              비회원으로 체험해보기
            </Button>
          </Link>
          <button
            type="button"
            onClick={handleNaverLogin}
            className="inline-block transition-transform hover:scale-105 p-0 bg-transparent cursor-pointer"
          >
            <Image
              src="/naver-login.svg"
              alt="네이버 아이디로 로그인"
              width={210}
              height={48}
              priority
            />
          </button>
        </div>

        <Popup
          isOpen={isErrorPopupOpen}
          title="로그인 오류"
          description="로그인 설정 오류가 발생했습니다."
          confirmText="확인"
          onConfirm={handleErrorPopupClose}
          singleButton
        />

        {/* 스크롤 유도 화살표 */}
        <div
          onClick={scrollToContent}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20 cursor-pointer text-gray-400/80 hover:text-gray-600 transition-colors"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* =============================================
          SECTION 2: 서비스 소개 
         ============================================= */}
      <section ref={introRef} className="py-30 px-6 bg-white relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <ScrollReveal direction="down">
              <div className="inline-block px-3 py-1 bg-blue-50 text-[var(--color-primary)] rounded-full text-md font-bold mb-2">
                About CS 뽁뽁
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200} direction="down">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-snug">
                &quot;알고 있다고 생각했는데,
                <br />
                막상 설명하려니 <AnimatedUnderline>말문이 막히시나요?</AnimatedUnderline>&quot;
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={400} direction="down">
              <p className="text-gray-600 text-lg leading-relaxed">
                <strong>문제와 정답만 외우는 CS 공부는</strong> 이제 그만하세요.
                <br />
                CS 뽁뽁은 단순 암기에서 벗어나 <br />
                <strong>직접 말하고 설명하며</strong> CS 지식을 체화하는{' '}
                <strong>CS 학습 플랫폼</strong>입니다.
              </p>
            </ScrollReveal>
          </div>

          <div className="flex-1 w-full">
            <ScrollReveal delay={200} direction="up">
              <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center group h-full relative overflow-hidden">
                <div
                  className="absolute w-50 h-50 bg-[var(--color-accent-sky)] rounded-full blur-[80px] opacity-70 top-[-15%] left-[-15%] animate-pulse"
                  style={{ animationDelay: '1s' }}
                ></div>
                <div
                  className="absolute w-48 h-48 bg-[var(--color-primary)] rounded-full blur-[80px] opacity-50 bottom-[-10%] right-[-10%] animate-pulse"
                  style={{ animationDelay: '1s' }}
                ></div>

                <div className="relative z-10 flex flex-col items-center justify-center gap-6">
                  <div className="h-24 flex items-center justify-center gap-[4px] mb-4 w-full">
                    {[
                      { h: '30%', d: '0.9s', r: 0.2 },
                      { h: '50%', d: '1.1s', r: 0.7 },
                      { h: '70%', d: '1.3s', r: 0.1 },
                      { h: '90%', d: '0.8s', r: 0.5 },
                      { h: '100%', d: '1.0s', r: 0.9 }, // 중앙
                      { h: '60%', d: '1.4s', r: 0.3 },
                      { h: '100%', d: '1.1s', r: 0.8 },
                      { h: '80%', d: '0.9s', r: 0.4 },
                      { h: '60%', d: '1.2s', r: 0.6 },
                      { h: '40%', d: '1.0s', r: 0.2 },
                      { h: '25%', d: '1.3s', r: 0.5 },
                    ].map((bar, idx) => (
                      <div
                        key={idx}
                        className="w-1.5 rounded-full bg-gradient-to-t from-[var(--color-primary)] to-[#60a5fa] animate-wave-dance shadow-[0_0_8px_rgba(66,120,255,0.4)]"
                        style={
                          {
                            '--target-h': bar.h,
                            animationDuration: bar.d,
                            animationDelay: `-${bar.r}s`,
                          } as React.CSSProperties
                        }
                      />
                    ))}
                  </div>

                  <div className="text-center">
                    <span className="text-4xl mb-2 block filter drop-shadow-md">🎙️</span>
                    <p className="font-bold text-gray-500 text-lg">
                      머릿속에 있는 지식을
                      <br />
                      <span className="text-[var(--color-primary)]">말로 직접 꺼내보세요</span>
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* =============================================
          SECTION 3: 주요 기능 
         ============================================= */}
      <section className="py-30 px-6 bg-[var(--color-bg-default)] relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-13">
            <ScrollReveal direction="down">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                <span className="relative inline-block mr-2">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-blue-400 font-extrabold">
                    CS 뽁뽁
                  </span>
                  <span className="absolute -top-4 -right-4 text-xl animate-pulse">✨</span>
                </span>
                과 함께
              </h2>
              <p className="text-lg text-gray-500">
                단순 암기를 넘어, 설명할 수 있는 깊이 있는 지식을 만드세요.
              </p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollReveal delay={0} direction="up" className="h-full">
              <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center text-center group h-full">
                <div className="w-16 h-16 bg-blue-50 text-[var(--color-primary)] rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-115 transition-transform shadow-inner">
                  🎯
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  필요한 주제만 골라담는 퀴즈
                </h3>
                <p className="text-gray-500 leading-relaxed text-sm">
                  운영체제, 네트워크 등 <strong>공부하고 싶은 분야</strong>와<br />
                  <strong>난이도를 직접 선택</strong>해 집중 학습하세요.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200} direction="up" className="h-full">
              <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center text-center group h-full">
                <div className="w-16 h-16 bg-blue-50 text-[var(--color-primary)] rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-115 transition-transform shadow-inner">
                  🎙️
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  보지 않고 설명하는 메타인지 학습
                </h3>
                <p className="text-gray-500 leading-relaxed text-sm">
                  <strong>미러링</strong>으로 시선을 점검하며 말해보세요.
                  <br />
                  <strong>텍스트로 변환된 답변</strong>을 보며
                  <br />
                  말할 땐 몰랐던 <strong>논리의 빈틈을 채워보세요.</strong>
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={400} direction="up" className="h-full">
              <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center text-center group h-full">
                <div className="w-16 h-16 bg-blue-50 text-[var(--color-primary)] rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-115 transition-transform shadow-inner">
                  💡
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  방향을 잡아주는 AI 심층 피드백
                </h3>
                <p className="text-gray-500 leading-relaxed text-sm">
                  놓친 <strong>핵심 키워드</strong>와 <strong>답변의 방향성</strong>을 짚어줍니다.
                  <br />
                  이어지는 학습 조언과 <strong>날카로운 꼬리 질문</strong>으로
                  <br />
                  사고의 깊이를 한 단계 더 넓히세요.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* =============================================
          SECTION 4: 하단 CTA 
         ============================================= */}
      <section className="py-40 bg-[var(--color-bg-default)] px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal direction="up">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              설명할 수 없다면,
              <br className="md:hidden" />
              <span className="text-[var(--color-primary)]">아는 것이 아닙니다.</span>
            </h2>

            <p className="text-gray-500 text-lg mb-10">
              눈으로만 보던 지식을 진짜 내 것으로 만드세요.
              <br />
              지금 바로 확인해볼까요?
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link href="/quizzes">
                <Button
                  size="cta"
                  className="w-full sm:w-auto px-12 py-4 h-auto text-lg rounded-xl bg-[var(--color-primary)] shadow-lg hover:shadow-xl transition-transform hover:scale-105"
                >
                  내 실력 확인하러 가기
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
