/**
 * @file A fully interactive and self-contained chat interface component.
 * @author [Your Name]
 */

"use client";

import { useState, useTransition, useRef, useEffect, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowUp, Plus, Bot, User, Loader2 } from "lucide-react";
import clsx from "clsx";

// --- shadcn/ui Component Imports ---
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

// --- Server Action & Type Imports ---
import { getGeminiResponse } from "@/lib/actions/gemini";
import type { Message } from "@/lib/types";

/**
 * A reusable chat interface component for interacting with the Euromesh AI assistant.
 * It handles message state, user input, API calls, loading states, and error display.
 */
export function ChatInterface() {
    // --- State Management ---
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "init",
            role: "assistant",
            content: "I am the Euromesh emergency assistant. How can I help you based on the latest local data?",
        },
    ]);
    const [input, setInput] = useState<string>("");
    const [isPending, startTransition] = useTransition();

    // --- Refs for UI Manipulation ---
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    /**
     * Effect to auto-scroll to the bottom of the chat window when new messages are added.
     * This provides a natural chat experience for the user.
     */
    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages]);

    /**
     * Handles the form submission event. It sends the user's message,
     * calls the server action, and updates the chat with the AI's response.
     * @param {FormEvent<HTMLFormElement>} event - The form submission event.
     */
    const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        const trimmedInput = input.trim();
        if (!trimmedInput || isPending) return;

        // Create the new user message and add it to the state optimistically
        const userMessage: Message = {
            id: crypto.randomUUID(),
            role: "user",
            content: trimmedInput,
        };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");

        // Use `startTransition` to call the server action without blocking the UI
        startTransition(async () => {
            // In a real app, this would be dynamic data based on the user's location.
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
        <Card className="w-full max-w-2xl h-[70vh] flex flex-col bg-black border-zinc-800 shadow-2xl shadow-zinc-900/50">
            {/* --- Chat Header --- */}
            <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-800 p-4">
                <div className="flex items-center space-x-4">
                    <Avatar>
                        <AvatarImage src="/euromesh-logo.png" alt="Euromesh Logo" />
                        <AvatarFallback className="bg-zinc-700 text-white">
                            <Bot />
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-medium leading-none text-white">Euromesh Assistant</p>
                        <p className="text-sm text-zinc-400">Official Emergency Channel</p>
                    </div>
                </div>
                <Button variant="secondary" size="icon" className="rounded-full bg-zinc-800 hover:bg-zinc-700">
                    <Plus className="h-4 w-4 text-white" />
                </Button>
            </CardHeader>

            {/* --- Message Display Area --- */}
            <CardContent className="flex-1 p-0">
                <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                    <div className="space-y-4">
                        {messages.map((message) => (
                            <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className={clsx(
                                    "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                                    message.role === "user"
                                        ? "ml-auto bg-zinc-200 text-zinc-900"
                                        : "bg-zinc-800 text-zinc-50",
                                    message.isError && "bg-red-900/50 border border-red-500/50"
                                )}
                            >
                                {message.content}
                            </motion.div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>

            {/* --- Input Form --- */}
            <CardFooter className="p-4 border-t border-zinc-800">
                <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
                    <Input
                        id="message"
                        placeholder="Type your question..."
                        className="flex-1 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-500"
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
                        {isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin text-white" />
                        ) : (
                            <ArrowUp className="h-4 w-4 text-white" />
                        )}
                    </Button>
                </form>
            </CardFooter>
        </Card>
    );
}