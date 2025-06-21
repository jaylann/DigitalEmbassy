// src/components/map-layout/map-overlay.tsx
"use client";

import * as React from "react";
// import { AddInfoButton } from "./add-info-button"; // REMOVE THIS
import { ChatbotButton } from "./chatbot-button";
import { MainMenu } from "./main-menu";
import { SearchBar } from "./search-bar";
import { StatusIndicator } from "./status-indicator";
import { SystemStatus } from "@/types/status";

interface MapOverlayProps {
    status: SystemStatus;
    // If other buttons need to be controlled from parent, add onClick props for them too
    // For example:
    // onChatbotClick: () => void;
    // onSearchSubmit: (query: string) => void;
}

export function MapOverlay({ status /*, onChatbotClick, onSearchSubmit */ }: MapOverlayProps): React.ReactElement {
    return (
        <div
            className="pointer-events-none fixed inset-0 z-20 flex flex-col justify-between p-4 sm:p-6"
            aria-hidden="true"
        >
            <header className="relative flex w-full items-start justify-center">
                <div className="pt-1">
                    <StatusIndicator status={status} />
                </div>
                <div className="absolute right-0 top-0">
                    <MainMenu />
                </div>
            </header>

            <footer className="flex w-full items-center justify-center">
                <div className="flex items-center justify-center gap-2 sm:gap-4">
                    {/* AddInfoButton is now rendered by the parent (HomePage.tsx) */}
                    <SearchBar /> {/* Assuming SearchBar doesn't need external onClick yet */}
                    <ChatbotButton /> {/* Assuming ChatbotButton handles its own action or has its own onClick from parent */}
                </div>
            </footer>
        </div>
    );
}