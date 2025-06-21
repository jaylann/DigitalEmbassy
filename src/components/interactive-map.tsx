"use client";

import * as React from "react";
import Map, { Source, Layer } from "react-map-gl/maplibre";
import type { LineString } from "geojson";
import { motion, AnimatePresence } from "framer-motion";
import "maplibre-gl/dist/maplibre-gl.css";

import { Button } from "@/components/ui/button";
import { MapOverlay } from "@/components/map-overlay";
import { CrisisWarningOverlay } from "@/components/crising-warning-oerlay";
import { LandmarkMarker } from "@/components/landmark-marker";
import { AnimatedRoute } from "@/components/animated-route";
import { SystemStatus } from "@/types/status";
import type { Landmark } from "@/types/landmarks";
import type { Area, AreaCategory } from "@/types/areas";

const CATEGORY_COLORS: Record<AreaCategory, { fill: string; border: string }> = {
    no_go: { fill: "#DC2626", border: "#b91c1c" },
    caution: { fill: "#FACC15", border: "#CA8A04" },
    safe: { fill: "#16A34A", border: "#15803D" },
};

interface InteractiveMapProps {
    landmarks?: Landmark[];
    areas?: Area[];
    /** Optional route to display and animate */
    route?: LineString;
}

export function InteractiveMap({ landmarks = [], areas = [], route }: InteractiveMapProps): React.ReactElement {
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
                initialViewState={{ longitude: 51.3347, latitude: 35.7219, zoom: 12 }}
                mapStyle={`https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
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
                    <LandmarkMarker key={lm.id} landmark={lm} />
                ))}

                {route && <AnimatedRoute route={route} />}
            </Map>

            <MapOverlay status={status} />

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
