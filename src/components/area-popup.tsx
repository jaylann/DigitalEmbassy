"use client";

import * as React from "react";
import { Popup } from "react-map-gl/maplibre";
import { Badge } from "@/components/ui/badge";
import type { Area, AreaCategory } from "@/types/areas";

const CATEGORY_LABELS: Record<AreaCategory, string> = {
    no_go: "No-Go Zone",
    caution: "Caution Area",
    safe: "Safe Area",
};

interface AreaPopupProps {
    area: Area;
    /** Coordinates where the popup should appear */
    coordinates: { lng: number; lat: number };
    /** Called when the popup is closed */
    onClose: () => void;
}

export function AreaPopup({ area, coordinates, onClose }: AreaPopupProps): React.ReactElement {
    const label = CATEGORY_LABELS[area.category];
    return (
        <Popup
            longitude={coordinates.lng}
            latitude={coordinates.lat}
            closeButton={false}
            closeOnClick={false}
            onClose={onClose}
            offset={15}
            anchor="bottom"
        >
            <div className="w-72 rounded-md border border-neutral-700 bg-black/75 p-4 text-white shadow-xl backdrop-blur-lg">
                <h3 className="text-base font-bold leading-tight">{area.name}</h3>
                <Badge variant="outline" className="mt-1.5 bg-black/30 text-white">
                    {label}
                </Badge>
                {area.description && (
                    <p className="mt-3 text-sm leading-snug text-neutral-300">
                        {area.description}
                    </p>
                )}
            </div>
        </Popup>
    );
}
