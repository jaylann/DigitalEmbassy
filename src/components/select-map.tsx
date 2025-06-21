/**
 * @file A full-screen, animated map overlay for location selection.
 * @version 2.0.0
 */

"use client";

import * as React from "react";
import Map from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Location } from "@/lib/types"; // Assuming Location is { lat: number, lng: number }

/**
 * Type definition for the props accepted by the SelectMap component.
 * @interface SelectMapProps
 */
interface SelectMapProps {
    /** Determines whether the map overlay is visible. */
    isOpen: boolean;
    /** Callback function invoked when the user closes the overlay without saving. */
    onClose: () => void;
    /** Callback function invoked with the selected location when the user confirms their choice. */
    onSave: (location: Location) => void;
    /** The initial geographic coordinates to center the map on. */
    initialCenter: Location;
    /** The initial zoom level of the map. Defaults to 12. */
    zoom?: number;
}

/**
 * A full-screen modal component that displays an interactive map for location selection.
 * It overlays the current view, providing a focused interface for picking a location.
 * The selection is made based on the center of the map view when the user clicks "Select".
 *
 * @param {SelectMapProps} props - The props for the component.
 * @returns {React.ReactElement | null} The rendered component or null if not open.
 * @example
 * <SelectMap
 *   isOpen={isPickerOpen}
 *   onClose={() => setPickerOpen(false)}
 *   onSave={(location) => console.log(location)}
 *   initialCenter={{ lat: 51.5074, lng: -0.1278 }}
 * />
 */
export function SelectMap({
                              isOpen,
                              onClose,
                              onSave,
                              initialCenter,
                              zoom = 12,
                          }: SelectMapProps): React.ReactElement | null {
    const [currentCenter, setCurrentCenter] = React.useState<Location>(initialCenter);

    // Memoize the MapTiler key check to avoid re-running it on every render.
    const MAPTILER_KEY = React.useMemo(() => {
        const key = process.env.NEXT_PUBLIC_MAPTILER_KEY_LOCAL;
        if (!key) {
            // In a real production app, you might want to log this error to a monitoring service.
            console.error("Missing NEXT_PUBLIC_MAPTILER_KEY_LOCAL environment variable.");
            return null;
        }
        return key;
    }, []);

    /**
     * Handles the final save action. It passes the current center of the map
     * to the onSave callback.
     */
    const handleSave = (): void => {
        onSave(currentCenter);
    };

    /**
     * Updates the `currentCenter` state whenever the map view is moved by the user.
     * @param {object} viewState - The new view state from the map instance.
     * @param {number} viewState.longitude - The new longitude of the map center.
     * @param {number} viewState.latitude - The new latitude of the map center.
     */
    const handleMove = ({ viewState }: { viewState: { longitude: number; latitude: number } }): void => {
        setCurrentCenter({
            lat: viewState.latitude,
            lng: viewState.longitude,
        });
    };

    if (!MAPTILER_KEY) {
        // Render nothing or a fallback UI if the key is missing.
        // This prevents the app from crashing.
        return isOpen ? (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80">
                <p className="text-red-500">Map configuration error.</p>
            </div>
        ) : null;
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="fixed inset-0 z-[100] flex flex-col bg-black/80 backdrop-blur-sm"
                    aria-modal="true"
                    role="dialog"
                >
                    {/* Header with Close Button */}
                    <div className="flex items-center justify-end p-4 shrink-0">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="h-10 w-10 rounded-full bg-black/50 hover:bg-white/20 text-white"
                            aria-label="Close location picker"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Map Container */}
                    <div className="relative flex-1 w-full h-full">
                        <Map
                            initialViewState={{
                                longitude: initialCenter.lng,
                                latitude: initialCenter.lat,
                                zoom,
                            }}
                            mapStyle={`https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`}
                            style={{ width: "100%", height: "100%" }}
                            onMove={handleMove}
                        />
                        {/* Center Marker: Indicates the point of selection */}
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                            <MapPin className="h-8 w-8 text-red-500 drop-shadow-lg" style={{ transform: 'translateY(-50%)' }} />
                        </div>
                    </div>

                    {/* Footer with Action Button */}
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: "0%" }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 250 }}
                        className="flex justify-center p-4 pt-6 bg-gradient-to-t from-black via-black/90 to-transparent shrink-0"
                    >
                        <Button size="lg" onClick={handleSave} className="w-full max-w-xs font-bold text-lg">
                            Select Location
                        </Button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}