/** Логотип IN CHAT для страниц авторизации */
export const AuthLogo = () => {
  return (
    <div className='mb-5 flex flex-col items-center gap-3'>
      <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3d93ff] to-[#1a6ee0] shadow-lg shadow-[#2688eb]/20'>
        <svg className='h-7 w-7 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2.2}
            d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.84L3 20l1.05-3.15A7.94 7.94 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
          />
        </svg>
      </div>
      <span className='text-sm font-bold tracking-widest text-[#828282]'>IN&nbsp;CHAT</span>
    </div>
  )
}
