/**
 * Mobile-friendly layout with bottom navigation.
 */

"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Rss, Wallet, ListChecks, Settings } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * @interface NavItem
 * @property {string} href - The target URL for the navigation link.
 * @property {string} label - The text label displayed for the item.
 * @property {React.ElementType} icon - The Lucide icon component to display.
 */
interface NavItem {
    href: string;
    label:string;
    icon: React.ElementType;
}

const navItems: NavItem[] = [
    { href: "/", label: "Map", icon: Home },
    { href: "/news", label: "News", icon: Rss },
    { href: "/wallet", label: "Wallet", icon: Wallet },
    { href: "/faq", label: "FAQ", icon: ListChecks },
    { href: "/settings", label: "Settings", icon: Settings },
];

/**
 * @interface MobileLayoutProps
 * @property {React.ReactNode} children - The main content of the page to be rendered.
 */
interface MobileLayoutProps {
    children: React.ReactNode;
}

/**
 * A sleek, mobile-first layout component featuring an animated bottom navigation bar.
 * It provides the main structure for all pages, ensuring a consistent look and feel
 * that matches the application's modern, dark-themed aesthetic.
 *
 * @param {MobileLayoutProps} props - The component props.
 * @returns {React.ReactElement} The rendered mobile layout.
 */
export default function MobileLayout({ children }: MobileLayoutProps): React.ReactElement {
    const pathname = usePathname();

    return (
        // The main container ensures the background color is consistent even during overscroll.
        <div className="min-h-screen bg-gray-950">
            <main className="flex-1 pb-24">
                {/* pb-24 provides ample space so content isn't obscured by the nav bar */}
                {children}
            </main>

            <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 border-t border-white/10 bg-black/30 backdrop-blur-lg">
                <div className="mx-auto grid h-full max-w-lg grid-cols-5">
                    {navItems.map((item) => {
                        // Robust check for the active path.
                        const isActive = (pathname === '/' && item.href === '/') || (item.href !== '/' && pathname.startsWith(item.href));

                        return (
                            <motion.div
                                key={item.href}
                                className="relative flex h-full items-center justify-center"
                                whileTap={{ scale: 0.95 }}
                                animate={{ y: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <Link
                                    href={item.href}
                                    className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-1"
                                    aria-current={isActive ? "page" : undefined}
                                >
                                    <item.icon
                                        className={cn(
                                            "h-6 w-6 transition-colors",
                                            isActive ? "text-blue-400" : "text-gray-400 group-hover:text-gray-200"
                                        )}
                                        strokeWidth={isActive ? 2.5 : 2}
                                    />
                                    <span
                                        className={cn(
                                            "text-xs font-medium transition-colors",
                                            isActive ? "text-blue-400" : "text-gray-400 group-hover:text-gray-200"
                                        )}
                                    >
                    {item.label}
                  </span>
                                </Link>

                                {/*
                  This is the animated pill. `layoutId` is the key to Framer Motion's magic.
                  It tells Framer to treat this div as the "same" element across re-renders,
                  allowing it to animate its layout from its old position to its new one.
                */}
                                {isActive && (
                                    <motion.div
                                        layoutId="active-nav-pill"
                                        className="absolute inset-0 z-0 h-full w-full bg-white/10"
                                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                    />
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}