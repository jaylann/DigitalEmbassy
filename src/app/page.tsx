// src/app/page.tsx

"use client";

import * as React from "react";
import Map, { Source, Layer } from "react-map-gl/maplibre";
import { motion, AnimatePresence } from "framer-motion";
import type { FeatureCollection } from "geojson";
import "maplibre-gl/dist/maplibre-gl.css";

import { Button } from "@/components/ui/button";
import {SystemStatus} from "@/types/status";
import {CrisisWarningOverlay} from "@/components/crising-warning-oerlay";
import {MapOverlay} from "@/components/map-overlay";

// Retrieve MapTiler key from environment variables
const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY_LOCAL;
if (!MAPTILER_KEY) {
    throw new Error("Missing NEXT_PUBLIC_MAPTILER_KEY environment variable.");
}

// Example restriction zone (Berlin LEZ rectangle)
const restrictionZone: FeatureCollection = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            properties: { name: "No‑Go" },
            geometry: {
                type: "Polygon",
                coordinates: [
                    [
                        [13.376, 52.513], [13.454, 52.513],
                        [13.454, 52.55], [13.376, 52.55],
                        [13.376, 52.513]
                    ]
                ]
            }
        }
    ]
};

/**
 * The main page component, featuring a full-screen map and a sleek UI overlay.
 * It manages the application's system status and applies conditional effects.
 *
 * @returns {React.ReactElement} The rendered home page.
 */
export default function Home(): React.ReactElement {
    const [status, setStatus] = React.useState<SystemStatus>("Online");

    const [isCrisisAcknowledged, setIsCrisisAcknowledged] = React.useState(false);

    React.useEffect(() => {
      if (status !== 'Crisis') {
        setIsCrisisAcknowledged(false);
      }
    }, [status]);

    return (
        <main className="relative h-screen w-screen overflow-hidden bg-black">
            <AnimatePresence>
              {status === 'Crisis' && !isCrisisAcknowledged && (
                <CrisisWarningOverlay onAcknowledge={() => setIsCrisisAcknowledged(true)} />
              )}
            </AnimatePresence>
            {/*
        This div is a dedicated layer for the glow effect.
        - `absolute inset-0`: Covers the entire parent.
        - `z-10`: Sits above the map (default z-index 0).
        - `pointer-events-none`: Allows clicks to pass through to the map below.
        - `MapOverlay` has a `z-index` of 10, so this glow will be layered correctly.
      */}
            <motion.div
                className="pointer-events-none absolute inset-0 z-10"
                animate={{
                    boxShadow:
                        status === "Transmitting"
                            ? "inset 0px 0px 20px 5px rgba(59, 130, 246, 0.6)" // blue-500
                            : "inset 0px 0px 0px 0px rgba(59, 130, 246, 0)",
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
            />

            <Map
                initialViewState={{ longitude: 13.405, latitude: 52.53, zoom: 12 }}
                mapStyle={`https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`}
                style={{ position: "absolute", inset: 0, width: '100%', height: '100%' }}
            >
                <Source id="zone-source" type="geojson" data={restrictionZone}>
                    <Layer
                        id="zone-fill"
                        type="fill"
                        paint={{ "fill-color": "#DC2626", "fill-opacity": 0.25 }}
                    />
                    <Layer
                        id="zone-outline"
                        type="line"
                        paint={{ "line-color": "#DC2626", "line-width": 2 }}
                    />
                </Source>
            </Map>

            {/* The UI Overlay sits on top of the map and the glow effect layer */}
            <MapOverlay status={status} />

            {/* DEV CONTROLS: For demonstrating status changes. Remove in production. */}
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