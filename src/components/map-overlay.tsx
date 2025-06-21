// src/components/map-layout/map-overlay.tsx

import * as React from "react";
import { ChatbotButton } from "./chatbot-button";
import { MainMenu } from "./main-menu";
import { SearchBar } from "./search-bar";
import { StatusIndicator } from "./status-indicator";
import { MapLegend } from "./map-legend"; // Import the legend component
import { SystemStatus } from "@/types/status";
import type { Landmark } from "@/lib/types";
import type { Area } from "@/types/areas";

/**
 * @interface MapOverlayProps
 * @property {SystemStatus} status - The current system status.
 */
interface MapOverlayProps {
    status: SystemStatus;
    landmarks: Landmark[];
    areas: Area[];
}

/**
 * A full-screen overlay for the map that arranges UI elements.
 * It uses `pointer-events-none` on the container and `pointer-events-auto`
 * on its children to allow map interaction while keeping UI elements clickable.
 *
 * @param {MapOverlayProps} props - The component props.
 * @returns {React.ReactElement} The rendered map overlay.
 */
export function MapOverlay({ status, landmarks, areas }: MapOverlayProps): React.ReactElement {
    const [searchActive, setSearchActive] = React.useState(false);
    const [filter, setFilter] = React.useState<"all" | "landmarks" | "areas">("all");

    const searchBar = (
        <SearchBar
            landmarks={landmarks}
            areas={areas}
            active={searchActive}
            filter={filter}
            onActiveChange={setSearchActive}
            onFilterChange={setFilter}
        />
    );

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
                        {searchBar}
                        <ChatbotButton />
                    </div>
                </footer>
        </div>
    );
}