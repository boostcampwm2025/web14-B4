import { Suspense } from 'react';
import QuizPageClient from './QuizPageClient';

export default function Page() {
  return (
    <Suspense fallback={null}>
      <QuizPageClient />
    </Suspense>
  );
}
