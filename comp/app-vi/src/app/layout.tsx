import type { Metadata } from 'next';
import TanstackProvider from '@/providers/TanstackProvider';
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Next',
  description: '',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <TanstackProvider>{children}</TanstackProvider>
      </body>
    </html>
  );
}
