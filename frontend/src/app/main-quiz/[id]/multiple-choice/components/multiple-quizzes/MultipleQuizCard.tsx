'use client';

import MultipleChoiceQuiz from "./MultipleChoiceQuiz";
import QuizProgressBar from "./QuizProgressBar";

export default function MultipleQuizCard() {
  return (
    <div>
      <h1>QuizCard</h1>
      <QuizProgressBar/>
      <MultipleChoiceQuiz/>
    </div>
  );
}
