'use client'
import { useSession } from 'next-auth/react'
import { HomePageHeroSection } from './layout'
import { Footer } from '@/common/components/layout'
import { LoadingFullScreen } from '@/common/components/ui'
import { HomePageDecorativeBackground } from './ui'

export default function HomePage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <LoadingFullScreen />
  }

  return (
    <main className='flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'>
      {/* Background decorative elements */}
      <HomePageDecorativeBackground />
      <HomePageHeroSection session={session} />
      <Footer />
    </main>
  )
}
