"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

import type { SystemStatus } from "@/types/status";
import type { LineString } from "geojson";

interface DebugContextType {
  status: SystemStatus;
  setStatus: (s: SystemStatus) => void;
  route: LineString | null;
  setRoute: React.Dispatch<React.SetStateAction<LineString | null>>;
}

const DebugContext = createContext<DebugContextType | undefined>(undefined);

export function DebugProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<SystemStatus>("Online");
  const [route, setRoute] = useState<LineString | null>(null);


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
