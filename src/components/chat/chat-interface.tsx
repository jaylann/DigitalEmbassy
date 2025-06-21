/**
 * @file A fully interactive and self-contained chat interface component.
 * This version includes layout overflow fixes, text wrapping, and Markdown rendering.
 */

"use client";

import { useState, useTransition, useRef, useEffect, type FormEvent, memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { ArrowUp, Bot, Loader2 } from "lucide-react";
import clsx from "clsx";

// UI components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

// Server actions and types
import { getGeminiResponse } from "@/lib/actions/gemini";
import type { Message } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * A memoized component to render Markdown safely.
 * It wraps ReactMarkdown in a styled div, which is the correct pattern
 * for applying styles, especially with Tailwind's typography plugin.
 * @param {{ content: string }} props - The markdown content to render.
 */
const MemoizedMarkdown = memo(({ content }: { content: string }) => (
    <div className="prose prose-sm prose-invert break-words">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
));
MemoizedMarkdown.displayName = "MemoizedMarkdown";


/**
 * A reusable chat interface for interacting with the Euromesh AI assistant.
 * Manages message state, API calls, and renders the UI.
 */
export function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "init",
            role: "assistant",
            content: "I am the Euromesh emergency assistant. How can I help you based on the latest local data?",
        },
    ]);
    const [input, setInput] = useState<string>("");
    const [isPending, startTransition] = useTransition();
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages]);

    const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        const trimmedInput = input.trim();
        if (!trimmedInput || isPending) return;

        const userMessage: Message = { id: crypto.randomUUID(), role: "user", content: trimmedInput };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");

        startTransition(async () => {
            const mockEmergencyDocuments = [
                { safe_point: "Central Station", status: "Open", capacity: 200, coordinates: "48.13, 11.57" },
                { danger_zone: "Old Town Bridge", reason: "Flooding", severity: "High" },
                { embassy_contact: { phone: "+49 30 1234567", address: "Embassy Avenue 1, Berlin" } }
            ];
            const result = await getGeminiResponse(mockEmergencyDocuments, trimmedInput);
            const assistantMessage: Message = {
                id: crypto.randomUUID(),
                role: "assistant",
                content: result.success ? result.data : result.error,
                isError: !result.success,
            };
            setMessages((prev) => [...prev, assistantMessage]);
        });
    };

    return (
        <Card className="w-full max-w-2xl h-[85vh] flex flex-col bg-black border-zinc-800 shadow-2xl shadow-zinc-900/50">
            {/* Optional '+' button removed from the header */}
            <CardHeader className="flex flex-row items-center border-b border-zinc-800 p-4">
                <div className="flex items-center space-x-4">
                    <Avatar>
                        <AvatarImage src="/euromesh-logo.png" alt="Euromesh Logo" />
                        <AvatarFallback className="bg-zinc-700 text-white"><Bot /></AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-medium leading-none text-white">Euromesh Assistant</p>
                        <p className="text-sm text-zinc-400">Official Emergency Channel</p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 p-0 min-h-0">
                <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                    <div className="space-y-4">
                        {messages.map((message) => (
                            <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className={cn(
                                    "flex flex-col",
                                    message.role === "user" ? "items-end" : "items-start"
                                )}
                            >
                                <div
                                    className={clsx(
                                        "max-w-[80%] rounded-lg px-3 py-2",
                                        message.role === "user"
                                            ? "bg-zinc-200 text-zinc-900"
                                            : "bg-zinc-800 text-zinc-50",
                                        message.isError && "bg-red-900/50 border border-red-500/50"
                                    )}
                                >
                                    <MemoizedMarkdown content={message.content} />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>

            <CardFooter className="p-4 border-t border-zinc-800">
                <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
                    <Input
                        id="message"
                        placeholder="Type your question..."
                        className="flex-1 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-500 rounded-lg"
                        autoComplete="off"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isPending}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        className="bg-zinc-800 hover:bg-zinc-700 rounded-full shrink-0"
                        disabled={isPending || !input.trim()}
                    >
                        {isPending ? (<Loader2 className="h-4 w-4 animate-spin text-white" />) : (<ArrowUp className="h-4 w-4 text-white" />)}
                    </Button>
                </form>
            </CardFooter>
        </Card>
    );
}