import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Pricewise',
  description:
    'Track product prices effortlessly and save money on your online shopping',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${inter.className}`}>
        <main className='max-auto flex w-full justify-center'>
          <div className='w-full max-w-10xl'>
            <Navbar />
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
