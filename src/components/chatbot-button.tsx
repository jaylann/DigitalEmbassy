/**
 * @file Renders a floating action button that opens a full-screen, mobile-first
 * chatbot interface. This component controls the modal state and orchestrates
 * the real-time chat logic.
 */

"use client";

import * as React from "react";
import {AnimatePresence, motion} from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {ArrowUp, Bot, Loader2, X} from "lucide-react";
import clsx from "clsx";

// --- UI Component Imports ---
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
// --- UI Component Imports ---
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {ScrollArea} from "@/components/ui/scroll-area";
import {SelectMap} from "@/components/select-map"; // Updated Import
// --- Logic and Type Imports ---
// --- Logic and Type Imports ---
import {getGeminiResponse} from "@/lib/actions/gemini";
import {saveReportToMesh} from "@/lib/actions/mesh";
import type {Location, Message} from "@/lib/types"; // Ensure Location type is exported
import {cn} from "@/lib/utils";
import {useLocation} from "@/lib/state/location";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

// --- Main Controller Component ---

/**
 * An icon button to open a full-screen chatbot interface optimized for mobile.
 * It manages the modal's open/close state and houses the chat logic.
 */
export function ChatbotButton(): React.ReactElement {
    const [isOpen, setIsOpen] = React.useState(false);

    // Prevent body scroll when chat is open
    React.useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = isOpen ? 'hidden' : originalOverflow;
        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [isOpen]);

    return (<>
            <motion.div /* Floating Action Button */
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5, ease: "easeInOut", delay: 0.3}}
                className="pointer-events-auto"
            >
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="default"
                            size="icon"
                            onClick={() => setIsOpen(true)}
                            className="h-12 w-12 rounded-full bg-black/50 shadow-lg backdrop-blur-sm hover:bg-black/70 transition-colors"
                            aria-label="Open Chatbot"
                        >
                            <Bot className="h-6 w-6 text-white"/>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="bg-black/70 text-white border-none"><p>Open Chatbot</p>
                    </TooltipContent>
                </Tooltip>
            </motion.div>

            <AnimatePresence>
                {isOpen && (<motion.div /* Full-Screen Chat Modal */
                        initial={{y: "100%"}}
                        animate={{y: 0}}
                        exit={{y: "100%"}}
                        transition={{type: "spring", damping: 30, stiffness: 300, mass: 0.8}}
                        className="fixed inset-0 z-50 bg-black flex flex-col pointer-events-auto"
                        style={{height: "100dvh"}}
                    >
                        {/* Header with only the close button */}
                        <div
                            className="flex items-center justify-end p-4 bg-black border-b border-zinc-800 safe-area-top shrink-0">
                            {/* The grip bar has been removed. justify-end positions the button correctly. */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsOpen(false)}
                                className="h-10 w-10 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white"
                                aria-label="Close Chatbot"
                            >
                                <X className="h-5 w-5"/>
                            </Button>
                        </div>

                        {/* Integrated, fully functional chat interface */}
                        <div className="flex-1 flex flex-col min-h-0">
                            <ChatPanelContent/>
                        </div>
                    </motion.div>)}
            </AnimatePresence>
        </>);
}


const MemoizedMarkdown = React.memo(({content}: { content: string }) => (
    <div className="prose prose-sm prose-invert break-words">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>));
MemoizedMarkdown.displayName = "MemoizedMarkdown";

/**
 * The core UI and logic for the chat panel.
 */
export function ChatPanelContent(): React.ReactElement {
    const [messages, setMessages] = React.useState<Message[]>([{
        id: "init",
        role: "assistant",
        content: "I am the Euromesh emergency assistant. You can ask for information or report a new danger."
    },]);
    const [input, setInput] = React.useState("");
    const [isPending, startTransition] = React.useTransition();
    const {lastKnownLocation, setLastKnownLocation} = useLocation();

    // State to control the visibility of the new SelectMap overlay
    const [isLocationPickerOpen, setLocationPickerOpen] = React.useState(false);

    const scrollAreaRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        // Auto-scroll to the latest message
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({top: scrollAreaRef.current.scrollHeight, behavior: 'smooth'});
        }
    }, [messages]);

    /**
     * Handles the submission of a new message from the user.
     * @param {React.FormEvent<HTMLFormElement>} event - The form submission event.
     */
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        const trimmedInput = input.trim();
        if (!trimmedInput || isPending) return;

        const userMessage: Message = {id: crypto.randomUUID(), role: "user", content: trimmedInput};
        setMessages(prev => [...prev, userMessage]);
        setInput("");

        startTransition(async () => {
            const result = await getGeminiResponse([...messages, userMessage]);

            if (result.success) {
                const assistantResponse = result.data;
                let finalAssistantMessage: Message;

                switch (assistantResponse.type) {
                    case 'message':
                        finalAssistantMessage = {
                            id: crypto.randomUUID(),
                            role: 'assistant',
                            content: assistantResponse.payload.content
                        };
                        setMessages(prev => [...prev, finalAssistantMessage]);
                        break;
                    case 'report':
                        saveReportToMesh(assistantResponse.payload, lastKnownLocation);
                        finalAssistantMessage = {
                            id: crypto.randomUUID(),
                            role: 'assistant',
                            content: "Thank you. Your report has been received and will be shared with the network."
                        };
                        setMessages(prev => [...prev, finalAssistantMessage]);
                        break;
                    case 'location_request':
                        // Set the AI's response message first
                        finalAssistantMessage = {
                            id: crypto.randomUUID(),
                            role: 'assistant',
                            content: assistantResponse.payload.content
                        };
                        setMessages(prev => [...prev, finalAssistantMessage]);
                        // Then, open the map picker
                        setLocationPickerOpen(true);
                        break;
                }
            } else {
                // Handle API error gracefully
                const errorMessage: Message = {
                    id: crypto.randomUUID(),
                    role: 'assistant',
                    content: "I'm sorry, I encountered an error. Please try again.",
                    isError: true,
                };
                setMessages(prev => [...prev, errorMessage]);
            }
        });
    };

    /**
     * Handles the location data returned from the SelectMap component.
     * @param {Location} location - The geographic coordinates selected by the user.
     */
    const handleLocationSave = (location: Location): void => {
        // 1. Update the global location state
        setLastKnownLocation(location);

        // 2. Close the map picker
        setLocationPickerOpen(false);

        // 3. Add a confirmation message to the chat for better UX
        const confirmationMessage: Message = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: `Location confirmed at latitude ${location.lat.toFixed(4)}, longitude ${location.lng.toFixed(4)}. How can I assist you further?`
        };
        setMessages(prev => [...prev, confirmationMessage]);
    };

    return (<div className="flex flex-col h-full bg-black">
            {/* The SelectMap component is placed at the top level to allow it to overlay everything */}
            <SelectMap
                isOpen={isLocationPickerOpen}
                onClose={() => setLocationPickerOpen(false)}
                onSave={handleLocationSave}
                initialCenter={lastKnownLocation}
            />

            {/* Header */}
            <div className="flex items-center space-x-3 p-4 border-b border-zinc-800 shrink-0">
                <Avatar><AvatarFallback className="bg-zinc-800 text-white"><Bot/></AvatarFallback></Avatar>
                <div>
                    <h2 className="text-white font-semibold">Euromesh Assistant</h2>
                    <p className="text-zinc-400 text-sm">Official Emergency Channel</p>
                </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 min-h-0" ref={scrollAreaRef}>
                <div className="p-4 space-y-4">
                    {messages.map((message) => (<motion.div
                            key={message.id}
                            initial={{opacity: 0, y: 10}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.3}}
                            className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
                        >
                            <div
                                className={clsx("max-w-[85%] px-4 py-2.5 rounded-2xl", message.role === "user" ? "bg-zinc-200 text-zinc-900" : "bg-zinc-800 text-white", message.isError && "bg-red-900/50 border border-red-500/50")}>
                                <MemoizedMarkdown content={message.content}/>
                            </div>
                        </motion.div>))}
                    {isPending && (<motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}}
                                               className="flex justify-start">
                            <div className="bg-zinc-800 p-3 rounded-full">
                                <Loader2 className="h-5 w-5 text-white/50 animate-spin"/>
                            </div>
                        </motion.div>)}
                </div>
            </ScrollArea>

            {/* Input Form */}
            <div className="p-4 border-t border-zinc-800 shrink-0 safe-area-bottom">
                <form onSubmit={handleSubmit} className="flex items-center space-x-3">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your question or report..."
                        className="flex-1 h-12 px-5 bg-zinc-800 text-white rounded-full border-zinc-700 placeholder-zinc-500"
                        disabled={isPending || isLocationPickerOpen} // Disable input when map is open
                        autoComplete="off"
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={isPending || !input.trim() || isLocationPickerOpen}
                        className="h-12 w-12 rounded-full bg-zinc-200 text-zinc-900 hover:bg-white disabled:bg-zinc-800 disabled:text-white/50 shrink-0"
                    >
                        <ArrowUp className="h-5 w-5"/>
                    </Button>
                </form>
            </div>
        </div>);
}