import { VkBottomNav } from '@/common/pages/home-page/ui/vk/vk-bottom-nav'
import { ChatPageAreaEmpty, ChatPageSidebar } from './layout'

export default function ChatPage() {
  return (
    <>
      {/* data-fullscreen-layout: страница сама резервирует место под нижнюю панель */}
      <main data-fullscreen-layout className='flex h-dvh overflow-hidden bg-[#19191a]'>
        {/* Sidebar — на мобильном занимает весь экран */}
        <ChatPageSidebar />
        {/* Chat Area — заглушка нужна только там, где есть место под две колонки */}
        <ChatPageAreaEmpty />
      </main>

      <VkBottomNav />
    </>
  )
}
