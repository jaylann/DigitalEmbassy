"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import type { Location } from "@/lib/types";

const defaultLocation: Location = { lat: 35.751, lng: 51.438 };

interface LocationContextType {
    lastKnownLocation: Location;
    setLastKnownLocation: (loc: Location) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
    const [lastKnownLocation, setLastKnownLocation] = useState<Location>(defaultLocation);
    return (
        <LocationContext.Provider value={{ lastKnownLocation, setLastKnownLocation }}>
            {children}
        </LocationContext.Provider>
    );
}

export function useLocation() {
    const ctx = useContext(LocationContext);
    if (!ctx) {
        throw new Error("useLocation must be used within LocationProvider");
    }
    return ctx;
}
