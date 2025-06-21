// src/components/map-layout/add-info-button.tsx
"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip"; // Ensure this is the correct import for your Radix UI Tooltip
import { motion } from "framer-motion";
import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button"; // Path to your shadcn Button

interface AddInfoButtonProps {
    onClick: () => void;
    isActive?: boolean;
}

export function AddInfoButton({ onClick, isActive }: AddInfoButtonProps): React.ReactElement {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut", delay: 0.1 }}
            className="pointer-events-auto" // Ensure button is clickable
        >
            <TooltipProvider delayDuration={150}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant={isActive ? "secondary" : "default"}
                            size="icon"
                            className="h-12 w-12 rounded-full bg-black/50 shadow-lg backdrop-blur-sm hover:bg-black/70 data-[state=active]:bg-primary/80"
                            aria-label="Add Information to Map"
                            onClick={onClick}
                            data-state={isActive ? "active" : "inactive"}
                        >
                            <Plus className="h-6 w-6 text-white" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="bg-black/70 text-white border-none">
                        <p>{isActive ? "Click on map to place marker" : "Add Information"}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </motion.div>
    );
}