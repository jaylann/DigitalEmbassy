// src/components/map-layout/add-info-button.tsx

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * An icon button to allow users to add new information to the map.
 * Includes a tooltip for better user experience.
 *
 * This component now assumes that a <TooltipProvider> exists higher up in the component tree.
 *
 * @returns {React.ReactElement} The rendered "Add Info" button.
 */
export function AddInfoButton(): React.ReactElement {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut", delay: 0.1 }}
            className="pointer-events-auto"
        >
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="default"
                        size="icon"
                        className="h-12 w-12 rounded-full bg-black/50 shadow-lg backdrop-blur-sm hover:bg-black/70"
                        aria-label="Add Information to Map"
                    >
                        <Plus className="h-6 w-6 text-white" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-black/70 text-white border-none">
                    <p>Add Information</p>
                </TooltipContent>
            </Tooltip>
        </motion.div>
    );
}