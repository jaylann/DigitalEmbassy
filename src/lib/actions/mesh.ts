/**
 * @file Contains server actions for interacting with the shared "mesh" data,
 * which is stored as a collection of Landmark objects.
 */

"use server";
import fs from "fs/promises";
import path from "path";
import type { Landmark, Location, ReportPayload } from "@/lib/types";

const dbPath = path.join(process.cwd(), "data", "landmarks.json");

export async function saveReportToMesh(
  reportPayload: ReportPayload,
  userLocation: Location,
): Promise<{ success: boolean; landmark?: Landmark }> {
  try {
    const newLandmark: Landmark = {
      id: crypto.randomUUID(),
      name: reportPayload.name,
      description: reportPayload.description,
      location: userLocation,
      category: reportPayload.category,
      trustLevel: "low",
      isVerified: false,
      addedBy: "user_report",
      lastUpdated: new Date().toISOString(),
      visible: true,
    };

    let landmarks: Landmark[] = [];
    try {
      const data = await fs.readFile(dbPath, "utf-8");
      landmarks = JSON.parse(data);
    } catch {
      /* File doesn't exist yet, will be created. */
    }

    landmarks.push(newLandmark);
    await fs.writeFile(dbPath, JSON.stringify(landmarks, null, 2));

    return { success: true, landmark: newLandmark };
  } catch (error) {
    console.error("Failed to save Landmark report:", error);
    return { success: false };
  }
}
