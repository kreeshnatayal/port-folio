import type { Metadata } from 'next';
import { Bebas_Neue, Rajdhani, Share_Tech_Mono, VT323 } from 'next/font/google';
import type { ReactNode } from 'react';
import './globals.css';

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
});

const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-vt323',
});

const shareTechMono = Share_Tech_Mono({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-share-tech',
});

const rajdhani = Rajdhani({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-rajdhani',
});

export const metadata: Metadata = {
  title: 'KRISHNA TAYAL.EXE',
  description:
    'A recovered operator archive. Product systems, narrative architecture, and strategic clarity — accessed through an unstable interface.',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${bebasNeue.variable} ${vt323.variable} ${shareTechMono.variable} ${rajdhani.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
