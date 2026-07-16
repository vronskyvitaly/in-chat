import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '@/app/_styles/globals.css'
import { ReactNode } from 'react'
import { AuthProvider, RTKProvider } from '@/app/_providers'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'IN CHAT',
  description: 'IN CHAT — социальная сеть и мессенджер'
}



export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} overflow-x-hidden antialiased`}
        suppressHydrationWarning={true}
      >
        <AuthProvider>
          <RTKProvider>{children}</RTKProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
