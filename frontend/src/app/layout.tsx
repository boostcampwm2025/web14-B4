import { ToastContainer } from 'react-toastify';
import './globals.css';
import ConditionalHeader from '@/components/ConditionalHeader';
import ErrorToast from '@/components/ErrorToast';
import Footer from '@/components/Footer';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import QueryProvider from './providers/QueryProvider';

export const metadata: Metadata = {
  title: 'CS뽁뽁',
  description: 'CS 개념을 말로 설명하며, 스스로 사고하는 학습을 돕는 서비스',
  openGraph: {
    title: 'CS뽁뽁',
    description: 'CS 개념을 말로 설명하며, 스스로 사고하는 학습을 돕는 서비스',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="bg-[var(--color-bg-default)] flex min-h-dvh flex-col">
        <QueryProvider>
          <ConditionalHeader />
          <Suspense fallback={null}>
            <ErrorToast />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Footer />
        </QueryProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
