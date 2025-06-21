// src/components/status-indicator.tsx

"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {SystemStatus} from "@/types/status";

/**
 * @typedef {object} StatusConfig
 * @property {string} label - The text to display.
 * @property {string} color - The Tailwind CSS class for the indicator dot color.
 * @property {string} pulseColor - The Tailwind CSS class for the pulsating animation color (if any).
 */
const statusConfig: Record<SystemStatus, { label: string; color: string; pulseColor?: string }> = {
    Online: { label: "Online", color: "bg-green-500" },
    Offline: { label: "Offline", color: "bg-gray-400" },
    Crisis: { label: "Crisis", color: "bg-red-500", pulseColor: "bg-red-400" },
    Transmitting: { label: "Transmitting", color: "bg-blue-500", pulseColor: "bg-blue-400" },
};

/**
 * @interface StatusIndicatorProps
 * @property {SystemStatus} status - The current system status to display.
 */
interface StatusIndicatorProps {
    status: SystemStatus;
}

/**
 * A component to display the current system status with a colored indicator.
 * It uses Framer Motion for smooth transitions between states.
 *
 * @param {StatusIndicatorProps} props - The component props.
 * @returns {React.ReactElement} The rendered status indicator component.
 */
export function StatusIndicator({ status }: StatusIndicatorProps): React.ReactElement {
    const { label, color, pulseColor } = statusConfig[status];

    return (
        <AnimatePresence mode="wait" initial={false}>
            <motion.div
                key={status}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="pointer-events-auto flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 text-sm font-medium text-white shadow-lg backdrop-blur-sm"
            >
        <span className="relative flex h-3 w-3">
          <span className={cn("absolute inline-flex h-full w-full rounded-full", color)} />
            {pulseColor && (
                <span
                    className={cn(
                        "relative inline-flex h-3 w-3 rounded-full animate-ping",
                        pulseColor,
                    )}
                />
            )}
        </span>
                <span>{label}</span>
            </motion.div>
        </AnimatePresence>
    );
}