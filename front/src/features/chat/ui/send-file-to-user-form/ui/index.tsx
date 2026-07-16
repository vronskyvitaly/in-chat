import { FaImage } from 'react-icons/fa'
import type { ChangeEvent } from 'react'
import { ACCEPT_CONFIG_IMAGE } from '@/features/chat/ui'

type Props = {
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export const SendFileToUserForm = ({ onFileChange }: Props) => {
  return (
    <form>
      <div className='flex items-center gap-2'>
        <label className='cursor-pointer rounded-lg p-2.5 text-[#828282] transition-colors hover:bg-[#2a2a2b] hover:text-[#e1e3e6]'>
          <input type='file' accept={ACCEPT_CONFIG_IMAGE} className='hidden' onChange={onFileChange} />
          <FaImage />
        </label>
      </div>
    </form>
  )
}
