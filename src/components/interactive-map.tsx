"use client";

import * as React from "react";
import Map, { Source, Layer } from "react-map-gl/maplibre";
import type maplibregl from "maplibre-gl";
import type { LineString, Feature, FeatureCollection } from "geojson";
import circle from "@turf/circle";
import { motion, AnimatePresence } from "framer-motion";
import "maplibre-gl/dist/maplibre-gl.css";

import { Button } from "@/components/ui/button";
import { MapOverlay } from "@/components/map-overlay";
import { CrisisWarningOverlay } from "@/components/crising-warning-oerlay";
import { LandmarkMarker } from "@/components/landmark-marker";
import { AnimatedRoute } from "@/components/animated-route";
import { RoutePath } from "@/components/route-path";
import { useLocation } from "@/lib/state/location";
import { AreaPopup } from "@/components/area-popup";
import { RoutePopup } from "@/components/route-popup";
import { SystemStatus } from "@/types/status";
import type { Area, AreaCategory } from "@/types/areas";
const CATEGORY_COLORS: Record<AreaCategory, { fill: string; border: string }> = {
    no_go: { fill: "#DC2626", border: "#b91c1c" },
    caution: { fill: "#FACC15", border: "#CA8A04" },
    safe: { fill: "#16A34A", border: "#15803D" },
};

import {Landmark} from "@/lib/types";
const LANDMARK_AREA_MAP: Record<Landmark["category"], AreaCategory> = {
    safe_space: "safe",
    dangerous_spot: "no_go",
    communication: "safe",
    trusted_contact: "safe",
    medical: "safe",
    checkpoint: "caution",
};


import type { Route } from "@/types/routes";


interface InteractiveMapProps {
    landmarks?: Landmark[];
    areas?: Area[];
    /** Array of full routes to display */
    routes?: Route[];
    /** Optional route to display and animate */
    route?: LineString;
    onAddLandmark?: (lm: Landmark) => void;
}

export function InteractiveMap({ landmarks = [], areas = [], routes = [], route, onAddLandmark }: InteractiveMapProps): React.ReactElement {
    const [status, setStatus] = React.useState<SystemStatus>("Online");
    const [isCrisisAcknowledged, setIsCrisisAcknowledged] = React.useState(false);

    const { lastKnownLocation } = useLocation();
    const [, setViewState] = React.useState({
        longitude: lastKnownLocation.lng,
        latitude: lastKnownLocation.lat,
        zoom: 12,
    });

    React.useEffect(() => {
        setViewState((vs) => ({ ...vs, longitude: lastKnownLocation.lng, latitude: lastKnownLocation.lat }));
    }, [lastKnownLocation]);
    const [selectedArea, setSelectedArea] = React.useState<{
        area: Area;
        coordinates: { lng: number; lat: number };
    } | null>(null);
    const [selectedRoute, setSelectedRoute] = React.useState<{
        route: Route;
        coordinates: { lng: number; lat: number };
    } | null>(null);

    React.useEffect(() => {
        if (status !== "Crisis") {
            setIsCrisisAcknowledged(false);
        }
    }, [status]);

    const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY_LOCAL;
    if (!MAPTILER_KEY) {
        throw new Error("Missing NEXT_PUBLIC_MAPTILER_KEY environment variable.");
    }

    const landmarkAreas = React.useMemo(() => {
        return landmarks
            .filter((lm) => typeof lm.radius === "number")
            .map((lm) => ({
                id: `lm-${lm.id}`,
                name: lm.name,
                geometry: circle(
                    [lm.location.lng, lm.location.lat],
                    (lm.radius ?? 0) / 1000,
                    { steps: 64, units: "kilometers" }
                ),
                category: LANDMARK_AREA_MAP[lm.category],
            })) as Area[];
    }, [landmarks]);

    const allAreas = React.useMemo(() => [...areas, ...landmarkAreas], [areas, landmarkAreas]);

    const interactiveLayers = React.useMemo(
        () => [
            ...allAreas.flatMap((a) => [`area-fill-${a.id}`, `area-outline-${a.id}`]),
            ...routes.map((r) => `route-line-${r.id}`),
        ],
        [allAreas, routes]

    );

    // Filter out any duplicate landmarks by ID to avoid React key conflicts
    const uniqueLandmarks = React.useMemo(() => {
        const seen = new Set<string>();
        return landmarks.filter((lm) => {
            if (seen.has(lm.id)) return false;
            seen.add(lm.id);
            return true;
        });
    }, [landmarks]);

    const handleMapClick = React.useCallback(
        (e: maplibregl.MapLayerMouseEvent) => {
            if (!e.features || e.features.length === 0) {
                setSelectedArea(null);
                setSelectedRoute(null);
                return;
            }
            const layerId = e.features[0].layer.id;
            const areaMatch = layerId.match(/^area-(?:fill|outline)-(.*)$/);
            if (areaMatch) {
                const id = areaMatch[1];
                const area = allAreas.find((a) => a.id === id);
                if (area) {
                    setSelectedArea({ area, coordinates: e.lngLat });
                    setSelectedRoute(null);
                    return;
                }
            }

            const routeMatch = layerId.match(/^route-line-(.*)$/);
            if (routeMatch) {
                const id = routeMatch[1];
                const routeObj = routes.find((r) => r.id === id);
                if (routeObj) {
                    setSelectedRoute({ route: routeObj, coordinates: e.lngLat });
                    setSelectedArea(null);
                    return;
                }
            }

            setSelectedArea(null);
            setSelectedRoute(null);
        },
        [allAreas, routes]
    );

    return (
        <main className="relative h-screen w-screen overflow-hidden bg-black">
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
                initialViewState={{ longitude: lastKnownLocation.lng, latitude: lastKnownLocation.lat, zoom: 12 }}
                onMove={(e) => setViewState(e.viewState)}
                mapStyle={`https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
                onClick={handleMapClick}
                interactiveLayerIds={interactiveLayers}
            >
                {allAreas.map((area) => {
                    const colors = CATEGORY_COLORS[area.category];
                    return (
                        <Source key={area.id} id={`area-${area.id}`} type="geojson" data={area.geometry as Feature | FeatureCollection}>
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

                {uniqueLandmarks.map((lm) => (
                    <LandmarkMarker key={lm.id} landmark={lm} />
                ))}

                {routes.map((r) => (
                    <RoutePath
                        key={r.id}
                        id={r.id}
                        path={r.path}
                        color={r.lineColor}
                        width={r.lineWidth}
                    />
                ))}

                {route && <AnimatedRoute route={route} />}
                {selectedArea && (
                    <AreaPopup
                        area={selectedArea.area}
                        coordinates={selectedArea.coordinates}
                        onClose={() => setSelectedArea(null)}
                    />
                )}
                {selectedRoute && (
                    <RoutePopup
                        route={selectedRoute.route}
                        coordinates={selectedRoute.coordinates}
                        onClose={() => setSelectedRoute(null)}
                    />
                )}
            </Map>

            <MapOverlay status={status} landmarks={landmarks} areas={areas} onAddLandmark={onAddLandmark} />

            <div className="absolute bottom-24 right-4 z-20 flex flex-col gap-2">
                {(["Online", "Transmitting", "Crisis", "Offline"] as SystemStatus[]).map((s) => (
                    <Button key={s} onClick={() => setStatus(s)} size="sm" variant="secondary">
                        Set: {s}
                    </Button>
                ))}
            </div>
        </main>
    );
}
