import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  SolvedQuizSubmitRequestDto,
  submitSolvedQuiz,
  generateAIFeedBack,
} from '@/services/feedbackApi';

interface QuizStore {
  solvedQuizId: number | null;
  setSolvedQuizId: (id: number) => void;
  clearSolvedQuizId: () => void;
  isAnalyzing: boolean;
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

      isAnalyzing: false,

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
    },
  ),
);
