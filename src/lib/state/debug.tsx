"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { SystemStatus } from "@/types/status";
import type { LineString } from "geojson";
import animatedRouteA from "../../../data/animated_route.json";

interface DebugContextType {
  status: SystemStatus;
  setStatus: (s: SystemStatus) => void;
  route: LineString | null;
  setRoute: (r: LineString | null) => void;
}

const DebugContext = createContext<DebugContextType | undefined>(undefined);

export function DebugProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<SystemStatus>("Online");
  const [route, setRoute] = useState<LineString | null>(animatedRouteA as LineString);

  useEffect(() => {
    try {
      const storedStatus = localStorage.getItem("systemStatus");
      if (storedStatus) setStatus(storedStatus as SystemStatus);
    } catch {}
  }, []);

  useEffect(() => {
    if (status) localStorage.setItem("systemStatus", status);
  }, [status]);

  useEffect(() => {
    try {
      const storedRoute = localStorage.getItem("animatedRoute");
      if (storedRoute) setRoute(JSON.parse(storedRoute));
    } catch {}
  }, []);

  useEffect(() => {
    if (route) localStorage.setItem("animatedRoute", JSON.stringify(route));
  }, [route]);

  return (
    <DebugContext.Provider value={{ status, setStatus, route, setRoute }}>
      {children}
    </DebugContext.Provider>
  );
}

export function useDebug() {
  const ctx = useContext(DebugContext);
  if (!ctx) {
    throw new Error("useDebug must be used within DebugProvider");
  }
  return ctx;
}
