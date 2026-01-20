'use client';

import MultipleChoiceQuiz from "./MultipleChoiceQuiz";
import ProgressBar from "./ProgressBar";

export default function MultipleQuizCard() {
  return (
    <div className="w-full flex flex-col">
      <ProgressBar current={3} total={5}/>
      <MultipleChoiceQuiz/>
    </div>
  );
}
