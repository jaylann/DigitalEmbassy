// src/components/map/InteractiveMap.tsx
"use client";

import * as React from "react";
import Map, { Source, Layer, MapRef, MapLayerMouseEvent } from "react-map-gl/maplibre";
import { motion, AnimatePresence } from "framer-motion";
import "maplibre-gl/dist/maplibre-gl.css";
// ... other necessary imports like Button, MapOverlay, CrisisWarningOverlay, MapMarker, types ...
import { Button } from "@/components/ui/button";
import { MapOverlay } from "@/components/map-overlay"; // Assuming this path is correct
import { CrisisWarningOverlay } from "@/components/crising-warning-oerlay"; // Check typo, adjust path
import { MapMarker } from "@/components/map-marker"; // Assuming this path is correct
import { SystemStatus } from "@/types/status";
import type { Landmark, LandmarkCategory, Location as LandmarkLocation } from "@/types/landmarks";
import type { Area } from "@/types/areas";


interface InteractiveMapProps {
    landmarks?: Landmark[];
    areas?: Area[];
    mapRef?: React.RefObject<MapRef | null>;
    onMapClick?: (event: MapLayerMouseEvent) => void;
    cursor?: string;
    // Props for temporary add marker if rendered here (alternative to parent rendering it)
    isAddingInfoMode?: boolean;
    temporaryMarkerLocation?: LandmarkLocation | null;
    onTemporaryMarkerClick?: () => void;
}

export function InteractiveMap({
                                   landmarks = [],
                                   areas = [],
                                   mapRef,
                                   onMapClick,
                                   cursor,
                                   // isAddingInfoMode, // Uncomment if using these
                                   // temporaryMarkerLocation,
                                   // onTemporaryMarkerClick
                               }: InteractiveMapProps): React.ReactElement {
    const localMapRef = React.useRef<MapRef>(null);
    const resolvedMapRef = mapRef || localMapRef;

    const [status, setStatus] = React.useState<SystemStatus>("Online");
    const [isCrisisAcknowledged, setIsCrisisAcknowledged] = React.useState(false);

    React.useEffect(() => {
        if (status !== "Crisis") {
            setIsCrisisAcknowledged(false);
        }
    }, [status]);

    const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY_LOCAL;
    if (!MAPTILER_KEY) {
        throw new Error("Missing NEXT_PUBLIC_MAPTILER_KEY environment variable.");
    }

    const getMarkerColor = (category: LandmarkCategory): string => { /* ... as defined before ... */
        switch (category) {
            case 'safe_space': return 'bg-green-500';
            case 'danger_zone': return 'bg-red-600';
            case 'medical': return 'bg-pink-500';
            case 'checkpoint': return 'bg-yellow-500';
            case 'satellite_phone': return 'bg-orange-500';
            case 'trusted_contact': return 'bg-blue-500';
            default: return 'bg-gray-500';
        }
    };

    // onLoad callback for map if you need to add images for icons
    const onMapLoad = React.useCallback(() => {
        const map = resolvedMapRef.current?.getMap();
        if (!map) return;
        // Example: logic to map.addImage('some-icon', ...);
        // This is where you'd load icons for news items or custom landmark icons if not using MapMarker children
    }, [resolvedMapRef]);

    return (
        <> {/* Using fragment as this component is now part of a larger page layout */}
            <AnimatePresence>
                {status === "Crisis" && !isCrisisAcknowledged && (
                    <CrisisWarningOverlay onAcknowledge={() => setIsCrisisAcknowledged(true)} />
                )}
            </AnimatePresence>

            <motion.div
                className="pointer-events-none absolute inset-0 z-10"
                animate={{ /* glow */ }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
            />

            <Map
                ref={resolvedMapRef}
                initialViewState={{ longitude: 51.3347, latitude: 35.7219, zoom: 12 }}
                mapStyle={`https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
                onClick={onMapClick}
                cursor={cursor || 'grab'}
                onLoad={onMapLoad} // Add onLoad if you have icon loading logic
            >
                {/* Render Areas */}
                {areas.map((area) => (
                    <Source key={area.id} id={`area-${area.id}`} type="geojson" data={area.geometry}>
                        <Layer
                            id={`area-fill-${area.id}`}
                            type="fill"
                            paint={{ /* ... category-based or direct styling ... */
                                "fill-color": area.fillColor || (
                                    area.category === 'no_go' ? 'rgba(220, 38, 38, 0.4)' :
                                        area.category === 'caution' ? 'rgba(245, 158, 11, 0.4)' :
                                            area.category === 'safe' ? 'rgba(34, 197, 94, 0.3)' :
                                                'rgba(107, 114, 128, 0.3)'
                                ),
                                "fill-opacity": 1,
                            }}
                        />
                        <Layer
                            id={`area-outline-${area.id}`}
                            type="line"
                            paint={{ /* ... category-based or direct styling ... */
                                "line-color": area.borderColor || (
                                    area.category === 'no_go' ? 'rgba(220, 38, 38, 0.8)' :
                                        area.category === 'caution' ? 'rgba(245, 158, 11, 0.8)' :
                                            area.category === 'safe' ? 'rgba(34, 197, 94, 0.7)' :
                                                'rgba(107, 114, 128, 0.7)'
                                ),
                                "line-width": 2
                            }}
                        />
                    </Source>
                ))}

                {/* Render Landmarks */}
                {landmarks.map((lm) => (
                    <MapMarker
                        key={lm.id}
                        latitude={lm.location.lat}
                        longitude={lm.location.lng}
                    >
                        <div title={lm.name} className={`h-4 w-4 -translate-y-1 rounded-full border-2 border-white ${getMarkerColor(lm.category)} shadow-md`} />
                    </MapMarker>
                ))}

                {/* If rendering temporary add marker here (alternative design)
                {isAddingInfoMode && temporaryMarkerLocation && (
                    <Marker longitude={temporaryMarkerLocation.lng} latitude={temporaryMarkerLocation.lat} anchor="bottom">
                        <div
                            className="flex flex-col items-center cursor-pointer p-2 bg-background rounded-md shadow-lg"
                            onClick={onTemporaryMarkerClick}
                        >
                            <MapPin className="h-8 w-8 text-primary animate-pulse" />
                            <span className="text-xs text-foreground mt-1">Add here?</span>
                        </div>
                    </Marker>
                )}
                */}
            </Map>

            {/* Map UI Overlays */}
            <div className="absolute top-4 right-4 z-20 pointer-events-none">
                <MapOverlay status={status} />
            </div>

            <div className="absolute bottom-24 right-4 z-20 flex flex-col gap-2 pointer-events-auto">
                {(["Online", "Transmitting", "Crisis", "Offline"] as SystemStatus[]).map((s) => (
                    <Button key={s} onClick={() => setStatus(s)} size="sm" variant="secondary">
                        Set: {s}
                    </Button>
                ))}
            </div>
        </>
    );
}