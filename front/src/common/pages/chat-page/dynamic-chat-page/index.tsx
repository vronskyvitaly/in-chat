import { ChatPageArea, ChatPageSidebar } from '@/common/pages/chat-page/layout'

export default async function DynamicChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <main className='flex h-screen overflow-hidden bg-[#19191a]'>
      {/* Sidebar */}
      <ChatPageSidebar />
      {/* Chat Area */}
      <ChatPageArea selectedUserId={id} />
    </main>
  )
}
