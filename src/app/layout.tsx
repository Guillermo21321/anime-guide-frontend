import type { Metadata } from 'next';
import { Manrope, Sora } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/features/auth-provider';

const sora = Sora({
  variable: '--font-sora',
  subsets: ['latin'],
});

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Anime Guide',
  description: 'Catalogo minimalista de anime con enfoque social y moderacion.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${sora.variable} ${manrope.variable} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
