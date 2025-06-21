// src/components/map-layout/add-info-button.tsx
"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { motion } from "framer-motion";
import * as React from "react";
import {Plus} from "lucide-react";
import { Button } from "./ui/button";
// ... other imports

interface AddInfoButtonProps {
    onClick: () => void; // Expects an onClick function
    isActive?: boolean;   // Expects an optional isActive boolean
}

/**
 * An icon button to allow users to add new information to the map.
 */
export function AddInfoButton({ onClick, isActive }: AddInfoButtonProps): React.ReactElement { // Props are destructured here
    return (
        // ... JSX using onClick and isActive ...
        <motion.div /* ... */ >
            <TooltipProvider /* ... */ >
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant={isActive ? "secondary" : "default"}
                            size="icon"
                            className="h-12 w-12 rounded-full bg-black/50 shadow-lg backdrop-blur-sm hover:bg-black/70 data-[state=active]:bg-primary/80"
                            aria-label="Add Information to Map"
                            onClick={onClick} // Prop is used here
                            data-state={isActive ? "active" : "inactive"}
                        >
                            <Plus className="h-6 w-6 text-white" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent /* ... */ >
                        <p>{isActive ? "Click on map to add" : "Add Information"}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </motion.div>
    );
}