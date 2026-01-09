import { create } from 'zustand';

interface QuizStore {
  solvedQuizId: number | null;
  setSolvedQuizId: (id: number) => void;
  clearSolvedQuizId: () => void;
}

export const useQuizStore = create<QuizStore>((set) => ({
  solvedQuizId: null,
  setSolvedQuizId: (id: number) => set({ solvedQuizId: id }),
  clearSolvedQuizId: () => set({ solvedQuizId: null }),
}));
