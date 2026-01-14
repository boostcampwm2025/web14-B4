import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AiFeedbackResponse } from '@/app/feedback/types/feedback';
import { fetchAiFeedback } from '@/services/feedbackApi';

interface QuizStore {
  solvedQuizId: number | null;
  setSolvedQuizId: (id: number) => void;
  clearSolvedQuizId: () => void;
  isAnalyzing: boolean;
  feedbackResult: AiFeedbackResponse | null;
  actions: {
    requestAiFeedback: (mainQuizId: number, solvedQuizId: number) => Promise<boolean>;
  };
}

export const useQuizStore = create<QuizStore>()(
  persist(
    (set, get) => ({
      solvedQuizId: null,
      setSolvedQuizId: (id: number) => set({ solvedQuizId: id }),
      clearSolvedQuizId: () => set({ solvedQuizId: null }),

      isAnalyzing: false,
      feedbackResult: null,

      actions: {
        requestAiFeedback: async (mainQuizId, solvedQuizId) => {
          set({ isAnalyzing: true });
          try {
            const response = await fetchAiFeedback(mainQuizId, solvedQuizId);
            set({ feedbackResult: response });
            return true;
          } catch (error) {
            return false;
          } finally {
            set({ isAnalyzing: false });
          }
        },
      },
    }),
    {
      name: 'quiz-storage', // localStorage 키
    },
  ),
);
