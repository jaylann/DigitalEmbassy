// src/components/map-layout/crisis-warning-overlay.tsx

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { TriangleAlert, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * @interface CrisisWarningOverlayProps
 * @property {() => void} onAcknowledge - Callback function to be invoked when the user clicks the "Acknowledge" button.
 */
interface CrisisWarningOverlayProps {
    onAcknowledge: () => void;
}

/**
 * A full-screen modal overlay that warns the user of a crisis event.
 * It obscures the entire UI until the user acknowledges the warning.
 * This component is designed to be used within a Framer Motion `AnimatePresence` wrapper
 * for smooth entry and exit animations.
 *
 * @param {CrisisWarningOverlayProps} props - The component props.
 * @returns {React.ReactElement} The rendered crisis warning overlay.
 */
export function CrisisWarningOverlay({ onAcknowledge }: CrisisWarningOverlayProps): React.ReactElement {
    return (
        <motion.div
            // This div serves as the full-screen backdrop
            className="fixed inset-0 z-50 flex items-center justify-center bg-red-950/80 p-4 backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
        >
            <motion.div
                // This is the main content card
                className="relative flex w-full max-w-lg flex-col items-center rounded-2xl border-2 border-red-500 bg-background/80 p-6 text-center shadow-2xl shadow-red-500/20 sm:p-8"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} // A nice "overshoot" easing
            >
                <motion.div
                    animate={{ scale: [1, 1.1, 1], rotate: [-5, 5, -5, 0] }}
                    transition={{
                        duration: 1.5,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatDelay: 2,
                    }}
                >
                    <TriangleAlert className="h-16 w-16 text-red-500" aria-hidden="true" />
                </motion.div>

                <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-red-400 sm:text-4xl">
                    CRISIS WARNING
                </h1>
                <p className="mt-4 text-lg text-foreground/90">
                    An active crisis has been declared. Your operational parameters have been updated.
                    New critical data is now available.
                </p>

                <div className="mt-6 w-full text-left">
                    <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
                        <ListChecks className="h-6 w-6 text-green-400" />
                        Unlocked Intel:
                    </h2>
                    <ul className="mt-2 list-inside list-disc space-y-1 pl-4 text-foreground/80">
                        <li>Updated safe & hostile zone mappings.</li>
                        <li>Real-time escape route suggestions.</li>
                        <li>Directory of sympathetic contacts.</li>
                        <li>Priority communication channels enabled.</li>
                    </ul>
                </div>

                <Button
                    onClick={onAcknowledge}
                    variant="destructive"
                    size="lg"
                    className="mt-8 w-full max-w-xs text-lg font-bold"
                >
                    Acknowledge & Proceed
                </Button>
            </motion.div>
        </motion.div>
    );
}