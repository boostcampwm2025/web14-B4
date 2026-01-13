import './globals.css';
import ConditionalHeader from '@/components/ConditionalHeader';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <ConditionalHeader />
        <main>{children}</main>
      </body>
    </html>
  );
}
