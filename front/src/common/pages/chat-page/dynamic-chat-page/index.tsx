import { ChatPageArea, ChatPageSidebar } from '@/common/pages/chat-page/layout'

export default async function DynamicChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <main data-fullscreen-layout className='flex h-dvh overflow-hidden bg-[#19191a]'>
      {/* Sidebar — на мобильном диалог открывается на весь экран, список остаётся на /chat */}
      <div className='hidden sm:flex'>
        <ChatPageSidebar />
      </div>
      {/* Chat Area */}
      <ChatPageArea selectedUserId={id} />
    </main>
  )
}
