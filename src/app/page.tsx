// src/app/page.tsx

"use client";

import * as React from "react";
import { InteractiveMap } from "@/components/interactive-map";
import type { Area } from "@/types/areas";
import { Landmark } from "@/lib/types";
import type { Route } from "@/types/routes";
import defaultLandmarks from "../../data/landmarks.json";
import type { LineString } from "geojson";
import checkpoint from "../../data/checkpoint.json";
import communication from "../../data/communication.json";
import dangerousSpots from "../../data/dangerous_spot.json";
import hospitals from "../../data/hospitals.json";
import medical from "../../data/medical.json";
import safeSpaces from "../../data/safe_space.json";

import defaultAreas from "../../data/areas.json";
import defaultRoutes from "../../data/routes.json";

const defaultLandmarks: Landmark[] = [
  ...(checkpoint as Landmark[]),
  ...(communication as Landmark[]),
  ...(dangerousSpots as Landmark[]),
  ...(hospitals as Landmark[]),
  ...(medical as Landmark[]),
  ...(safeSpaces as Landmark[]),
];




export default function Home() {
  const [landmarks, setLandmarks] = React.useState<Landmark[]>([]);
  const [areas, setAreas] = React.useState<Area[]>([]);
  const [routes, setRoutes] = React.useState<Route[]>([]);

  // Load default data and any stored user data on first render
  React.useEffect(() => {
    try {
      const storedLandmarks = localStorage.getItem('landmarks');
      if (storedLandmarks) {
        setLandmarks(JSON.parse(storedLandmarks));
      } else {
        setLandmarks(defaultLandmarks);
      }
    } catch {
      setLandmarks(defaultLandmarks);
    }

    try {
      const storedAreas = localStorage.getItem('areas');
      if (storedAreas) {
        setAreas(JSON.parse(storedAreas));
      } else {
        setAreas(defaultAreas as Area[]);
      }
    } catch {
      setAreas(defaultAreas as Area[]);
    }

    try {
      const storedRoutes = localStorage.getItem('routes');
      if (storedRoutes) {
        setRoutes(JSON.parse(storedRoutes));
      } else {
        setRoutes(defaultRoutes as Route[]);
      }
    } catch {
      setRoutes(defaultRoutes as Route[]);
    }
  }, []);

  // Persist landmarks and areas whenever they change
  React.useEffect(() => {
    if (landmarks.length) {
      localStorage.setItem('landmarks', JSON.stringify(landmarks));
    }
  }, [landmarks]);

  React.useEffect(() => {
    if (areas.length) {
      localStorage.setItem('areas', JSON.stringify(areas));
    }
  }, [areas]);


  React.useEffect(() => {
    if (routes.length) {
      localStorage.setItem('routes', JSON.stringify(routes));
    }
  }, [routes]);


  return (
    <>
      <InteractiveMap
        landmarks={landmarks}
        areas={areas}
        routes={routes}
      />
    </>
  );
}
