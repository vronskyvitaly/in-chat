import { FaRegComments } from 'react-icons/fa'

export const ChatPageAreaEmpty = () => {
  return (
    <div className='flex flex-1 items-center justify-center'>
      <div className='text-center'>
        <div className='mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg'>
          <FaRegComments className='h-9 w-9' />
        </div>
        <h3 className='mb-1.5 text-xl font-semibold text-gray-800'>Выберите контакт</h3>
        <p className='text-gray-500'>Выберите пользователя из списка, чтобы начать общение</p>
      </div>
    </div>
  )
}
