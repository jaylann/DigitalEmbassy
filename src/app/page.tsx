// src/app/page.tsx

"use client";

import * as React from "react";
import { InteractiveMap } from "@/components/interactive-map";
import type { Area } from "@/types/areas";
import { Landmark } from "@/lib/types";
import type { Route } from "@/types/routes";
import { useDebug } from "@/lib/state/debug";
import checkpoint from "../../data/checkpoint.json";
import communication from "../../data/communication.json";
import dangerousSpots from "../../data/dangerous_spot.json";
import explosions from "../../data/explosion.json";
import attacks from "../../data/attack.json";
import disasters from "../../data/disaster.json";
import hospitals from "../../data/hospitals.json";
import medical from "../../data/medical.json";
import safeSpaces from "../../data/safe_space.json";

import defaultAreas from "../../data/areas.json";
import defaultRoutes from "../../data/routes.json";

const staticLandmarks: Landmark[] = [
  ...(checkpoint as Landmark[]),
  ...(communication as Landmark[]),
  ...(dangerousSpots as Landmark[]),
  ...(explosions as Landmark[]),
  ...(attacks as Landmark[]),
  ...(disasters as Landmark[]),
  ...(hospitals as Landmark[]),
  ...(medical as Landmark[]),
  ...(safeSpaces as Landmark[]),
];

export default function Home() {
  const [landmarks, setLandmarks] = React.useState<Landmark[]>([]);
  const [areas, setAreas] = React.useState<Area[]>([]);
  const [routes, setRoutes] = React.useState<Route[]>([]);
  const { route } = useDebug();

  // Load default data on first render
  React.useEffect(() => {
    async function loadLandmarks() {
      try {
        const res = await fetch("/api/landmarks");
        if (res.ok) {
          const dynamic: Landmark[] = await res.json();
          setLandmarks([...dynamic, ...staticLandmarks]);
        } else {
          setLandmarks([...staticLandmarks]);
        }
      } catch {
        setLandmarks([...staticLandmarks]);
      }
    }

    void loadLandmarks();

    setAreas(defaultAreas as Area[]);
    setRoutes(defaultRoutes as Route[]);
  }, []);


  return (
    <>
      <InteractiveMap
        landmarks={landmarks}
        areas={areas}
        routes={routes}
        route={route ?? undefined}
      />
    </>
  );
}
