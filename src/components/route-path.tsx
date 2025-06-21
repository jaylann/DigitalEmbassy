// src/components/route-path.tsx
"use client";

import * as React from "react";
import { Source, Layer } from "react-map-gl/maplibre";
import type { LineString } from "geojson";

export interface RoutePathProps {
    /** Unique id to scope the layer ids */
    id: string;
    /** GeoJSON path for the route */
    path: LineString;
    /** Optional styling */
    color?: string;
    width?: number;
}

export function RoutePath({
    id,
    path,
    color = "#2563EB",
    width = 4,
}: RoutePathProps): React.ReactElement {
    return (
        <Source id={`route-${id}`} type="geojson" data={path}>
            <Layer
                id={`route-line-${id}`}
                type="line"
                paint={{ "line-color": color, "line-width": width }}
            />
        </Source>
    );
}
