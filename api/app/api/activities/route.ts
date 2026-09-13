import { NextRequest, NextResponse } from "next/server";

import { createActivity, listActivities } from "@/lib/data";
import type { ActivityType } from "@/lib/types";
import { validateActivityPayload } from "@/lib/validation";

export async function GET(request: NextRequest) {
  try {
    const typeParam = request.nextUrl.searchParams.get("type");
    const type: ActivityType | undefined =
      typeParam === "WORDLE" || typeParam === "WORD_SEARCH" ? typeParam : undefined;
    return NextResponse.json({ activities: await listActivities(type) });
  } catch {
    return NextResponse.json({ error: "Unable to load activities." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const validation = validateActivityPayload(await request.json());
    if ("error" in validation) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const activity = await createActivity(validation.value);
    return NextResponse.json({ activity }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create activity.";
    const status = message.includes("do not exist") ? 400 : 500;
    return NextResponse.json({ error: status === 400 ? message : "Unable to create activity." }, { status });
  }
}
