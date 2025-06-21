"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Landmark } from "@/lib/types";
import checkpoint from "../../../data/checkpoint.json";
import communication from "../../../data/communication.json";
import dangerousSpots from "../../../data/dangerous_spot.json";
import explosions from "../../../data/explosion.json";
import attacks from "../../../data/attack.json";
import disasters from "../../../data/disaster.json";
import hospitals from "../../../data/hospitals.json";
import medical from "../../../data/medical.json";
import safeSpaces from "../../../data/safe_space.json";

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

interface LandmarksContextType {
  landmarks: Landmark[];
  addLandmark: (l: Landmark) => void;
}

const LandmarksContext = createContext<LandmarksContextType | undefined>(undefined);

export function LandmarksProvider({ children }: { children: ReactNode }) {
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);

  useEffect(() => {
    async function loadLandmarks() {
      try {
        const stored = localStorage.getItem("landmarks");
        if (stored) {
          setLandmarks(JSON.parse(stored));
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
  }, []);

  useEffect(() => {
    if (landmarks.length) {
      localStorage.setItem("landmarks", JSON.stringify(landmarks));
    }
  }, [landmarks]);

  const addLandmark = (l: Landmark) => {
    setLandmarks((prev) => [...prev, l]);
  };

  return (
    <LandmarksContext.Provider value={{ landmarks, addLandmark }}>
      {children}
    </LandmarksContext.Provider>
  );
}

export function useLandmarks() {
  const ctx = useContext(LandmarksContext);
  if (!ctx) {
    throw new Error("useLandmarks must be used within LandmarksProvider");
  }
  return ctx;
}
