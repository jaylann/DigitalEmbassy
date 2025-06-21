// src/components/map-layout/map-overlay.tsx
"use client";

import * as React from "react";
import { AddInfoButton } from "./add-info-button";
import { ChatbotButton } from "./chatbot-button";
import { MainMenu } from "./main-menu";
import { SearchBar } from "./search-bar";
import { StatusIndicator } from "./status-indicator";
import { MapLegend } from "./map-legend";
import { SystemStatus } from "@/types/status";

interface MapOverlayProps {
    status: SystemStatus;
    onAddInfoClick: () => void;      // Prop for AddInfoButton's onClick
    isAddInfoModeActive: boolean; // Prop for AddInfoButton's isActive state
}

export function MapOverlay({
                               status,
                               onAddInfoClick,
                               isAddInfoModeActive
                           }: MapOverlayProps): React.ReactElement {
    return (
        <div
            className="pointer-events-none fixed inset-0 z-20 flex flex-col justify-between p-4 sm:p-6"
            aria-hidden="true"
        >
            <header className="relative flex w-full items-start justify-center">
                <div className="absolute left-0 top-0">
                    <MapLegend />
                </div>
                <div className="pt-1">
                    <StatusIndicator status={status} />
                </div>
                <div className="absolute right-0 top-0">
                    <MainMenu />
                </div>
            </header>

            <footer className="flex w-full items-center justify-center">
                <div className="flex items-center justify-center gap-2 sm:gap-4">
                    <AddInfoButton onClick={onAddInfoClick} isActive={isAddInfoModeActive} />
                    <SearchBar />
                    <ChatbotButton />
                </div>
            </footer>
        </div>
    );
}