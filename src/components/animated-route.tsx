/**
 * Animates a route being drawn on the map.
 */

"use client";

import * as React from "react";
import { Source, Layer, useMap } from "react-map-gl/maplibre";
import type { Feature, LineString } from "geojson";
import { motion } from "framer-motion";

import { MapMarker } from "@/components/map-marker";

/**
 * A GeoJSON feature representing an empty LineString.
 * Used as the initial state for the animated route.
 */
const EMPTY_ROUTE: Feature<LineString> = {
    type: "Feature",
    properties: {},
    geometry: {
        type: "LineString",
        coordinates: [],
    },
};

/**
 * Props for the AnimatedRoute component.
 * @interface AnimatedRouteProps
 * @property {LineString} route - The GeoJSON LineString object defining the route path.
 * @property {number} [duration=8000] - The total duration of the drawing animation in milliseconds.
 * @property {string} [lineColor="#3b82f6"] - The color of the main animated line. (Defaults to blue-500)
 * @property {string} [pulseColor="#60a5fa"] - The color of the pulsing head marker. (Defaults to blue-400)
 * @property {number} [lineWidth=4] - The width of the route line.
 */
export interface AnimatedRouteProps {
    route: LineString;
    duration?: number;
    lineColor?: string;
    pulseColor?: string;
    lineWidth?: number;
}

/**
 * Renders and animates a route on a map, giving the appearance of the line being drawn over time.
 * The line progressively reveals itself from the start point to the end point,
 * led by a pulsing marker that is always perfectly positioned at the tip of the line.
 *
 * @param {AnimatedRouteProps} props - The component props.
 * @returns {React.ReactElement | null} The rendered animated route layers and marker.
 */
export function AnimatedRoute({
                                  route,
                                  duration = 8000,
                                  lineColor = "#3b82f6",
                                  pulseColor = "#60a5fa",
                                  lineWidth = 4,
                              }: AnimatedRouteProps): React.ReactElement | null {
    const { current: map } = useMap();
    // This state holds the GeoJSON feature for the line that is being actively drawn.
    const [animatedRoute, setAnimatedRoute] = React.useState<Feature<LineString>>(EMPTY_ROUTE);
    const animationFrameRef = React.useRef<number | undefined>(undefined);

    React.useEffect(() => {
        // Reset and clear any existing animation when the route or map changes.
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        setAnimatedRoute(EMPTY_ROUTE);

        const { coordinates } = route;
        if (!map || !coordinates || coordinates.length < 2) {
            return;
        }

        const totalPoints = coordinates.length;
        const startTime = performance.now();

        const animate = () => {
            const now = performance.now();
            const elapsedTime = now - startTime;
            const progress = Math.min(elapsedTime / duration, 1);

            // Calculate the current position along the route as a floating-point index.
            const currentPointIndex = progress * (totalPoints - 1);
            const floorIndex = Math.floor(currentPointIndex);

            // Get all full segments of the path that have been traversed.
            const pathUntilNow = coordinates.slice(0, floorIndex + 1);

            // If we're not at the very end, calculate the interpolated point for the leading edge.
            if (progress < 1) {
                const ceilIndex = Math.min(floorIndex + 1, totalPoints - 1);
                const t = currentPointIndex - floorIndex; // Interpolation factor

                const [lng1, lat1] = coordinates[floorIndex];
                const [lng2, lat2] = coordinates[ceilIndex];

                const interpolatedLng = lng1 + (lng2 - lng1) * t;
                const interpolatedLat = lat1 + (lat2 - lat1) * t;

                // Add the smoothly interpolated point to the end of the path.
                pathUntilNow.push([interpolatedLng, interpolatedLat]);
            }

            const newRouteFeature: Feature<LineString> = {
                type: "Feature",
                properties: {},
                geometry: {
                    type: "LineString",
                    coordinates: pathUntilNow,
                },
            };

            // Update the source directly for performance. If source not ready, use state.
            const source = map.getSource("animated-route-source") as maplibregl.GeoJSONSource;
            if (source) {
                source.setData(newRouteFeature);
            } else {
                setAnimatedRoute(newRouteFeature);
            }

            if (progress < 1) {
                animationFrameRef.current = requestAnimationFrame(animate);
            }
        };

        // Start the animation loop.
        animationFrameRef.current = requestAnimationFrame(animate);

        // Cleanup function to cancel the animation on unmount or dependency change.
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [route, duration, map]);

    // Derive the marker's position directly from the end of the animated line.
    // This ensures perfect synchronization.
    const routeCoords = animatedRoute.geometry.coordinates;
    const headMarkerPosition = routeCoords.length > 0 ? routeCoords[routeCoords.length - 1] : null;

    return (
        <>
            {/* The dynamically drawn, animated route line */}
            <Source id="animated-route-source" type="geojson" data={animatedRoute}>
                <Layer
                    id="animated-route-line"
                    type="line"
                    paint={{ "line-color": lineColor, "line-width": lineWidth }}
                    layout={{ "line-join": "round", "line-cap": "round" }}
                />
            </Source>

            {/* The pulsing marker, its position is now guaranteed to be at the tip of the line */}
            {headMarkerPosition && (
                <MapMarker longitude={headMarkerPosition[0]} latitude={headMarkerPosition[1]}>
                    <motion.div
                        className="relative h-4 w-4 rounded-full border-2 border-white/90 shadow-lg"
                        style={{ backgroundColor: lineColor }}
                        // A subtle entrance animation for the marker itself
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* The pulsing halo effect */}
                        <motion.div
                            className="absolute inset-0 rounded-full"
                            style={{ backgroundColor: pulseColor }}
                            animate={{ scale: [1, 2.5, 1], opacity: [0.7, 0, 0.7] }}
                            transition={{
                                duration: 1.5,
                                ease: "easeInOut",
                                repeat: Infinity,
                            }}
                        />
                    </motion.div>
                </MapMarker>
            )}
        </>
    );
}