'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/Auth/useAuth';
import { logout } from '@/services/apis/authApi';

export default function Header() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (err) {
      console.error('로그아웃 실패:', err);
      alert('로그아웃에 실패했습니다.');
    }
  };

  return (
    <header className="flex justify-between items-center px-10 py-3 bg-white border-b border-[var(--color-gray-light)]">
      <Link
        href="/"
        className="flex items-center"
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
        onContextMenu={(e) => e.preventDefault()}
      >
        <Image src="/logo.svg" alt="CS 뽁뽁 로고" width={40} height={40} draggable={false} />
      </Link>
      <div className="flex items-center gap-3">
        {isLoggedIn ? (
          <>
            <Link
              href="/user"
              className="px-4 py-2 rounded-full border border-dashed border-[var(--color-primary)] text-[var(--color-primary)] text-sm font-semibold hover:bg-blue-50 transition-colors"
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
            >
              리포트
            </Link>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-full border border-dashed border-[var(--color-primary)] text-[var(--color-primary)] text-sm font-semibold hover:bg-blue-50 transition-colors"
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
            >
              로그아웃
            </button>
          </>
        ) : (
          <Link
            href="/auth/login"
            className="px-4 py-2 rounded-full border border-dashed border-[var(--color-primary)] text-[var(--color-primary)] text-sm font-semibold hover:bg-blue-50 transition-colors"
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
          >
            로그인
          </Link>
        )}
      </div>
    </header>
  );
}
