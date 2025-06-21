"use client";
import * as React from "react";
import Map from "react-map-gl/maplibre";
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MapMarker } from "@/components/map-marker";
import { useLocation } from "@/lib/state/location";
import { cn } from "@/lib/utils";

interface SelectMapProps {
    onSave?: (loc: { lat: number; lng: number }) => void;
    zoom?: number;
    className?: string;
}

export function SelectMap({ onSave, zoom = 12, className }: SelectMapProps) {
    const { lastKnownLocation, setLastKnownLocation } = useLocation();
    const [selected, setSelected] = React.useState(lastKnownLocation);

    const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY_LOCAL;
    if (!MAPTILER_KEY) {
        throw new Error("Missing NEXT_PUBLIC_MAPTILER_KEY_LOCAL environment variable.");
    }

    const handleClick = (e: maplibregl.MapLayerMouseEvent) => {
        const { lngLat } = e;
        setSelected({ lat: lngLat.lat, lng: lngLat.lng });
    };

    const handleSave = () => {
        setLastKnownLocation(selected);
        onSave?.(selected);
    };

    return (
        <div className={cn("relative h-72 w-full", className)}>
            <Map
                initialViewState={{ longitude: lastKnownLocation.lng, latitude: lastKnownLocation.lat, zoom }}
                mapStyle={`https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`}
                style={{ width: "100%", height: "100%" }}
                onClick={handleClick}
            >
                <MapMarker latitude={selected.lat} longitude={selected.lng}>
                    <MapPin className="h-6 w-6 text-red-500" />
                </MapMarker>
            </Map>
            <div className="absolute bottom-3 right-3 z-10">
                <Button size="sm" onClick={handleSave}>Save</Button>
            </div>
        </div>
    );
}
