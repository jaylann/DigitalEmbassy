"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * An icon button to open a full-screen chatbot interface optimized for mobile.
 * The interface slides up from the bottom like iOS Maps.
 *
 * @returns {React.ReactElement} The rendered chatbot button and interface.
 */
export function ChatbotButton(): React.ReactElement {
    const [isOpen, setIsOpen] = React.useState(false);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    // Prevent body scroll when chat is open
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut", delay: 0.3 }}
                className="pointer-events-auto"
            >
                <TooltipProvider delayDuration={150}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="default"
                                size="icon"
                                onClick={toggleChat}
                                className="h-12 w-12 rounded-full bg-black/50 shadow-lg backdrop-blur-sm hover:bg-black/70 transition-colors"
                                aria-label="Open Chatbot"
                            >
                                <Bot className="h-6 w-6 text-white" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-black/70 text-white border-none">
                            <p>Open Chatbot</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </motion.div>

            {/* Full-Screen Chat Interface */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{
                            type: "spring",
                            damping: 30,
                            stiffness: 300,
                            mass: 0.8
                        }}
                        className="fixed inset-0 z-50 bg-black flex flex-col pointer-events-auto"
                        style={{
                            height: "100vh",
                            height: "100dvh" // Dynamic viewport height for mobile
                        }}
                    >
                        {/* Header with drag handle and close button */}
                        <div className="flex items-center justify-between p-4 bg-black border-b border-zinc-800 safe-area-top">
                            {/* Drag handle indicator */}
                            <div className="flex-1 flex justify-center">
                                <div className="w-12 h-1 bg-white/30 rounded-full" />
                            </div>

                            {/* Close button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsOpen(false)}
                                className="h-10 w-10 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white shrink-0"
                                aria-label="Close Chatbot"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Chat Interface */}
                        <div className="flex-1 flex flex-col min-h-0">
                            <MobileChatInterface />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

/**
 * Mobile-optimized chat interface component
 */
function MobileChatInterface(): React.ReactElement {
    const [messages, setMessages] = React.useState([
        {
            id: "init",
            role: "assistant" as const,
            content: "I am the Euromesh emergency assistant. You can ask for information or report a new danger.",
        },
    ]);
    const [input, setInput] = React.useState("");
    const [isPending, setIsPending] = React.useState(false);
    const messagesEndRef = React.useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    React.useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedInput = input.trim();
        if (!trimmedInput || isPending) return;

        const userMessage = {
            id: crypto.randomUUID(),
            role: "user" as const,
            content: trimmedInput,
        };

        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsPending(true);

        // Simulate API response
        setTimeout(() => {
            const assistantMessage = {
                id: crypto.randomUUID(),
                role: "assistant" as const,
                content: "Thank you for your message. I'm here to help with emergency information and reports.",
            };
            setMessages(prev => [...prev, assistantMessage]);
            setIsPending(false);
        }, 1000);
    };

    return (
        <div className="flex flex-col h-full bg-black">
            {/* Header */}
            <div className="flex items-center space-x-3 p-4 border-b border-zinc-800">
                <div className="flex items-center justify-center w-10 h-10 bg-zinc-800 rounded-full">
                    <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h2 className="text-white font-semibold">Euromesh Assistant</h2>
                    <p className="text-zinc-400 text-sm">Official Emergency Channel</p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                                message.role === "user"
                                    ? "bg-blue-600 text-white"
                                    : "bg-zinc-800 text-white"
                            }`}
                        >
                            <p className="text-sm leading-relaxed">{message.content}</p>
                        </div>
                    </motion.div>
                ))}

                {isPending && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                    >
                        <div className="bg-zinc-800 px-4 py-3 rounded-2xl">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" />
                                <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                                <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                            </div>
                        </div>
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-zinc-800 safe-area-bottom">
                <form onSubmit={handleSubmit} className="flex items-center space-x-3">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your question or report..."
                            className="w-full px-4 py-3 bg-zinc-800 text-white rounded-full border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-zinc-400"
                            disabled={isPending}
                        />
                    </div>
                    <Button
                        type="submit"
                        size="icon"
                        disabled={isPending || !input.trim()}
                        className="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 shrink-0"
                    >
                        <motion.div
                            animate={isPending ? { rotate: 360 } : { rotate: 0 }}
                            transition={{ duration: 1, repeat: isPending ? Infinity : 0, ease: "linear" }}
                        >
                            {isPending ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                            ) : (
                                <ChevronDown className="h-5 w-5 text-white rotate-180" />
                            )}
                        </motion.div>
                    </Button>
                </form>
            </div>
        </div>
    );
}