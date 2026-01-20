'use client';

import MultipleChoiceQuiz from "./MultipleChoiceQuiz";
import QuizProgressBar from "./QuizProgressBar";

export default function MultipleQuizCard() {
  return (
    <div className="flex flex-col items-center justify-center">
      <QuizProgressBar/>
      <MultipleChoiceQuiz/>
    </div>
  );
}
