export const LoadingFullScreen = () => {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-5 bg-[#19191a]'>
      <div className='relative flex h-16 w-16 items-center justify-center'>
        {/* Вращающееся градиентное кольцо */}
        <span className='absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-r-[#5b9bea] border-t-[#2688eb] [animation-duration:0.9s]' />
        {/* Логотип по центру */}
        <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg'>
          <svg className='h-6 w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.84L3 20l1.05-3.15A7.94 7.94 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
            />
          </svg>
        </div>
      </div>
      <p className='animate-pulse text-sm font-medium tracking-wide text-[#828282]'>Загрузка…</p>
    </div>
  )
}
