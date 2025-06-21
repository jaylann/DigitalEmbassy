// src/components/chatbot-button.tsx

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * An icon button to open a chatbot interface, with a tooltip for accessibility.
 *
 * @returns {React.ReactElement} The rendered chatbot button.
 */
export function ChatbotButton(): React.ReactElement {
    return (
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
                            className="h-12 w-12 rounded-full bg-black/50 shadow-lg backdrop-blur-sm hover:bg-black/70"
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
    );
}