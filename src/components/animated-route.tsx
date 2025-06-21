"use client";

import React from "react";
import { Source, Layer } from "react-map-gl/maplibre";
import type { LineString } from "geojson";
import { MapMarker } from "@/components/map-marker";

export interface AnimatedRouteProps {
    /** GeoJSON LineString for the route */
    route: LineString;
    /** Animation duration in milliseconds */
    duration?: number;
}

export function AnimatedRoute({ route, duration = 10000 }: AnimatedRouteProps): React.ReactElement {
    const coordinates = route.coordinates;
    const [position, setPosition] = React.useState(coordinates[0]);

    React.useEffect(() => {
        if (coordinates.length < 2) return;
        let frame: number;
        const start = performance.now();

        const step = () => {
            const now = performance.now();
            const progress = Math.min((now - start) / duration, 1);
            const distance = progress * (coordinates.length - 1);
            const idx = Math.floor(distance);
            const t = distance - idx;
            const [lng1, lat1] = coordinates[idx];
            const [lng2, lat2] = coordinates[Math.min(idx + 1, coordinates.length - 1)];
            const lng = lng1 + (lng2 - lng1) * t;
            const lat = lat1 + (lat2 - lat1) * t;
            setPosition([lng, lat]);
            if (progress < 1) {
                frame = requestAnimationFrame(step);
            }
        };

        frame = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frame);
    }, [coordinates, duration]);

    return (
        <>
            <Source
                id="animated-route"
                type="geojson"
                data={{ type: "Feature", geometry: route, properties: {} }}
            >
                <Layer id="animated-route-line" type="line" paint={{ "line-width": 5, "line-color": "#2563EB" }} />
            </Source>
            <MapMarker longitude={position[0]} latitude={position[1]}>
                <div className="h-3 w-3 -translate-y-1 rounded-full border-2 border-white bg-red-600 shadow" />
            </MapMarker>
        </>
    );
}
