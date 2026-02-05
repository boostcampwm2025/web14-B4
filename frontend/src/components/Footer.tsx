'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t bg-[var(--color-bg-default)]">
      <div className="mx-auto flex max-w-screen-xl flex-col items-center justify-center gap-2 px-4 py-6 text-center text-sm text-gray-400">
        {/* 서비스 소개 문구 */}
        <p className="whitespace-nowrap">
          CS뽁뽁 - CS 개념을 말로 설명하며 스스로 사고하는 학습을 돕는 서비스
        </p>

        {/* 하단 링크 영역 */}
        <div className="flex items-center gap-2">
          <span>© boostcamp2025 WEB14 B4 Team</span>
          <span>|</span>
          <Link
            href="https://github.com/boostcampwm2025/web14-B4"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            GitHub
          </Link>
        </div>
      </div>
    </footer>
  );
}
