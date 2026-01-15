import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GetAIFeedbackResponseDto } from '@/app/feedback/types/feedback';
import {
  SolvedQuizSubmitRequestDto,
  submitSolvedQuiz,
  getAIFeedBack,
} from '@/services/feedbackApi';

interface QuizStore {
  solvedQuizId: number | null;
  setSolvedQuizId: (id: number) => void;
  clearSolvedQuizId: () => void;
  isAnalyzing: boolean;
  feedbackResult: GetAIFeedbackResponseDto | null;
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
      feedbackResult: null,

      actions: {
        requestAiFeedback: async (payload) => {
          set({ isAnalyzing: true });
          try {
            const submitResult = await submitSolvedQuiz(payload);
            const response = await getAIFeedBack(submitResult);
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
