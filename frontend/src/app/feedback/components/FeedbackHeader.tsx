import { QuizInfoBadge } from '@/components/QuizInfoBadge';

type Props = {
  content: string;
  category: string;
  difficultyLevel: '상' | '중' | '하';
  userName: string;
  checklistCount: number;
  checkedCount: number;
};

export default function FeedbackHeader({
  content,
  category,
  difficultyLevel,
  userName,
  checklistCount,
  checkedCount,
}: Props) {
  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-[980px]">
        <div className="flex justify-center mb-4">
          <QuizInfoBadge quizCategoryName={category} difficultyLevel={difficultyLevel} size="sm" />
        </div>
        <h1 className="flex justify-center text-xl font-semibold text-center whitespace-pre-wrap">
          {content}
        </h1>
        <div className="text-center space-y-4 mb-8">
          <div className="flex justify-start px-2">
            <div className="inline-block bg-[var(--color-primary)] text-white text-sm px-4 py-2 rounded-full mt-1">
              생각뽁뽁
            </div>
          </div>

          <div className="flex items-start px-2">
            <div className="text-left">
              <p className="font-bold mb-1">
                {userName}님, 체크리스트 {checklistCount}개 중{' '}
                <span className="text-[var(--color-primary)]">{checkedCount}개</span>에
                체크해주셨어요.
              </p>
              <p>생각을 어떻게 더 확장해볼 수 있을까요?</p>
              <p className="text-xs text-[var(--color-gray-dark)] mt-1">
                {userName}님이 어떤 걸 알고 계셨고 모르고 계셨는지를 뒤돌아보신다면 성장에 도움이
                되실거에요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
