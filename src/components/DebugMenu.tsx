"use client";
import { useEffect, useCallback, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useDebug } from "@/lib/state/debug";
import { useLandmarks } from "@/lib/state/landmarks";
import animatedRouteA from "../../data/animated_route.json";
import animatedRouteB from "../../data/animated_route_alt.json";
import landmarkChange from "../../data/landmark_change.json";
import type { Landmark } from "@/lib/types";
import type { LineString } from "geojson";
import type { SystemStatus } from "@/types/status";

interface DebugAction {
  key: string;
  label: string;
  handler: () => void;
}

export default function DebugMenu() {
  const [open, setOpen] = useState(false);
  const { setStatus, setRoute } = useDebug();
  const { addLandmark } = useLandmarks();

  const toggle = useCallback(() => setOpen((o) => !o), []);

  const actions = useMemo<DebugAction[]>(
    () => [
      {
        key: "r",
        label: "Toggle Route (R)",
        handler: () =>
          setRoute((current) =>
            current && JSON.stringify(current) === JSON.stringify(animatedRouteA)
              ? (animatedRouteB as LineString)
              : (animatedRouteA as LineString)
          ),
      },
      {
        key: "q",
        label: "Start Route 1 (Q)",
        handler: () => setRoute(animatedRouteA as LineString),
      },
      {
        key: "w",
        label: "Start Landmark Change (W)",
        handler: () => {
          addLandmark(landmarkChange as Landmark);
          setRoute(animatedRouteB as LineString);
        },
      },
      ...(["Online", "Transmitting", "Crisis", "Offline"] as SystemStatus[]).map(
        (s, idx) => ({
          key: String(idx + 1),
          label: `Set Status: ${s}`,
          handler: () => setStatus(s),
        })
      ),
    ],
    [addLandmark, setRoute, setStatus]
  );

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "d" && e.shiftKey) {
        e.preventDefault();
        toggle();
        return;
      }
      actions.forEach((action) => {
        if (e.key === action.key) {
          e.preventDefault();
          action.handler();
        }
      });
    },
    [toggle, actions]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open ? (
        <div className="bg-popover text-popover-foreground border rounded shadow-lg p-4 space-y-2">
          {actions.map((action) => (
            <Button key={action.key} onClick={action.handler} className="w-full">
              {action.label} ({action.key})
            </Button>
          ))}
          <Button variant="secondary" onClick={toggle} className="w-full">
            Close (Shift+D)
          </Button>
        </div>
      ) : (
        <Button size="icon" onClick={toggle} aria-label="Open debug menu">
          D
        </Button>
      )}
    </div>
  );
}
