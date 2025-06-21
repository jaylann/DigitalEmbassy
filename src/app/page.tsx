// src/app/page.tsx

"use client";

import * as React from "react";
import type { LineString } from "geojson";
import { InteractiveMap } from "@/components/interactive-map";
import type { Area } from "@/types/areas";
import { Landmark } from "@/lib/types";
import checkpoint from "../../data/checkpoint.json";
import communication from "../../data/communication.json";
import dangerousSpots from "../../data/dangerous_spot.json";
import hospitals from "../../data/hospitals.json";
import medical from "../../data/medical.json";
import safeSpaces from "../../data/safe_space.json";
import defaultAreas from "../../data/areas.json";

const defaultLandmarks: Landmark[] = [
  ...(checkpoint as Landmark[]),
  ...(communication as Landmark[]),
  ...(dangerousSpots as Landmark[]),
  ...(hospitals as Landmark[]),
  ...(medical as Landmark[]),
  ...(safeSpaces as Landmark[]),
];



// --- REVISED AND IMPROVED ROUTE ---
const sampleRoute: LineString = {
  type: "LineString",
  coordinates: [
    // 1. Start southwest of the main area of interest
    [51.325, 35.715],
    // 2. Head northeast towards the checkpoint
    [51.330, 35.720],
    // 3. Pass directly through "Checkpoint A" landmark
    [51.335, 35.722],
    // 4. Make a sharp turn east to avoid the western edge of the "No-Go Zone"
    [51.338, 35.723],
    // 5. Curve northwards on a final approach to the destination
    [51.339, 35.7245],
    // 6. Arrive precisely at the "Medical Center" landmark
    [51.340, 35.725],
  ],
};

export default function Home() {
  const [landmarks, setLandmarks] = React.useState<Landmark[]>([]);
  const [areas, setAreas] = React.useState<Area[]>([]);

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


  return (
    <>
      <InteractiveMap
        landmarks={landmarks}
        areas={areas}
        route={sampleRoute}
      />
    </>
  );
}
