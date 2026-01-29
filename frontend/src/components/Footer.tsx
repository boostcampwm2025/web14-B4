'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="w-full border-t bg-[var(--color-bg-default)]">
      <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-center px-4 text-sm">
        <div className="flex items-center gap-5">
          <Image src="/logo.svg" alt="CS뽁뽁 로고" width={35} height={35} />
          <span>© CS뽁뽁</span>

          <Link
            href="https://github.com/boostcampwm2025/web14-B4"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-110"
          >
            <Image
              src="/icons/icon-GitHub_Invertocat_Black_Clearspace.svg"
              alt="GitHub 저장소로 이동하기"
              width={40}
              height={40}
            />
          </Link>
        </div>
      </div>
    </footer>
  );
}
