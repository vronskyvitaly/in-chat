import { ChatPageArea, ChatPageSidebar } from '@/common/pages/chat-page/layout'

export default async function DynamicChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <main className='flex h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50'>
      {/* Sidebar */}
      <ChatPageSidebar />
      {/* Chat Area */}
      <ChatPageArea selectedUserId={id} />
    </main>
  )
}
