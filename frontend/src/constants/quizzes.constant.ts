// 퀴즈 타입 선택 옵션
export const QUIZ_ENTRY_MODES = {
  MULTIPLE: 'MULTIPLE',
  SUBJECTIVE: 'SUBJECTIVE',
  BOTH: 'BOTH',
  SKIP: 'SKIP',
} as const;

export type QuizEntryMode = (typeof QUIZ_ENTRY_MODES)[keyof typeof QUIZ_ENTRY_MODES];

export const QUIZ_TYPE_OPTIONS = [
  { key: QUIZ_ENTRY_MODES.MULTIPLE, title: '객관식', desc: '객관식 퀴즈 풀고나서 메인퀴즈 풀기' },
  { key: QUIZ_ENTRY_MODES.SKIP, title: '메인퀴즈', desc: '몸풀기 퀴즈 없이 바로 시작' },
] as const;

// 난이도 관련 상수
export const LEVEL_ALL = '전체';

export const DIFFICULTY_LEVELS = [LEVEL_ALL, '상', '중', '하'] as const;

export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number];

export const DIFFICULTY_COLOR_CLASS: Record<string, string> = {
  전체: 'bg-blue-600 text-white shadow-md',
  상: 'bg-rose-500 text-white shadow-md',
  중: 'bg-amber-400 text-white shadow-md',
  하: 'bg-emerald-500 text-white shadow-md',
};

export const DIFFICULTY_STYLES = {
  상: 'bg-red-50 text-red-600 border-red-100',
  중: 'bg-yellow-50 text-yellow-600 border-yellow-100',
  하: 'bg-green-50 text-green-600 border-green-100',
} as const;

// 필터 관련 상수
export const FILTER_PARAM = {
  CATEGORY: 'category',
  DIFFICULTY: 'difficulty',
} as const;

export const DEFAULT_CATEGORY = '전체';

// 레이아웃 관련 상수
export const LAYOUT = {
  DIFFICULTY_COMPONENT_WIDTH: 450,
  CATEGORY_BUTTON_WIDTH: 200,
} as const;

// 스타일 클래스 상수
export const BUTTON_STYLES = {
  BASE: 'px-6 py-2 rounded-full text-lg transition-all duration-300 ease-out',
  INACTIVE: 'text-[var(--color-gray-dark)] hover:bg-[var(--color-gray-light)] hover:text-gray-700',
} as const;

// 메시지 상수
export const MESSAGES = {
  NO_QUIZZES: '해당하는 퀴즈가 없습니다. 😅',
  NOT_IMPLEMENTED: '아직 구현되지 않았습니다.',
} as const;
