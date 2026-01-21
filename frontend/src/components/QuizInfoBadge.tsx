import { Chip } from './Chip';

interface QuizInfoProps {
  quizCategoryName: string;
  difficultyLevel: '상' | '중' | '하';
  size?: 'sm' | 'md';
  className?: string;
}

export function QuizInfoBadge({
  quizCategoryName,
  difficultyLevel,
  size = 'md',
  className,
}: QuizInfoProps) {
  const sizeStyles = {
    sm: {
      container: 'py-1.5',
      text: 'text-sm',
      badge: 'w-5 h-5 text-xs',
      padding: 'px-2.5',
    },
    md: {
      container: 'py-2',
      text: 'text-[17px]',
      badge: 'w-7 h-7 text-base',
      padding: 'px-6',
    },
  };
  const styles = sizeStyles[size];

  return (
    <div className="inline-grid grid-cols-2 items-stretch">
      <Chip
        variant="primary"
        className={`${styles.padding} ${styles.container} ${styles.text} font-light rounded-r-none border-r border-white/30 flex items-center justify-center whitespace-nowrap ${className}`}
      >
        {quizCategoryName}
      </Chip>

      <Chip
        variant="primary"
        className={`${styles.padding} ${styles.container} ${styles.text} font-light rounded-l-none flex items-center justify-center gap-2 whitespace-nowrap ${className}`}
      >
        난이도
        <span
          className={`${styles.badge} flex items-center justify-center font-bold bg-white text-[var(--color-primary)] rounded-full`}
        >
          {difficultyLevel}
        </span>
      </Chip>
    </div>
  );
}
