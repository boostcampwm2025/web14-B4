import { Suspense } from 'react';
import QuizPageClient from './components/QuizPageClient';

export default function Page() {
  return (
    <Suspense fallback={null}>
      <QuizPageClient />
    </Suspense>
  );
}
