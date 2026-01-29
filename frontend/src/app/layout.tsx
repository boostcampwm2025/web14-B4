import { ToastContainer } from 'react-toastify';
import './globals.css';
import ConditionalHeader from '@/components/ConditionalHeader';
import ErrorToast from '@/components/ErrorToast';
import { Suspense } from 'react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="bg-[var(--color-bg-default)]">
        <ConditionalHeader />
        <Suspense fallback={null}>
          <ErrorToast />
        </Suspense>
        <main>{children}</main>
        <ToastContainer />
      </body>
    </html>
  );
}
