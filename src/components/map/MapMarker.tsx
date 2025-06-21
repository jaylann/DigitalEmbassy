"use client";

import * as React from "react";
import { Marker } from "react-map-gl/maplibre";

/**
 * @interface MapMarkerProps
 * @property {number} latitude - The marker's latitude.
 * @property {number} longitude - The marker's longitude.
 * @property {() => void} [onClick] - Optional click handler for the marker.
 * @property {React.ReactNode} [children] - Optional custom marker content.
 */
interface MapMarkerProps {
    latitude: number;
    longitude: number;
    onClick?: () => void;
    children?: React.ReactNode;
}

/**
 * A simple map marker component using MapLibre's `Marker`.
 * It renders at the provided coordinates and forwards click events.
 *
 * @param {MapMarkerProps} props - The component props.
 * @returns {React.ReactElement} The rendered map marker.
 */
export function MapMarker({
    latitude,
    longitude,
    onClick,
    children,
}: MapMarkerProps): React.ReactElement {
    return (
        <Marker longitude={longitude} latitude={latitude} anchor="bottom">
            <div
                onClick={onClick}
                className="pointer-events-auto cursor-pointer"
            >
                {children ?? (
                    <div className="h-4 w-4 -translate-y-1 rounded-full border-2 border-white bg-blue-600 shadow" />
                )}
            </div>
        </Marker>
    );
}
