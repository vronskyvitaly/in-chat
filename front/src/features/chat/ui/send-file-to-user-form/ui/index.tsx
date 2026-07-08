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
        <label className='cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors'>
          <input type='file' accept={ACCEPT_CONFIG_IMAGE} className='hidden' onChange={onFileChange} />
          <FaImage className='text-gray-600 hover:text-gray-800' />
        </label>
      </div>
    </form>
  )
}
