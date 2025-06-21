// src/components/map/MapOverlay.tsx

import * as React from "react";
import { AddInfoButton } from "../buttons/AddInfoButton";
import { ChatbotButton } from "../buttons/ChatbotButton";
import { MainMenu } from "../menu/MainMenu";
import { SearchBar } from "../search/SearchBar";
import { StatusIndicator } from "../status/StatusIndicator";
import {SystemStatus} from "@/types/status";

/**
 * @interface MapOverlayProps
 * @property {SystemStatus} status - The current system status.
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
            className="pointer-events-none fixed inset-0 z-20 flex flex-col justify-between p-4 sm:p-6"
            aria-hidden="true"
        >
            {/* Top section: Status Indicator and Main Menu */}
            <header className="relative flex w-full items-start justify-center">
                {/* Centered Status Indicator */}
                <div className="pt-1">
                    <StatusIndicator status={status} />
                </div>

                {/* Absolute positioned Main Menu on the right */}
                <div className="absolute right-0 top-0">
                    <MainMenu />
                </div>
            </header>

            {/* Bottom section: Search and Actions */}
            <footer className="flex w-full items-center justify-center">
                {/* Wrapper to group and center the bottom controls */}
                <div className="flex items-center justify-center gap-2 sm:gap-4">
                    <AddInfoButton />
                    <SearchBar />
                    <ChatbotButton />
                </div>
            </footer>
        </div>
    );
}