/**
 * Thin wrapper around map markers.
 */

"use client";

import * as React from "react";
import { Marker } from "react-map-gl/maplibre";

/**
 * Props for the MapMarker component.
 * @interface MapMarkerProps
 * @property {number} latitude - The geographical latitude for the marker's position.
 * @property {number} longitude - The geographical longitude for the marker's position.
 * @property {() => void} [onClick] - Optional click handler for the marker.
 * @property {React.ReactNode} children - The content to be rendered as the marker. This allows for fully custom marker designs.
 */
interface MapMarkerProps {
    latitude: number;
    longitude: number;
    onClick?: () => void;
    children: React.ReactNode;
}

/**
 * A generic, style-agnostic map marker component that wraps react-map-gl's Marker.
 * It handles positioning and provides a clickable area. The visual representation
 * is delegated to the `children` prop.
 *
 * @param {MapMarkerProps} props - The component props.
 * @returns {React.ReactElement} The rendered map marker component.
 */
export function MapMarker({
                              latitude,
                              longitude,
                              onClick,
                              children,
                          }: MapMarkerProps): React.ReactElement {
    return (
        <Marker longitude={longitude} latitude={latitude} anchor="center" onClick={onClick}>
            {/* The wrapper div ensures that DOM events like hover and click are properly handled. */}
            <div className="pointer-events-auto cursor-pointer">
                {children}
            </div>
        </Marker>
    );
}