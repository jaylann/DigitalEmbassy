// src/app/page.tsx

"use client";

import * as React from "react";
import { InteractiveMap } from "@/components/interactive-map";
import { Button } from "@/components/ui/button";
import type { Area } from "@/types/areas";
import { Landmark } from "@/lib/types";
import type { Route } from "@/types/routes";
import type { LineString } from "geojson";
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
import animatedRouteA from "../../data/animated_route.json";
import animatedRouteB from "../../data/animated_route_alt.json";

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
  const [route, setRoute] = React.useState<LineString | null>(null);

  // Load default data and any stored user data on first render
  React.useEffect(() => {
    async function loadLandmarks() {
      try {
        const storedLandmarks = localStorage.getItem("landmarks");
        if (storedLandmarks) {
          setLandmarks(JSON.parse(storedLandmarks));
          return;
        }

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

    try {
      const storedAreas = localStorage.getItem("areas");
      if (storedAreas) {
        setAreas(JSON.parse(storedAreas));
      } else {
        setAreas(defaultAreas as Area[]);
      }
    } catch {
      setAreas(defaultAreas as Area[]);
    }

    try {
      const storedRoutes = localStorage.getItem("routes");
      if (storedRoutes) {
        setRoutes(JSON.parse(storedRoutes));
      } else {
        setRoutes(defaultRoutes as Route[]);
      }
    } catch {
      setRoutes(defaultRoutes as Route[]);
    }

    try {
      const storedRoute = localStorage.getItem("animatedRoute");
      if (storedRoute) {
        setRoute(JSON.parse(storedRoute));
      } else {
        setRoute(animatedRouteA as LineString);
      }
    } catch {
      setRoute(animatedRouteA as LineString);
    }
  }, []);

  // Persist landmarks and areas whenever they change
  React.useEffect(() => {
    if (landmarks.length) {
      localStorage.setItem("landmarks", JSON.stringify(landmarks));
    }
  }, [landmarks]);

  React.useEffect(() => {
    if (areas.length) {
      localStorage.setItem("areas", JSON.stringify(areas));
    }
  }, [areas]);

  React.useEffect(() => {
    if (routes.length) {
      localStorage.setItem("routes", JSON.stringify(routes));
    }
  }, [routes]);

  React.useEffect(() => {
    if (route) {
      localStorage.setItem("animatedRoute", JSON.stringify(route));
    }
  }, [route]);

  return (
    <>
      <InteractiveMap
        landmarks={landmarks}
        areas={areas}
        routes={routes}
        route={route ?? undefined}
      />
      <div className="absolute bottom-4 left-4 z-20">
        <Button
          onClick={() =>
            setRoute((current) =>
              current &&
              JSON.stringify(current) === JSON.stringify(animatedRouteA)
                ? (animatedRouteB as LineString)
                : (animatedRouteA as LineString),
            )
          }
          variant="secondary"
          size="sm"
        >
          Change Route
        </Button>
      </div>
    </>
  );
}
