'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle, ListChecks, Rss, Settings, Home } from 'lucide-react';
import { cn } from "@/lib/utils"; // shadcn/ui utility

interface NavItem {
    href: string;
    label: string;
    icon: React.ElementType;
}

const navItems: NavItem[] = [
    { href: '/', label: 'Map', icon: Home }, // Assuming Map is the home page
    { href: '/faq', label: 'FAQ', icon: ListChecks },
    { href: '/chatbot', label: 'Chat', icon: MessageCircle },
    { href: '/liveticker', label: 'Ticker', icon: Rss },
    { href: '/settings', label: 'Settings', icon: Settings },
];

interface MobileLayoutProps {
    children: React.ReactNode;
    // You can add a prop for the page title if needed
    // pageTitle?: string;
}

export default function MobileLayout({ children }: MobileLayoutProps) {
    const pathname = usePathname();

    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* Optional: A simple top bar for page title or back button */}
            {/* <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <span className="font-semibold">{pageTitle || "Euromesh"}</span>
        </div>
      </header> */}

            <main className="flex-1 overflow-y-auto pb-20">
                {/* pb-20 to ensure content doesn't get hidden behind the fixed bottom bar */}
                {children}
            </main>

            <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 border-t bg-background shadow-t-lg">
                <div className="mx-auto grid h-full max-w-lg grid-cols-5 font-medium">
                    {navItems.map((item) => {
                        const isActive = (pathname === '/' && item.href === '/') || (item.href !== '/' && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={cn(
                                    "inline-flex flex-col items-center justify-center px-2 hover:bg-muted group",
                                    isActive ? "text-primary" : "text-muted-foreground"
                                )}
                            >
                                <item.icon
                                    className={cn(
                                        "w-6 h-6 mb-1 group-hover:text-primary",
                                        isActive ? "text-primary" : "text-muted-foreground"
                                    )}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                                <span className="text-xs">
                  {item.label}
                </span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}