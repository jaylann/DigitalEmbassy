// src/components/interactive-map.tsx
"use client";

import * as React from "react";
import Map, { Source, Layer, MapRef, MapLayerMouseEvent } from "react-map-gl/maplibre"; // Removed Marker, MapPin from here
import type { LineString } from "geojson";
import { motion, AnimatePresence } from "framer-motion";
import "maplibre-gl/dist/maplibre-gl.css";

import { Button } from "@/components/ui/button";
import { MapOverlay } from "@/components/map-overlay";
import { CrisisWarningOverlay } from "@/components/crising-warning-oerlay"; // Check typo
import { LandmarkMarker } from "@/components/landmark-marker";
import { AnimatedRoute } from "@/components/animated-route";
import { RoutePath } from "@/components/route-path"; // Assuming this is used for routes prop
import { useLocation as useAppLocationHook } from "@/lib/state/location"; // Aliased
import { AreaPopup } from "@/components/area-popup";
import { RoutePopup } from "@/components/route-popup"; // Assuming this is used for routes prop
import { SystemStatus } from "@/types/status";
import type { Area, AreaCategory } from "@/types/areas";
import { Landmark, LandmarkCategory as LMCategory } from "@/lib/types"; // Use LMCategory if LandmarkCategory is from areas.ts
import type { Route } from "@/types/routes";


const CATEGORY_COLORS: Record<AreaCategory, { fill: string; border: string }> = {
    no_go: { fill: "#DC2626", border: "#b91c1c" },
    caution: { fill: "#FACC15", border: "#CA8A04" },
    safe: { fill: "#16A34A", border: "#15803D" },
};

interface InteractiveMapProps {
    landmarks?: Landmark[];
    areas?: Area[];
    routes?: Route[]; // From your original
    route?: LineString; // From your original

    // Props to pass to MapOverlay for AddInfoButton
    onAddInfoButtonClickCallback: () => void;
    isButtonActiveForAddInfo: boolean; // For AddInfoButton's visual state
}

export function InteractiveMap({
                                   landmarks = [],
                                   areas = [],
                                   routes = [],
                                   route,
                                   onAddInfoButtonClickCallback,
                                   isButtonActiveForAddInfo
                               }: InteractiveMapProps): React.ReactElement {
    const mapRef = React.useRef<MapRef>(null); // Keep local ref for map instance if needed internally

    const [status, setStatus] = React.useState<SystemStatus>("Online");
    const [isCrisisAcknowledged, setIsCrisisAcknowledged] = React.useState(false);

    const { lastKnownLocation } = useAppLocationHook();
    const [selectedArea, setSelectedArea] = React.useState<{ area: Area; coordinates: { lng: number; lat: number }; } | null>(null);
    const [selectedRoute, setSelectedRoute] = React.useState<{ route: Route; coordinates: { lng: number; lat: number }; } | null>(null);


    React.useEffect(() => {
        if (status !== "Crisis") setIsCrisisAcknowledged(false);
    }, [status]);

    const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY_LOCAL;
    if (!MAPTILER_KEY) throw new Error("Missing NEXT_PUBLIC_MAPTILER_KEY environment variable.");

    const interactiveLayers = React.useMemo(
        () => [
            ...areas.flatMap((a) => [`area-fill-${a.id}`, `area-outline-${a.id}`]),
            ...routes.map((r) => `route-line-${r.id}`),
        ],
        [areas, routes]
    );

    // This click handler is now only for Area and Route popups
    const handleMapClick = React.useCallback(
        (e: MapLayerMouseEvent) => {
            // Area popup logic (from your original)
            if (e.features && e.features.length > 0) {
                const layerId = e.features[0].layer.id;
                const areaMatch = layerId.match(/^area-(?:fill|outline)-(.*)$/);
                if (areaMatch) {
                    const id = areaMatch[1];
                    const area = areas.find((a) => a.id === id);
                    if (area) { setSelectedArea({ area, coordinates: e.lngLat }); setSelectedRoute(null); return; }
                }

                const routeMatch = layerId.match(/^route-line-(.*)$/);
                if (routeMatch) {
                    const id = routeMatch[1];
                    const routeObj = routes.find((r) => r.id === id);
                    if (routeObj) { setSelectedRoute({ route: routeObj, coordinates: e.lngLat }); setSelectedArea(null); return;}
                }
            }
            setSelectedArea(null);
            setSelectedRoute(null);
        },
        [areas, routes] // Removed isAddingInfoMode and onMapClickToAddPoint
    );

    // getLandmarkMarkerColor can be removed if LandmarkMarker handles its own styling internally
    // const getLandmarkMarkerColor = (category: LMCategory): string => { ... };


    return (
        <main className="relative h-screen w-screen overflow-hidden bg-black">
            <AnimatePresence>
                {status === "Crisis" && !isCrisisAcknowledged && (
                    <CrisisWarningOverlay onAcknowledge={() => setIsCrisisAcknowledged(true)} />
                )}
            </AnimatePresence>
            <motion.div
                className="pointer-events-none absolute inset-0 z-10"
                animate={{ boxShadow: status === "Transmitting" ? "inset 0px 0px 20px 5px rgba(59, 130, 246, 0.6)" : "inset 0px 0px 0px 0px rgba(59, 130, 246, 0)"}}
                transition={{ duration: 0.8, ease: "easeInOut" }}
            />
            <Map
                ref={mapRef} // Use local ref or one passed from parent if that prop is re-added
                initialViewState={{ longitude: lastKnownLocation.lng, latitude: lastKnownLocation.lat, zoom: 12 }}
                mapStyle={`https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
                onClick={handleMapClick} // Only for area/route popups now
                interactiveLayerIds={interactiveLayers} // Always active for these layers
                cursor={'grab'} // Default cursor, no more 'crosshair' logic here
            >
                {areas.map((area) => { /* ... area rendering as in your original ... */
                    const colors = CATEGORY_COLORS[area.category];
                    return (
                        <Source key={area.id} id={`area-${area.id}`} type="geojson" data={area.geometry}>
                            <Layer id={`area-fill-${area.id}`} type="fill" paint={{ "fill-color": area.fillColor ?? colors.fill, "fill-opacity": 0.25 }} />
                            <Layer id={`area-outline-${area.id}`} type="line" paint={{ "line-color": area.borderColor ?? colors.border, "line-width": 2 }} />
                        </Source>
                    );
                })}
                {landmarks.map((lm) => (
                    // LandmarkMarker is responsible for its appearance.
                    // If it needs category for styling, ensure its props allow it.
                    <LandmarkMarker key={lm.id} landmark={lm} />
                ))}
                {routes.map((r) => ( <RoutePath key={r.id} id={r.id} path={r.path} color={r.lineColor} width={r.lineWidth} /> ))}
                {route && <AnimatedRoute route={route} />}
                {selectedArea && <AreaPopup area={selectedArea.area} coordinates={selectedArea.coordinates} onClose={() => setSelectedArea(null)} />}
                {selectedRoute && <RoutePopup route={selectedRoute.route} coordinates={selectedRoute.coordinates} onClose={() => setSelectedRoute(null)} />}
            </Map>

            <MapOverlay
                status={status}
                onAddInfoClick={onAddInfoButtonClickCallback}
                isAddInfoModeActive={isButtonActiveForAddInfo}
            />
            <div className="absolute bottom-24 right-4 z-20 flex flex-col gap-2 pointer-events-auto">
                {(["Online", "Transmitting", "Crisis", "Offline"] as SystemStatus[]).map((s) => (
                    <Button key={s} onClick={() => setStatus(s)} size="sm" variant="secondary">Set: {s}</Button>
                ))}
            </div>
        </main>
    );
}