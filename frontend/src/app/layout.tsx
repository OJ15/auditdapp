// components/RootLayout.tsx

import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { satoshi } from '@/fonts/satoshi';
import type { Metadata } from 'next';
import React from 'react';
import '../styles.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Smart Audit Dapp',
  description: 'Superpowered AI assistant for DeFi',
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'de-DE': '/de-DE',
    },
  },
  openGraph: {
    images: '/opengraph-image.jpg',
  },
};

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const show = true; 

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${satoshi.className} bg-black w-full`}>
        {show && (
          <div className="w-full h-full min-h-[100vh] z-[9] pt-20 md:hidden fixed">
          </div>
        )}
        <div className="relative w-full flex">
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
