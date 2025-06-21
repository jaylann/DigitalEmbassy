/**
 * Popup showing details about a route.
 */
"use client";

import * as React from "react";
import { Popup } from "react-map-gl/maplibre";
import { motion } from "framer-motion";
import { Route as RouteIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";
import type { Route } from "@/types/routes";

interface RoutePopupProps {
    route: Route;
    coordinates: { lng: number; lat: number };
    onClose: () => void;
}

export function RoutePopup({ route, coordinates, onClose }: RoutePopupProps): React.ReactElement {
    const { name, description, addedBy, lastUpdated } = route;
    return (
        <Popup
            longitude={coordinates.lng}
            latitude={coordinates.lat}
            onClose={onClose}
            closeButton={false}
            closeOnClick={false}
            offset={15}
            anchor="bottom"
            maxWidth="320px"
            className="transparent-popup bg-transparent"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex flex-col gap-3 rounded-lg border border-blue-600/50 bg-blue-950/60 p-4 text-white shadow-xl backdrop-blur-md"
            >
                <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-blue-500/20">
                        <RouteIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-grow">
                        <h3 className="text-base font-bold leading-tight text-white">{name}</h3>
                        <Badge variant="outline" className="mt-1.5 bg-blue-500/20 text-blue-300 border-blue-400/30">
                            Route
                        </Badge>
                    </div>
                </div>

                {description && (
                    <>
                        <hr className="border-t border-white/10" />
                        <p className="text-sm leading-snug text-neutral-300">{description}</p>
                    </>
                )}

                {(addedBy || lastUpdated) && (
                    <div className="space-y-1 border-t border-white/10 pt-2 text-xs text-neutral-400">
                        {addedBy && <div>Added by: <span className="font-semibold text-neutral-200">{addedBy}</span></div>}
                        {lastUpdated && (
                            <div>
                                Updated <span className="font-semibold text-neutral-200">{formatRelativeTime(lastUpdated)}</span>
                            </div>
                        )}
                    </div>
                )}
            </motion.div>
        </Popup>
    );
}
