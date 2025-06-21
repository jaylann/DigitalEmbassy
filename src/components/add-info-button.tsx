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
import { SelectMap } from "@/components/select-map";
import { LandmarkDialog } from "@/components/landmark-dialog";
import { useLocation } from "@/lib/state/location";
import type { Landmark } from "@/lib/types";

/**
 * An icon button to allow users to add new information to the map.
 * Includes a tooltip for better user experience.
 *
 * This component now assumes that a <TooltipProvider> exists higher up in the component tree.
 *
 * @returns {React.ReactElement} The rendered "Add Info" button.
 */
interface AddInfoButtonProps {
    onAdd?: (lm: Landmark) => void;
}

export function AddInfoButton({ onAdd }: AddInfoButtonProps): React.ReactElement {
    const { lastKnownLocation } = useLocation();
    const [showPicker, setShowPicker] = React.useState(false);
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [picked, setPicked] = React.useState(lastKnownLocation);

    const handleMapSave = (loc: { lat: number; lng: number }) => {
        setPicked(loc);
        setShowPicker(false);
        setDialogOpen(true);
    };

    const handleAdd = (lm: Landmark) => {
        onAdd?.(lm);
    };

    return (
        <>
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
                            onClick={() => setShowPicker(true)}
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

            {showPicker && (
                <div className="fixed inset-0 z-50 bg-black">
                    <SelectMap onSave={handleMapSave} className="h-full w-full" />
                </div>
            )}

            <LandmarkDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                location={picked}
                onSubmit={handleAdd}
            />
        </>
    );
}