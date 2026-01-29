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
  clearSolvedQuizId: () => void;
  mainQuizId: number | null;
  setMainQuizId: (id: number) => void;
  clearMainQuizId: () => void;
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
      clearSolvedQuizId: () => set({ solvedQuizId: null }),

      mainQuizId: null,
      setMainQuizId: (id: number) => set({ mainQuizId: id }),
      clearMainQuizId: () => set({ mainQuizId: null }),

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
        mainQuizId: state.mainQuizId,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state._hasHydrated = true;
        }
      },
    },
  ),
);
