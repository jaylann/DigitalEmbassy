
// src/components/main-menu.tsx

"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Menu,
    HelpCircle,
    PhoneCall,
    Newspaper,
    Wallet,
    Map as MapIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

const menuItems = [
    {
        label: "Home",
        href: "/",
        icon: <MapIcon className="h-5 w-5" />,
    },
    {
        label: "Emergency Call",
        href: "/emergency-call",
        icon: <PhoneCall className="h-5 w-5" />,
        isEmergency: true,
    },
    {
        label: "FAQ",
        href: "/faq",
        icon: <HelpCircle className="h-5 w-5" />,
    },
    {
        label: "News",
        href: "/news",
        icon: <Newspaper className="h-5 w-5" />,
    },
    {
        label: "Wallet",
        href: "/wallet",
        icon: <Wallet className="h-5 w-5" />,
    },
];

/**
 * A main menu component that appears as a hamburger icon in the top-right corner.
 * On click, it reveals a popover with navigation links to other pages.
 *
 * @returns {React.ReactElement} The rendered main menu component.
 */
export function MainMenu(): React.ReactElement {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="pointer-events-auto"
        >
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-12 w-12 rounded-full bg-black/50 text-white shadow-lg backdrop-blur-sm hover:bg-black/70 hover:text-white"
                        aria-label="Open main menu"
                    >
                        <Menu className="h-6 w-6" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    align="end"
                    className="w-64 border-none bg-black/50 p-2 text-white shadow-2xl backdrop-blur-md"
                >
                    <nav>
                        <ul className="flex flex-col gap-1">
                            {menuItems.map((item) => (
                                <li key={item.href}>
                                    <Link href={item.href} className="block">
                                        <Button
                                            variant="ghost"
                                            className={`w-full justify-start gap-3 px-3 py-2 text-base ${
                                                item.isEmergency
                                                    ? "text-red-400 hover:bg-red-900/50 hover:text-red-300"
                                                    : "hover:bg-white/10"
                                            }`}
                                        >
                                            {item.icon}
                                            <span>{item.label}</span>
                                        </Button>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </PopoverContent>
            </Popover>
        </motion.div>
    );
}
