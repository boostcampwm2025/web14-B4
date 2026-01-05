import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <header style={{ padding: '20px', borderBottom: '1px solid #eee', textAlign: 'center' }}>
          <h1>Next.js cs뽁뽁 App</h1>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
