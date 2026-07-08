import { FaSearch } from 'react-icons/fa'
import { Dispatch, SetStateAction } from 'react'

type Props = {
  searchTerm: string
  setSearchTerm: Dispatch<SetStateAction<string>>
}

export const SidebarSearchUserInputBlock = ({ searchTerm, setSearchTerm }: Props) => {
  return (
    <div className='border-b border-gray-200/70 p-3'>
      <div className='relative'>
        <FaSearch className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
        <input
          type='text'
          placeholder='Поиск контактов...'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className='w-full rounded-xl border border-gray-200 bg-white/80 py-2.5 pl-10 pr-4 text-black transition-all placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100'
        />
      </div>
    </div>
  )
}
