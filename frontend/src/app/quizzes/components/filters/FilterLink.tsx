import Link from 'next/link';

interface FilterLinkProps {
  /**변경할 쿼리 파라미터 이름*/
  param: string;

  /** 쿼리 파라미터 값*/
  value: string;

  /** Link 에 넣을 텍스트 */
  text: string;

  /** 현재 페이지의 쿼리 상태 */
  currentParams: {
    category?: string;
    difficulty?: string;
  };
  className?: string;
}

export function FilterLink({ param, value, text, currentParams, className }: FilterLinkProps) {
  const params = new URLSearchParams();

  Object.entries(currentParams).forEach(([key, val]) => {
    if (val) params.set(key, val);
  });

  if (value === '전체') params.delete(param);
  else params.set(param, value);

  const href = params.toString() ? `?${params.toString()}` : '/quizzes';

  return (
    <Link href={href} className={className}>
      {text}
    </Link>
  );
}
