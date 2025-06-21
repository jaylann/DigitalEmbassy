// src/components/search-bar.tsx

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

/**
 * A round search bar component designed for the map overlay.
 *
 * @returns {React.ReactElement} The rendered search bar.
 */
export function SearchBar(): React.ReactElement {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut", delay: 0.2 }}
            className="pointer-events-auto relative w-full max-w-xs"
        >
            <Search
                className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
            />
            <Input
                type="search"
                placeholder="Search location..."
                className="h-12 w-full rounded-full border-none bg-black/50 pl-11 pr-4 text-white shadow-lg backdrop-blur-sm placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
            />
        </motion.div>
    );
}