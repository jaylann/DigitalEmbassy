"use client";
import { useEffect, useCallback, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useDebug } from "@/lib/state/debug";
import { useLandmarks } from "@/lib/state/landmarks";
import { useLocation } from "@/lib/state/location";
import animatedRouteA from "../../data/animated_route.json";
import animatedRouteB from "../../data/animated_route_alt.json";
import landmarkChange from "../../data/landmark_change.json";
import type { LineString } from "geojson";
import type { SystemStatus } from "@/types/status";
import {Landmark} from "@/lib/types";

interface DebugAction {
  key: string;
  label: string;
  handler: () => void;
  metaRequired?: boolean;
}

export default function DebugMenu() {
  const [open, setOpen] = useState(false);
  const { setStatus, setRoute } = useDebug();
  const { addLandmark } = useLandmarks();
  const { setLastKnownLocation } = useLocation();

  const toggle = useCallback(() => setOpen((o) => !o), []);

  const actions = useMemo<DebugAction[]>(
    () => [
      {
        key: "9",
        label: "Toggle Route",
        handler: () =>
          setRoute((current) =>
            current && JSON.stringify(current) === JSON.stringify(animatedRouteA)
              ? (animatedRouteB as LineString)
              : (animatedRouteA as LineString)
          ),
        metaRequired: true,
      },
      {
        key: "8",
        label: "Start Route",
        handler: () => {
          setRoute(animatedRouteA as LineString);
          const [lng, lat] = animatedRouteA.coordinates[0];
          setLastKnownLocation({ lat, lng });
        },
        metaRequired: true,
      },
      {
        key: "0",
        label: "Start Landmark Change",
        handler: () => {
          addLandmark(landmarkChange as Landmark);
          setTimeout(() => {
            setRoute(animatedRouteB as LineString);
          }, 5000);
        },
        metaRequired: true,
      },
      ...(["Online", "Transmitting", "Crisis", "Offline"] as SystemStatus[]).map(
        (s, idx) => ({
          key: String(idx + 1),
          label: `Set Status: ${s}`,
          handler: () => setStatus(s),
          metaRequired: idx < 3,
        })
      ),
    ],
    [addLandmark, setRoute, setStatus, setLastKnownLocation]
  );

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "d" && e.shiftKey) {
        e.preventDefault();
        toggle();
        return;
      }
      actions.forEach((action) => {
        if (e.key === action.key && (!action.metaRequired || e.metaKey)) {
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
              {action.label}{action.metaRequired ? ` (⌘${action.key})` : ` (${action.key})`}
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
