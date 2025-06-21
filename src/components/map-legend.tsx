// src/components/map-legend.tsx

"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, X } from "lucide-react";

import { areaConfig } from "@/components/area-popup";
import { cn } from "@/lib/utils";

/**
 * A collapsible map legend that displays the meaning of different area categories.
 * It is optimized for mobile by being collapsed by default and expanding on user interaction.
 */
export function MapLegend(): React.ReactElement {
    const [isOpen, setIsOpen] = React.useState(false);

    const legendItems = Object.values(areaConfig);

    return (
        // This 'relative' container is the positioning anchor for the popup.
        <div className="pointer-events-auto relative">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        /* Position the popup below the toggle button */
                        className="absolute top-full left-0 mt-2 w-48 origin-top-left rounded-lg border border-neutral-700 bg-black/70 p-3 shadow-xl backdrop-blur-md"

                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                        <h4 className="mb-2 text-sm font-semibold text-white">Legend</h4>
                        <ul className="space-y-2">
                            {legendItems.map(({ label, icon: Icon, styles }) => (
                                <li key={label} className="flex items-center gap-2">
                                    <div
                                        className={cn(
                                            "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-sm",
                                            styles.iconContainerBg
                                        )}
                                    >
                                        <Icon className="h-3 w-3 text-white" />
                                    </div>
                                    <span className="text-xs text-neutral-200">{label}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-800/80 text-white shadow-lg backdrop-blur-md transition-colors hover:bg-neutral-700/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-label={isOpen ? "Close Legend" : "Open Legend"}
                whileTap={{ scale: 0.9 }}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={isOpen ? "close" : "open"}
                        initial={{ opacity: 0, rotate: -30, scale: 0.5 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: 30, scale: 0.5 }}
                        transition={{ duration: 0.15 }}
                    >
                        {isOpen ? <X size={20} /> : <Layers size={20} />}
                    </motion.div>
                </AnimatePresence>
            </motion.button>
        </div>
    );
}