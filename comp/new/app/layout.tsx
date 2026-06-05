import type { Metadata } from 'next';
import './globals.css';
import TanstackProvider from '@/providers/TanstackProvider';
import AuthProvider from '@/providers/AuthProvider';

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
      <body className="min-h-full flex flex-col">
        <TanstackProvider>{children}</TanstackProvider>
      </body>
    </html>
  );
}
