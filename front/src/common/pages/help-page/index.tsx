'use client'
import type { IconType } from 'react-icons'
import { FiUserPlus, FiUser, FiRss, FiMessageCircle, FiUsers, FiImage } from 'react-icons/fi'
import { useMeQuery } from '@/features/auth/api'
import { VkTopBar, VkLeftMenu } from '@/common/pages/home-page/ui/vk'

type Step = {
  icon: IconType
  title: string
  description: string
}

const STEPS: Step[] = [
  {
    icon: FiUserPlus,
    title: 'Регистрация и вход',
    description:
      'Создайте аккаунт по email и паролю или войдите через GitHub / Google. После входа вы попадёте на свою страницу.'
  },
  {
    icon: FiUser,
    title: 'Профиль',
    description:
      'Отредактируйте имя, статус, город, семейное положение и языки. Загрузите аватар и настройте обложку профиля.'
  },
  {
    icon: FiRss,
    title: 'Лента',
    description:
      'Просматривайте посты других пользователей, создавайте записи с фотографиями, ставьте лайки и оставляйте комментарии.'
  },
  {
    icon: FiMessageCircle,
    title: 'Мессенджер',
    description:
      'Переписывайтесь с другими пользователями в реальном времени. Откройте чат из профиля пользователя или из списка диалогов.'
  },
  {
    icon: FiUsers,
    title: 'Друзья',
    description:
      'Ищите людей через поиск, отправляйте и принимайте заявки в друзья. Управляйте списком друзей в разделе «Друзья».'
  },
  {
    icon: FiImage,
    title: 'Фотографии',
    description:
      'Загружайте фотографии в свою галерею, просматривайте фото других пользователей и оставляйте комментарии.'
  }
]

export default function HelpPage() {
  const { data: me } = useMeQuery()

  return (
    <main className='min-h-screen bg-[#19191a] text-[#e1e3e6]'>
      <VkTopBar name={me?.name} avatar={me?.avatar} />

      <div className='mx-auto flex max-w-[1100px] items-start gap-4 px-2 py-4 sm:px-3'>
        <VkLeftMenu />

        <div className='min-w-0 flex-1 space-y-3'>
          {/* Заголовок */}
          <div className='rounded-xl border border-[#2a2a2b] bg-[#222222] px-5 py-4'>
            <h1 className='text-lg font-semibold text-[#e1e3e6]'>Помощь</h1>
            <p className='mt-1 text-sm text-[#828282]'>
              Краткая инструкция по основным функциям приложения
            </p>
          </div>

          {/* Шаги */}
          {STEPS.map(({ icon: Icon, title, description }, i) => (
            <div
              key={title}
              className='flex items-start gap-4 rounded-xl border border-[#2a2a2b] bg-[#222222] px-5 py-4'
            >
              <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#2a2a2b] text-[#5b9bea]'>
                <Icon className='h-5 w-5' />
              </div>
              <div className='min-w-0'>
                <h2 className='text-[15px] font-medium text-[#e1e3e6]'>
                  <span className='mr-2 text-[#5b9bea]'>{i + 1}.</span>
                  {title}
                </h2>
                <p className='mt-1 text-sm leading-relaxed text-[#aeb0b3]'>{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
