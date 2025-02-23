import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Test de Autoestima',
  description: 'Evaluación de autoestima en diferentes aspectos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
        <main className="w-full min-h-screen bg-mi-color-rgb ">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
