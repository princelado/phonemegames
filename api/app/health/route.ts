import { NextResponse } from "next/server";

import { databaseHealth } from "@/lib/data";

export async function GET() {
  try {
    await databaseHealth();
    return NextResponse.json({ status: "ok", database: "connected" }, { status: 200 });
  } catch {
    return NextResponse.json({ status: "error", database: "unavailable" }, { status: 503 });
  }
}
