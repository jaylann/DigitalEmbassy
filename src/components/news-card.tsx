// src/components/news/NewsCard.tsx

"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Megaphone, Calendar, Info, AlertTriangle, FileText, ShieldCheck, ClipboardList } from "lucide-react";

import { cn, formatRelativeTime } from "@/lib/utils";
import {NewsItem} from "@/types/news-item";

/**
 * Configuration for styling and icons for different news tags.
 * This makes it easy to add or modify tag styles in one place.
 */
const tagConfig = {
    Update: {
        icon: <Megaphone className="h-4 w-4" />,
        color: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    },
    Event: {
        icon: <Calendar className="h-4 w-4" />,
        color: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    },
    Info: {
        icon: <Info className="h-4 w-4" />,
        color: "bg-green-500/20 text-green-300 border-green-500/30",
    },
    Alert: {
        icon: <AlertTriangle className="h-4 w-4" />,
        color: "bg-red-500/20 text-red-300 border-red-500/30",
    },
    Report: {
        icon: <FileText className="h-4 w-4" />,
        color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    },
    Response: {
        icon: <ShieldCheck className="h-4 w-4" />,
        color: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    },
    Briefing: {
        icon: <ClipboardList className="h-4 w-4" />,
        color: "bg-teal-500/20 text-teal-300 border-teal-500/30",
    },
    Default: {
        icon: <Info className="h-4 w-4" />,
        color: "bg-gray-500/20 text-gray-300 border-gray-500/30",
    },
};

/**
 * @interface NewsCardProps
 * @property {NewsItem} item - The news item data to display.
 * @property {boolean} isExpanded - Whether the card is currently expanded.
 * @property {() => void} onToggle - Callback function to toggle the card's expansion state.
 */
interface NewsCardProps {
    item: NewsItem;
    isExpanded: boolean;
    onToggle: () => void;
}

/**
 * A sleek, animated card component for displaying a single news item.
 * It features a colored tag, relative timestamp, and an expandable description.
 *
 * @param {NewsCardProps} props - The component props.
 * @returns {React.ReactElement} The rendered news card.
 */
export function NewsCard({ item, isExpanded, onToggle }: NewsCardProps): React.ReactElement {
    const { tag, headline, description, datetime } = item;
    const config = tagConfig[tag as keyof typeof tagConfig] ?? tagConfig.Default;
    const relativeTime = formatRelativeTime(datetime);

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <motion.div
            variants={cardVariants}
            layout // This prop animates layout changes, like when the card expands.
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="overflow-hidden rounded-2xl border border-white/10 bg-black/30 shadow-lg backdrop-blur-sm"
        >
            <button
                onClick={onToggle}
                className="flex w-full flex-col gap-3 p-4 text-left sm:p-5"
                aria-expanded={isExpanded}
            >
                <div className="flex items-center justify-between gap-4">
                    <div
                        className={cn(
                            "flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold",
                            config.color
                        )}
                    >
                        {config.icon}
                        <span>{tag}</span>
                    </div>
                    <span className="flex-shrink-0 text-xs text-gray-400">{relativeTime}</span>
                </div>
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-lg text-gray-50">{headline}</h2>
                    <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                    </motion.div>
                </div>
            </button>

            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.section
                        key="content"
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                            open: { opacity: 1, height: "auto" },
                            collapsed: { opacity: 0, height: 0 },
                        }}
                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden"
                    >
                        <div className="border-t border-white/10 px-4 pb-4 pt-3 text-sm text-gray-300 sm:px-5 sm:pb-5">
                            {description}
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>
        </motion.div>
    );
}