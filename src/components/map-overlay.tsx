// src/components/map-layout/map-overlay.tsx

import * as React from "react";
import { AddInfoButton } from "./add-info-button";
import { ChatbotButton } from "./chatbot-button";
import { MainMenu } from "./main-menu";
import { SearchBar } from "./search-bar";
import { StatusIndicator } from "./status-indicator";
import { MapLegend } from "./map-legend"; // Import the legend component
import { Switch } from "@/components/ui/switch";
import { SystemStatus } from "@/types/status";
import type { Landmark } from "@/lib/types";
import type { Area } from "@/types/areas";
import type { Geometry, Point, LineString, Polygon, MultiPolygon } from "geojson";

/**
 * @interface MapOverlayProps
 * @property {SystemStatus} status - The current system status.
 */
interface MapOverlayProps {
    status: SystemStatus;
    landmarks: Landmark[];
    areas: Area[];
    onSearchSelect: (lng: number, lat: number) => void;
    showLandmarks: boolean;
    showAreas: boolean;
    setShowLandmarks: (value: boolean) => void;
    setShowAreas: (value: boolean) => void;
}

/**
 * A full-screen overlay for the map that arranges UI elements.
 * It uses `pointer-events-none` on the container and `pointer-events-auto`
 * on its children to allow map interaction while keeping UI elements clickable.
 *
 * @param {MapOverlayProps} props - The component props.
 * @returns {React.ReactElement} The rendered map overlay.
 */
export function MapOverlay({
    status,
    landmarks,
    areas,
    onSearchSelect,
    showLandmarks,
    showAreas,
    setShowLandmarks,
    setShowAreas,
}: MapOverlayProps): React.ReactElement {
    const [searchActive, setSearchActive] = React.useState(false);

    const getAreaCenter = React.useCallback((area: Area) => {
        const feature = 'features' in area.geometry ? area.geometry.features[0] : area.geometry;
        const geom = feature.geometry as Geometry;
        let coords: number[][] = [];
        if (geom.type === 'Polygon') {
            coords = (geom as Polygon).coordinates[0];
        } else if (geom.type === 'MultiPolygon') {
            coords = (geom as MultiPolygon).coordinates[0][0];
        } else if (geom.type === 'LineString') {
            coords = (geom as LineString).coordinates as number[][];
        } else if (geom.type === 'Point') {
            const c = (geom as Point).coordinates;
            return { lng: c[0], lat: c[1] };
        }
        const [lngSum, latSum] = coords.reduce(
            (acc, c) => [acc[0] + c[0], acc[1] + c[1]],
            [0, 0]
        );
        const len = coords.length || 1;
        return { lng: lngSum / len, lat: latSum / len };
    }, []);

    const handleSearch = React.useCallback(
        (query: string) => {
            const q = query.toLowerCase();
            const lm = landmarks.find((l) => l.name.toLowerCase().includes(q));
            if (lm) {
                onSearchSelect(lm.location.lng, lm.location.lat);
                setSearchActive(false);
                return;
            }
            const area = areas.find((a) => a.name.toLowerCase().includes(q));
            if (area) {
                const center = getAreaCenter(area);
                onSearchSelect(center.lng, center.lat);
            }
            setSearchActive(false);
        },
        [areas, landmarks, getAreaCenter, onSearchSelect]
    );

    return (
        <div
            className={`pointer-events-none fixed inset-0 z-20 flex flex-col ${
                searchActive ? 'items-center p-4' : 'justify-between p-4 sm:p-6'
            }`}
            aria-hidden="true"
        >
            {!searchActive && (
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
            )}

            {searchActive ? (
                <div className="flex flex-col items-center gap-2 w-full max-w-xs">
                    <SearchBar
                        onBlur={() => setSearchActive(false)}
                        onSearch={handleSearch}
                        autoFocus
                    />
                    <div className="pointer-events-auto flex gap-4 text-white text-sm">
                        <label className="flex items-center gap-2">
                            <Switch
                                checked={showLandmarks}
                                onCheckedChange={setShowLandmarks}
                            />
                            Landmarks
                        </label>
                        <label className="flex items-center gap-2">
                            <Switch checked={showAreas} onCheckedChange={setShowAreas} />
                            Areas
                        </label>
                    </div>
                </div>
            ) : (
                <footer className="flex w-full items-center justify-center">
                    <div className="flex items-center justify-center gap-2 sm:gap-4">
                        <AddInfoButton />
                        <SearchBar onFocus={() => setSearchActive(true)} onSearch={handleSearch} />
                        <ChatbotButton />
                    </div>
                </footer>
            )}
        </div>
    );
}