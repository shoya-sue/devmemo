import React from 'react';
import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'DevMemo',
  description: 'A simple memo app for developers',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
        <AuthProvider>
          <ThemeProvider>
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
} 