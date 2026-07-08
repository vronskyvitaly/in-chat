export const HomePageDecorativeBackground = () => {
  return (
    <div className='absolute inset-0 overflow-hidden pointer-events-none'>
      <div className='absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 dark:from-blue-900 dark:to-purple-900'></div>
      <div className='absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr from-green-200 to-blue-200 rounded-full opacity-20 dark:from-green-900 dark:to-blue-900'></div>
    </div>
  )
}
