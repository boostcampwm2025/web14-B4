import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  SolvedQuizSubmitRequestDto,
  submitSolvedQuiz,
  generateAIFeedBack,
} from '@/services/apis/feedbackApi';

interface QuizStore {
  solvedQuizId: number | null;
  setSolvedQuizId: (id: number) => void;
  _hasHydrated: boolean;
  isAnalyzing: boolean;
  resetAnalyzing: () => void;
  actions: {
    requestAiFeedback: (payload: SolvedQuizSubmitRequestDto) => Promise<boolean>;
  };
}

export const useQuizStore = create<QuizStore>()(
  persist(
    (set, get) => ({
      solvedQuizId: null,
      setSolvedQuizId: (id: number) => set({ solvedQuizId: id }),

      isAnalyzing: false,
      resetAnalyzing: () => set({ isAnalyzing: false }),
      _hasHydrated: false,

      actions: {
        requestAiFeedback: async (payload) => {
          set({ isAnalyzing: true });
          try {
            const submitResult = await submitSolvedQuiz(payload);
            set({ solvedQuizId: submitResult.solvedQuizId });
            await generateAIFeedBack(submitResult);
            return true;
          } catch (error) {
            set({ isAnalyzing: false });
            return false;
          }
        },
      },
    }),
    {
      name: 'quiz-storage', // localStorage 키
      partialize: (state) => ({
        solvedQuizId: state.solvedQuizId,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state._hasHydrated = true;
        }
      },
    },
  ),
);
