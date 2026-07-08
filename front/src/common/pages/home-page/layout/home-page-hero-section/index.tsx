import { Session } from 'next-auth'
import { Logo } from '@/common/components/ui'
import { HeroSectionSubtitle, HeroSectionTitle } from './ui'
import { HeroSectionAuthActionsPanelBlock, HeroSectionFeatureCardsBlock } from './layout'

type Props = {
  session: Session | null
}

export const HomePageHeroSection = ({ session }: Props) => {
  return (
    <section className='relative flex flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8'>
      {/* Content */}
      <div className='relative z-10 max-w-4xl mx-auto'>
        {/* Logo */}
        <Logo />
        {/* Title */}
        <HeroSectionTitle />
        {/* Subtitle */}
        <HeroSectionSubtitle />
        {/* Actions Panel section */}
        <HeroSectionAuthActionsPanelBlock session={session} />
        {/* Features */}
        <HeroSectionFeatureCardsBlock />
      </div>
    </section>
  )
}
