'use client';

import { Inter } from 'next/font/google';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { RecruitmentProvider } from '@/context/RecruitmentContext';
import theme from '@/theme/theme';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>
      <body className={inter.className}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RecruitmentProvider>
            {children}
          </RecruitmentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
