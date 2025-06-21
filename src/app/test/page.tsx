import { ChatInterface } from "@/components/chat/chat-interface";
import MobileLayout from '../../components/MobileLayout'

/**
 * The main page of the Euromesh application.
 * It provides the primary layout and hosts the chat interface.
 */
export default function Home() {
  return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-900 p-4">
          <ChatInterface />
        </div>
  );
}