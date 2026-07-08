import Link from 'next/link'

type Props = {
  title: string
  href: string
  titleNext: string
}

export const AuthNavigation = ({ title, href, titleNext }: Props) => {
  return (
    <p className={'mt-8 text-center text-sm text-gray-600 dark:text-gray-400'}>
      {title}?{' '}
      <Link
        href={href}
        className='font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer'
      >
        {titleNext}
      </Link>
    </p>
  )
}
