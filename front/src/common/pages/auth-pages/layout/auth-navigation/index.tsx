import Link from 'next/link'

type Props = {
  title: string
  href: string
  titleNext: string
}

export const AuthNavigation = ({ title, href, titleNext }: Props) => {
  return (
    <p className='mt-8 text-center text-sm text-[#828282]'>
      {title}?{' '}
      <Link
        href={href}
        className='cursor-pointer font-medium text-[#5b9bea] transition-colors hover:text-[#71aaeb]'
      >
        {titleNext}
      </Link>
    </p>
  )
}
