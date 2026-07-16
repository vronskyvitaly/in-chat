import { FaSearch } from 'react-icons/fa'
import { Dispatch, SetStateAction } from 'react'

type Props = {
  searchTerm: string
  setSearchTerm: Dispatch<SetStateAction<string>>
}

export const SidebarSearchUserInputBlock = ({ searchTerm, setSearchTerm }: Props) => {
  return (
    <div className='border-b border-[#2a2a2b] p-3'>
      <div className='relative'>
        <FaSearch className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#828282]' />
        <input
          type='text'
          placeholder='Поиск контактов...'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className='w-full rounded-xl border border-transparent bg-[#2a2a2b] py-2.5 pl-10 pr-4 text-[#e1e3e6] transition-all placeholder:text-[#828282] focus:border-[#2688eb] focus:bg-[#19191a] focus:outline-none'
        />
      </div>
    </div>
  )
}
