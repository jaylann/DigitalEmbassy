// src/components/landmark-marker.tsx

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import {
    ShieldCheck,
    HeartPulse,
    RadioTower,
    ShieldAlert,
    Siren,
    UserCheck,
    LucideIcon,
    CheckCircle2,
    Signal,
    Clock,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { MapMarker } from "@/components/map-marker";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import type { Landmark, LandmarkCategory } from "@/lib/types";

/**
 * Configuration object for styling and icons of each landmark category.
 * This centralized config makes it easy to add or modify categories in the future.
 *
 * @property {LucideIcon} icon - The icon component from lucide-react.
 * @property {string} label - The human-readable label for the category.
 * @property {object} styles - Tailwind CSS classes for consistent coloring.
 * @property {string} styles.bg - Background color class.
 * @property {string} styles.text - Text color class.
 * @property {string} styles.border - Border color class.
 * @property {string} styles.badge - Class for the badge component.
 */
const landmarkConfig: Record<
    LandmarkCategory,
    {
        icon: LucideIcon;
        label: string;
        styles: { bg: string; text: string; border: string; badge: string };
    }
> = {
    safe_space: {
        icon: ShieldCheck,
        label: "Safe Space",
        styles: {
            bg: "bg-green-600",
            text: "text-green-100",
            border: "border-green-400",
            badge: "bg-green-500/20 text-green-300 border-green-400/30",
        },
    },
    dangerous_spot: {
        icon: Siren,
        label: "Dangerous Spot",
        styles: {
            bg: "bg-red-600",
            text: "text-red-100",
            border: "border-red-400",
            badge: "bg-red-500/20 text-red-300 border-red-400/30",
        },
    },
    medical: {
        icon: HeartPulse,
        label: "Medical Facility",
        styles: {
            bg: "bg-blue-600",
            text: "text-blue-100",
            border: "border-blue-400",
            badge: "bg-blue-500/20 text-blue-300 border-blue-400/30",
        },
    },
    checkpoint: {
        icon: ShieldAlert,
        label: "Checkpoint",
        styles: {
            bg: "bg-yellow-600",
            text: "text-yellow-100",
            border: "border-yellow-400",
            badge: "bg-yellow-500/20 text-yellow-300 border-yellow-400/30",
        },
    },
    communication: {
        icon: RadioTower,
        label: "Communication",
        styles: {
            bg: "bg-indigo-600",
            text: "text-indigo-100",
            border: "border-indigo-400",
            badge: "bg-indigo-500/20 text-indigo-300 border-indigo-400/30",
        },
    },
    trusted_contact: {
        icon: UserCheck,
        label: "Trusted Contact",
        styles: {
            bg: "bg-cyan-600",
            text: "text-cyan-100",
            border: "border-cyan-400",
            badge: "bg-cyan-500/20 text-cyan-300 border-cyan-400/30",
        },
    },
};

/**
 * Props for the LandmarkMarker component.
 * @interface LandmarkMarkerProps
 * @property {Landmark} landmark - The landmark data object to display.
 */
export interface LandmarkMarkerProps {
    landmark: Landmark;
}

/**
 * Displays a Landmark on the map with a category-specific icon and a detailed popover.
 * The marker icon provides at-a-glance information through color and iconography,
 * while the popover offers detailed information upon interaction.
 *
 * @param {LandmarkMarkerProps} props - The component props.
 * @returns {React.ReactElement | null} The rendered landmark marker or null if visibility is false.
 */
export function LandmarkMarker({ landmark }: LandmarkMarkerProps): React.ReactElement | null {
    const { location, name, description, category, isVerified, trustLevel, lastUpdated } = landmark;

    // Do not render the marker if it's explicitly set to be invisible.
    if (landmark.visible === false) {
        return null;
    }

    const config = landmarkConfig[category];
    const Icon = config.icon;

    /**
     * Formats an ISO date string into a human-readable relative time.
     * @param {string} isoDate - The ISO date string to format.
     * @returns {string} The formatted relative time string.
     */
    const formatLastUpdated = (isoDate: string): string => {
        try {
            return formatDistanceToNow(new Date(isoDate), { addSuffix: true });
        } catch (error) {
            console.error(
                "Invalid date format for lastUpdated:",
                isoDate,
                error
            );
            return "unknown";
        }
    };

    return (
        <Popover>
            <MapMarker latitude={location.lat} longitude={location.lng}>
                <PopoverTrigger asChild>
                    <motion.button
                        className="flex items-center justify-center cursor-pointer appearance-none bg-transparent border-none p-0"
                        whileHover={{ scale: 1.2, y: -2 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        aria-label={`Show details for ${name}`}
                    >
                        <div
                            className={cn(
                                "flex h-8 w-8 items-center justify-center rounded-full border-2 border-white/80 shadow-lg",
                                config.styles.bg
                            )}
                            title={name}
                        >
                            <Icon className="h-4 w-4 text-white" />
                        </div>
                    </motion.button>
                </PopoverTrigger>
            </MapMarker>

            <PopoverContent
                className="w-72 border-neutral-700 bg-black/75 p-4 text-white shadow-xl backdrop-blur-lg"
                sideOffset={12}
            >
                <div className="flex flex-col gap-3">
                    {/* Header */}
                    <div className="flex items-start gap-3">
                        <div className={cn("mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md", config.styles.bg)}>
                            <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-grow">
                            <h3 className="text-base font-bold leading-tight text-white">{name}</h3>
                            <Badge variant="outline" className={cn("mt-1.5", config.styles.badge)}>
                                {config.label}
                            </Badge>
                        </div>
                    </div>

                    {/* Description */}
                    {description && <p className="text-sm leading-snug text-neutral-300">{description}</p>}

                    <hr className="border-t border-neutral-700" />

                    {/* Metadata */}
                    <div className="space-y-2 text-xs text-neutral-400">
                        {isVerified && (
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-400" />
                                <span className="font-medium text-neutral-200">Verified by Trusted Source</span>
                            </div>
                        )}
                        {trustLevel && (
                            <div className="flex items-center gap-2">
                                <Signal className="h-4 w-4" />
                                <span>Trust Level: <span className="font-semibold capitalize text-neutral-200">{trustLevel}</span></span>
                            </div>
                        )}
                        {lastUpdated && (
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>Last Updated: <span className="font-semibold text-neutral-200">{formatLastUpdated(lastUpdated)}</span></span>
                            </div>
                        )}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}