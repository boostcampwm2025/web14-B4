import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface QuizStore {
  solvedQuizId: number | null;
  setSolvedQuizId: (id: number) => void;
  clearSolvedQuizId: () => void;
}

export const useQuizStore = create<QuizStore>()(
  persist(
    (set) => ({
      solvedQuizId: null,
      setSolvedQuizId: (id: number) => {
        set({ solvedQuizId: id });
      },
      clearSolvedQuizId: () => set({ solvedQuizId: null }),
    }),
    {
      name: 'quiz-storage', // localStorage 키
    }
  )
);
