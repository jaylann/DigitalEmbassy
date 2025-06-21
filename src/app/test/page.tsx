import { ChatInterface } from "@/components/chat/chat-interface";
import MobileLayout from '@/components/layout/MobileLayout'

/**
 * The main page of the Euromesh application.
 * It provides the primary layout and hosts the chat interface.
 */
export default function Home() {
  return (
      <MobileLayout>
        <div className="flex min-h-screen items-center justify-center bg-zinc-900 p-4">
          <ChatInterface />
        </div>
      </MobileLayout>
  );
}