'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/Auth/useAuth';
import { logout } from '@/services/apis/authApi';

export default function Header() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/quizzes');
      setIsDropdownOpen(false);
    } catch (err) {
      console.error('로그아웃 실패:', err);
      alert('로그아웃에 실패했습니다.');
    }
  };

  // 메뉴 밖을 클릭하면 드롭다운 닫힘
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 flex justify-between items-center px-10 py-3 bg-white/80 backdrop-blur-md border-b border-[var(--color-gray-light)]">
      {/* 로고 영역 */}
      <Link
        href="/"
        className="flex items-center"
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
        onContextMenu={(e) => e.preventDefault()}
      >
        <Image src="/logo.svg" alt="CS 뽁뽁 로고" width={40} height={40} draggable={false} />
      </Link>
      {/* 메뉴 영역 */}
      <div className="flex items-center gap-3">
        {isLoggedIn ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-center w-10 h-10"
            >
              <Image
                src="/default-profile.svg"
                alt="내 프로필"
                width={40}
                height={40}
                className="object-cover"
              />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-5 w-60 bg-white rounded-xl shadow-xl border border-[var(--color-gray-light)] overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                <div className="p-1">
                  <Link
                    href="/user"
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[var(--color-gray-dark)] rounded-lg hover:bg-blue-50 hover:text-[var(--color-primary)] transition-colors"
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                  >
                    📄 리포트
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[var(--color-gray-dark)] rounded-lg hover:bg-blue-50 hover:text-[var(--color-primary)] transition-colors"
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                  >
                    로그아웃
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/auth/login"
            className="px-4 py-2 rounded-full bg-[var(--color-primary)] text-white text-sm font-semibold hover:bg-[var(--color-accent-sky)] transition-colors"
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
