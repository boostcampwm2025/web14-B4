import Link from 'next/link';
import { DEFAULT_CATEGORY } from '@/constants/quizzes.constant';

interface FilterLinkProps {
  /** 변경할 쿼리 파라미터 이름 */
  param: string;
  /** 쿼리 파라미터 값 */
  value: string;

  /** 현재 페이지의 쿼리 상태 */
  currentParams: {
    category?: string;
    difficulty?: string;
  };
  children: React.ReactNode;
  className?: string;
}

// Link 를 공용으로 사용하기 위한 컴포넌트
export function FilterLink({ param, value, currentParams, children, className }: FilterLinkProps) {
  const params = new URLSearchParams();

  Object.entries(currentParams).forEach(([key, val]) => {
    if (val) params.set(key, val);
  });

  if (value === DEFAULT_CATEGORY) params.delete(param);
  else params.set(param, value);

  const href = params.toString() ? `?${params.toString()}` : '/quizzes';

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
