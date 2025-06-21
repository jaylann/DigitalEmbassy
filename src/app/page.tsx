// src/app/page.tsx

"use client";

import * as React from "react";
import { InteractiveMap } from "@/components/interactive-map";
import type { Area } from "@/types/areas";
import { useLandmarks } from "@/lib/state/landmarks";
import type { Route } from "@/types/routes";
import { useDebug } from "@/lib/state/debug";

import defaultAreas from "../../data/areas.json";
import defaultRoutes from "../../data/routes.json";

export default function Home() {
  const { landmarks } = useLandmarks();
  const [areas, setAreas] = React.useState<Area[]>([]);
  const [routes, setRoutes] = React.useState<Route[]>([]);
  const { route } = useDebug();

  // Load default data on first render
  React.useEffect(() => {
    setAreas(defaultAreas as Area[]);
    setRoutes(defaultRoutes as Route[]);
  }, []);

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
