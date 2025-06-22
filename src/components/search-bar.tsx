/**
 * Location and area search bar component.
 */

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocation } from "@/lib/state/location";
import type { Landmark } from "@/lib/types";
import type { Area } from "@/types/areas";

/**
 * A round search bar component designed for the map overlay.
 *
 * @returns {React.ReactElement} The rendered search bar.
 */
interface SearchBarProps {
    landmarks: Landmark[];
    areas: Area[];
    active?: boolean;
    filter?: "all" | "landmarks" | "areas";
    onActiveChange?: (active: boolean) => void;
    onFilterChange?: (value: "all" | "landmarks" | "areas") => void;
}

interface SearchResult {
    id: string;
    name: string;
    location: { lat: number; lng: number };
    type: "landmark" | "area";
}

export function SearchBar({
    landmarks,
    areas,
    active = false,
    filter = "all",
    onActiveChange,
    onFilterChange,
}: SearchBarProps): React.ReactElement {
    const { setLastKnownLocation } = useLocation();
    const [query, setQuery] = React.useState("");

    const computeAreaCenter = React.useCallback((area: Area) => {
        const geom = area.geometry.type === "FeatureCollection" ? area.geometry.features[0].geometry : area.geometry.geometry;
        const coords =
            geom.type === "Polygon"
                ? geom.coordinates[0]
                : geom.type === "MultiPolygon"
                ? geom.coordinates[0][0]
                : [];
        let minLat = 90,
            maxLat = -90,
            minLng = 180,
            maxLng = -180;
        coords.forEach(([lng, lat]) => {
            minLat = Math.min(minLat, lat);
            maxLat = Math.max(maxLat, lat);
            minLng = Math.min(minLng, lng);
            maxLng = Math.max(maxLng, lng);
        });
        return { lat: (minLat + maxLat) / 2, lng: (minLng + maxLng) / 2 };
    }, []);

    const results = React.useMemo(() => {
        if (!query) return [] as SearchResult[];
        const q = query.toLowerCase();
        const res: SearchResult[] = [];
        if (filter !== "areas") {
            res.push(
                ...landmarks
                    .filter((l) => l.name.toLowerCase().includes(q))
                    .map((l) => ({ id: l.id, name: l.name, location: l.location, type: "landmark" as const }))
            );
        }
        if (filter !== "landmarks") {
            res.push(
                ...areas
                    .filter((a) => a.name.toLowerCase().includes(q))
                    .map((a) => ({ id: a.id, name: a.name, location: computeAreaCenter(a), type: "area" as const }))
            );
        }
        return res;
    }, [query, filter, landmarks, areas, computeAreaCenter]);

    const handleSelect = (r: SearchResult) => {
        setLastKnownLocation(r.location);
        onActiveChange?.(false);
        setQuery("");
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut", delay: 0.2 }}
            className="pointer-events-auto relative w-full max-w-xs"
        >
            <Search
                className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
            />
            <Input
                type="search"
                placeholder="Search location..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => onActiveChange?.(true)}
                className="h-12 w-full rounded-full border-none bg-black/50 pl-11 pr-4 text-white shadow-lg backdrop-blur-sm placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
            />
            {active && (
                <div className="absolute left-0 right-0 top-full z-10 mt-2 flex flex-col gap-2">
                    <Select value={filter} onValueChange={(v: string) => onFilterChange?.(v as "all" | "landmarks" | "areas")}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="landmarks">Landmarks</SelectItem>
                            <SelectItem value="areas">Areas</SelectItem>
                        </SelectContent>
                    </Select>
                    {results.length > 0 && (
                        <ScrollArea className="max-h-40 rounded-md bg-black/80 text-white shadow-lg backdrop-blur-sm">
                            {results.map((r) => (
                                <button
                                    key={`${r.type}-${r.id}`}
                                    onClick={() => handleSelect(r)}
                                    className="block w-full px-3 py-2 text-left hover:bg-black/60"
                                >
                                    {r.name}
                                </button>
                            ))}
                        </ScrollArea>
                    )}
                </div>
            )}
        </motion.div>
    );
}