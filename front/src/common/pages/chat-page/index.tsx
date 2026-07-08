import { ChatPageAreaEmpty, ChatPageSidebar } from './layout'

export default function ChatPage() {
  return (
    <main className='flex h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50'>
      {/* Sidebar */}
      <ChatPageSidebar />
      {/* Chat Area */}
      <ChatPageAreaEmpty />
    </main>
  )
}
