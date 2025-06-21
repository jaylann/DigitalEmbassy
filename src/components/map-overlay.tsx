// src/components/map-layout/map-overlay.tsx

import * as React from "react";
import { SearchBar } from "./search-bar";
import { ChatbotButton } from "./chatbot-button";
import { StatusIndicator } from "./status-indicator";
import {SystemStatus} from "@/types/status";

/**
 * @interface MapOverlayProps
 * @property {SystemStatus} status - The current system status, passed to the StatusIndicator.
 */
interface MapOverlayProps {
    status: SystemStatus;
}

/**
 * A full-screen overlay for the map that arranges UI elements.
 * It uses `pointer-events-none` on the container and `pointer-events-auto`
 * on its children to allow map interaction while keeping UI elements clickable.
 *
 * @param {MapOverlayProps} props - The component props.
 * @returns {React.ReactElement} The rendered map overlay.
 */
export function MapOverlay({ status }: MapOverlayProps): React.ReactElement {
    return (
        <div
            className="pointer-events-none fixed inset-0 z-10 flex flex-col justify-between p-4 sm:p-6"
            aria-hidden="true" // Hide from screen readers as it's a visual overlay
        >
            {/* Top section: Status Indicator */}
            <header className="flex justify-start">
                <StatusIndicator status={status} />
            </header>

            {/* Bottom section: Search and Actions */}
            <footer className="flex items-center justify-center gap-4">
                <SearchBar />
                <ChatbotButton />
            </footer>
        </div>
    );
}