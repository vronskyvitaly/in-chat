import { Session } from 'next-auth'
import {
  ActionsPanelBlockAuthenticatedActionsFragment,
  ActionsPanelBlockUnauthenticatedActionsFragment
} from './ui'

interface AuthActionsPanelProps {
  session: Session | null
}

export const HeroSectionAuthActionsPanelBlock = ({ session }: AuthActionsPanelProps) => {
  return (
    <div className='flex flex-col sm:flex-row gap-4 justify-center items-center mb-16'>
      {session ? (
        <ActionsPanelBlockAuthenticatedActionsFragment />
      ) : (
        <ActionsPanelBlockUnauthenticatedActionsFragment />
      )}
    </div>
  )
}
