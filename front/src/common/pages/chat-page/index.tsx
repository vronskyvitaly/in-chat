import { ChatPageAreaEmpty, ChatPageSidebar } from './layout'

export default function ChatPage() {
  return (
    <main className='flex h-screen overflow-hidden bg-[#19191a]'>
      {/* Sidebar */}
      <ChatPageSidebar />
      {/* Chat Area */}
      <ChatPageAreaEmpty />
    </main>
  )
}
