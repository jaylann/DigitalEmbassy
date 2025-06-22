/**
 * Map popup displayed when selecting an area.
 */

"use client";

import * as React from "react";
import { Popup } from "react-map-gl/maplibre";
import { motion } from "framer-motion";
import { ShieldX, AlertTriangle, ShieldCheck, LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Area, AreaCategory } from "@/types/areas";

/**
 * Configuration for styling and metadata of each area category.
 * This centralized approach ensures consistency and simplifies future updates.
 */
export const areaConfig: Record<
    AreaCategory,
    {
        label: string;
        icon: LucideIcon;
        styles: {
            bg: string;
            border: string;
            iconContainerBg: string;
            badge: string;
        };
    }
> = {
    no_go: {
        label: "No-Go Zone",
        icon: ShieldX,
        styles: {
            bg: "bg-red-950/60",
            border: "border-red-600/50",
            iconContainerBg: "bg-red-500/20",
            badge: "bg-red-500/20 text-red-300 border-red-400/30",
        },
    },
    caution: {
        label: "Caution Area",
        icon: AlertTriangle,
        styles: {
            bg: "bg-yellow-950/60",
            border: "border-yellow-600/50",
            iconContainerBg: "bg-yellow-500/20",
            badge: "bg-yellow-500/20 text-yellow-300 border-yellow-400/30",
        },
    },
    safe: {
        label: "Safe Area",
        icon: ShieldCheck,
        styles: {
            bg: "bg-green-950/60",
            border: "border-green-600/50",
            iconContainerBg: "bg-green-500/20",
            badge: "bg-green-500/20 text-green-300 border-green-400/30",
        },
    },
};

/**
 * Props for the AreaPopup component.
 * @interface AreaPopupProps
 * @property {Area} area - The area data to display in the popup.
 * @property {{ lng: number; lat: number }} coordinates - The geographical coordinates where the popup should appear.
 * @property {() => void} onClose - Callback function invoked when the popup is requested to be closed.
 */
interface AreaPopupProps {
    area: Area;
    coordinates: { lng: number; lat: number };
    onClose: () => void;
}

/**
 * A visually rich and informative popup for displaying details about a map area.
 * The popup's appearance is dynamically themed based on the area's category
 * (e.g., 'no_go', 'caution'), providing immediate context to the user.
 *
 * @param {AreaPopupProps} props - The component props.
 * @returns {React.ReactElement} The rendered popup component.
 */
export function AreaPopup({ area, coordinates, onClose }: AreaPopupProps): React.ReactElement {
    const config = areaConfig[area.category];
    const Icon = config.icon;

    return (
        <Popup
            longitude={coordinates.lng}
            latitude={coordinates.lat}
            onClose={onClose}
            closeButton={false}
            closeOnClick={false} // We handle closing via state in the parent map component
            offset={15}
            anchor="bottom"
            maxWidth="320px"
            className="transparent-popup bg-transparent"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className={cn(
                    "flex flex-col gap-3 rounded-lg border p-4 text-white shadow-xl backdrop-blur-md",
                    config.styles.bg,
                    config.styles.border
                )}
            >
                {/* Header Section */}
                <div className="flex items-start gap-3">
                    <div
                        className={cn(
                            "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md",
                            config.styles.iconContainerBg
                        )}
                    >
                        <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-grow">
                        <h3 className="text-base font-bold leading-tight text-white">{area.name}</h3>
                        <Badge variant="outline" className={cn("mt-1.5", config.styles.badge)}>
                            {config.label}
                        </Badge>
                    </div>
                </div>

                {/* Description Section */}
                {area.description && (
                    <>
                        <hr className="border-t border-white/10" />
                        <p className="text-sm leading-snug text-neutral-300">{area.description}</p>
                    </>
                )}
            </motion.div>
        </Popup>
    );
}