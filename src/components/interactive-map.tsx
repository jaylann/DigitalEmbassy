// src/components/interactive-map.tsx
"use client";

import * as React from "react";
import Map, { Source, Layer, MapRef, MapLayerMouseEvent, Marker } from "react-map-gl/maplibre";
import type { LineString } from "geojson";
import { motion, AnimatePresence } from "framer-motion";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MapOverlay } from "@/components/map-overlay";
import { CrisisWarningOverlay } from "@/components/crising-warning-oerlay"; // Check typo if it's 'crisis-warning-overlay'
import { LandmarkMarker } from "@/components/landmark-marker";
import { AnimatedRoute } from "@/components/animated-route";
import { useLocation as useAppLocationHook } from "@/lib/state/location"; // Aliased to avoid conflict
import { AreaPopup } from "@/components/area-popup";
import { SystemStatus } from "@/types/status";
import type { Area, AreaCategory } from "@/types/areas";
import { Landmark, Location as LandmarkLocation, LandmarkCategory as LMCategory } from "@/lib/types"; // Using types from lib

const CATEGORY_COLORS: Record<AreaCategory, { fill: string; border: string }> = {
    no_go: { fill: "#DC2626", border: "#b91c1c" }, // Red-600, Red-700
    caution: { fill: "#FACC15", border: "#CA8A04" }, // Yellow-400, Yellow-600
    safe: { fill: "#16A34A", border: "#15803D" }, // Green-600, Green-700
};

interface InteractiveMapProps {
    landmarks?: Landmark[];
    areas?: Area[];
    route?: LineString;
    mapRef?: React.RefObject<MapRef>;

    // "Add Info" related props from parent (HomePage)
    isAddingInfoMode: boolean;
    onMapInteractionClick: (event: MapLayerMouseEvent) => void; // Parent's unified click handler
    temporaryMarkerLocation?: LandmarkLocation | null;
    onTemporaryMarkerClick?: () => void;

    // Callback for AddInfoButton, to be passed to MapOverlay
    onAddInfoButtonClickCallback: () => void;
}

export function InteractiveMap({
                                   landmarks = [],
                                   areas = [],
                                   route,
                                   mapRef,
                                   isAddingInfoMode,
                                   onMapInteractionClick,
                                   temporaryMarkerLocation,
                                   onTemporaryMarkerClick,
                                   onAddInfoButtonClickCallback
                               }: InteractiveMapProps): React.ReactElement {
    const localMapRefInternal = React.useRef<MapRef>(null);
    const resolvedMapRef = mapRef || localMapRefInternal;

    const [status, setStatus] = React.useState<SystemStatus>("Online");
    const [isCrisisAcknowledged, setIsCrisisAcknowledged] = React.useState(false);
    const { lastKnownLocation } = useAppLocationHook();
    const [selectedArea, setSelectedArea] = React.useState<{
        area: Area;
        coordinates: { lng: number; lat: number };
    } | null>(null);

    React.useEffect(() => {
        if (status !== "Crisis") setIsCrisisAcknowledged(false);
    }, [status]);

    const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY_LOCAL;
    if (!MAPTILER_KEY) {
        throw new Error("Missing NEXT_PUBLIC_MAPTILER_KEY environment variable.");
    }

    const interactiveAreaLayers = React.useMemo(
        () => areas.flatMap((a) => [`area-fill-${a.id}`, `area-outline-${a.id}`]),
        [areas]
    );

    // This component's internal click handler now just calls the parent's handler
    const handleMapClick = (event: MapLayerMouseEvent) => {
        if (onMapInteractionClick) {
            onMapInteractionClick(event);
        }
    };

    const getLandmarkMarkerColor = (category: LMCategory): string => {
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

    return (
        <main className="relative h-screen w-screen overflow-hidden bg-black"> {/* Original main tag */}
            <AnimatePresence>
                {status === "Crisis" && !isCrisisAcknowledged && (
                    <CrisisWarningOverlay onAcknowledge={() => setIsCrisisAcknowledged(true)} />
                )}
            </AnimatePresence>

            <motion.div
                className="pointer-events-none absolute inset-0 z-10"
                animate={{
                    boxShadow:
                        status === "Transmitting"
                            ? "inset 0px 0px 20px 5px rgba(59, 130, 246, 0.6)"
                            : "inset 0px 0px 0px 0px rgba(59, 130, 246, 0)",
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
            />

            <Map
                ref={resolvedMapRef}
                initialViewState={{ longitude: lastKnownLocation.lng, latitude: lastKnownLocation.lat, zoom: 12 }}
                mapStyle={`https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
                onClick={handleMapClick}
                interactiveLayerIds={isAddingInfoMode ? [] : interactiveAreaLayers}
                cursor={isAddingInfoMode ? 'crosshair' : 'grab'}
            >
                {areas.map((area) => {
                    const colors = CATEGORY_COLORS[area.category];
                    return (
                        <Source key={area.id} id={`area-${area.id}`} type="geojson" data={area.geometry}>
                            <Layer
                                id={`area-fill-${area.id}`}
                                type="fill"
                                paint={{
                                    "fill-color": area.fillColor ?? colors.fill,
                                    "fill-opacity": 0.25,
                                }}
                            />
                            <Layer
                                id={`area-outline-${area.id}`}
                                type="line"
                                paint={{
                                    "line-color": area.borderColor ?? colors.border,
                                    "line-width": 2,
                                }}
                            />
                        </Source>
                    );
                })}

                {landmarks.map((lm) => (
                    <LandmarkMarker key={lm.id} landmark={lm}>
                        <div title={lm.name} className={`h-4 w-4 -translate-y-1 rounded-full border-2 border-white ${getLandmarkMarkerColor(lm.category)} shadow-md`} />
                    </LandmarkMarker>
                ))}

                {/* RENDER TEMPORARY MARKER based on props from parent */}
                {isAddingInfoMode && temporaryMarkerLocation && (
                    <Marker longitude={temporaryMarkerLocation.lng} latitude={temporaryMarkerLocation.lat} anchor="bottom">
                        <div
                            className="flex flex-col items-center cursor-pointer p-2 bg-background rounded-md shadow-lg hover:bg-muted"
                            onClick={onTemporaryMarkerClick}
                        >
                            <MapPin className="h-8 w-8 text-primary animate-pulse" />
                            <span className="text-xs text-foreground mt-1">Add here?</span>
                        </div>
                    </Marker>
                )}

                {route && <AnimatedRoute route={route} />}
                {selectedArea && (
                    <AreaPopup
                        area={selectedArea.area}
                        coordinates={selectedArea.coordinates}
                        onClose={() => setSelectedArea(null)}
                    />
                )}
            </Map>

            <MapOverlay
                status={status}
                onAddInfoClick={onAddInfoButtonClickCallback}
                isAddInfoModeActive={isAddingInfoMode}
            />

            <div className="absolute bottom-24 right-4 z-20 flex flex-col gap-2 pointer-events-auto">
                {(["Online", "Transmitting", "Crisis", "Offline"] as SystemStatus[]).map((s) => (
                    <Button key={s} onClick={() => setStatus(s)} size="sm" variant="secondary">
                        Set: {s}
                    </Button>
                ))}
            </div>
        </main>
    );
}