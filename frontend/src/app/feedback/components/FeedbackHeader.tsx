import { Chip } from '@/components/Chip';

type Props = {
  content: string;
  category: string;
  difficultyLevel: string;
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
          <Chip variant="primary" className="p-0 flex items-center divide-x divide-white">
            <span className="px-3 text-sm font-medium">{category}</span>
            <span className="px-3 text-sm font-medium flex items-center gap-2">
              난이도
              <span className="px-2 py-1 text-xs font-bold bg-white text-[var(--color-primary)] rounded-full">
                {difficultyLevel}
              </span>
            </span>
          </Chip>
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
