import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import type { Landmark } from "@/lib/types";

const dbPath = path.join(process.cwd(), "data", "landmarks.json");

export async function GET() {
  try {
    const data = await fs.readFile(dbPath, "utf-8");
    const landmarks: Landmark[] = JSON.parse(data);
    return NextResponse.json(landmarks);
  } catch {
    return NextResponse.json([]);
  }
}
