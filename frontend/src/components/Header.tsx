import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="flex justify-between items-center px-10 py-5 bg-white border-b border-[var(--color-gray-light)]">
      <Link href="/" className="flex items-center">
        <Image src="/logo.svg" alt="CS 뽁뽁 로고" width={50} height={50} />
      </Link>
      <Link
        href="/signup"
        className="px-4 py-2 rounded-full border border-dashed border-[var(--color-primary)] text-[var(--color-primary)] text-xl font-semibold hover:bg-blue-50 transition-colors"
      >
        회원가입
      </Link>
    </header>
  );
}
