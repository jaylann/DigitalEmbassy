'use client'
import MobileLayout from '../../components/MobileLayout'
import { ChatInterface } from '@/components/chat/chat-interface'

export default function ChatbotPage() {
  return (
    <MobileLayout>
      <div className="flex min-h-screen items-center justify-center p-4 bg-zinc-900">
        <ChatInterface />
      </div>
    </MobileLayout>
  );
}
