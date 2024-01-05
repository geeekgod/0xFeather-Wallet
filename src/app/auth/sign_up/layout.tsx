import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import type { Metadata } from 'next'
import { getServerSession } from 'next-auth';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sign Up | 0xFeather',
  description: 'Start a new journey with 0xFeather wallet.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
