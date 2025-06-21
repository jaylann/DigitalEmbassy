"use client";

import React from "react";
import { MapMarker } from "@/components/map-marker";
import type { Landmark } from "@/types/landmarks";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";

export interface LandmarkMarkerProps {
    landmark: Landmark;
}

export function LandmarkMarker({ landmark }: LandmarkMarkerProps): React.ReactElement {
    const { location, name, description, category } = landmark;

    return (
        <MapMarker latitude={location.lat} longitude={location.lng}>
            <Popover>
                <PopoverTrigger asChild>
                    <div
                        className="h-4 w-4 -translate-y-1 rounded-full border-2 border-white bg-blue-600 shadow cursor-pointer"
                        title={name}
                        aria-label={name}
                    />
                </PopoverTrigger>
                <PopoverContent className="w-64 border-none bg-black/70 p-3 text-white shadow-lg backdrop-blur-md">
                    <h3 className="text-base font-semibold">{name}</h3>
                    {description && <p className="text-sm text-white/90">{description}</p>}
                    <p className="text-xs text-white/50">Category: {category}</p>
                </PopoverContent>
            </Popover>
        </MapMarker>
    );
}
