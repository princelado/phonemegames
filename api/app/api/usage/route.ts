import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const allowedEventTypes = [
  "ACTIVITY_CREATED",
  "GENERATION_SUCCESS",
  "GENERATION_FAILED",
  "PAGE_VIEW",
  "PAGE_TIME",
] as const;

const allowedActivityTypes = ["WORDLE", "WORD_SEARCH"] as const;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      eventType,
      activityType,
      activityId,
      page,
      durationSeconds,
      message,
    } = body;

    if (!allowedEventTypes.includes(eventType)) {
      return NextResponse.json(
        { error: "Invalid event type." },
        { status: 400 }
      );
    }

    if (
      activityType &&
      !allowedActivityTypes.includes(activityType)
    ) {
      return NextResponse.json(
        { error: "Invalid activity type." },
        { status: 400 }
      );
    }

    if (
      durationSeconds !== undefined &&
      (typeof durationSeconds !== "number" || durationSeconds < 0)
    ) {
      return NextResponse.json(
        { error: "durationSeconds must be a positive number." },
        { status: 400 }
      );
    }

    const usageEvent = await prisma.usageEvent.create({
      data: {
        eventType,
        activityType: activityType ?? null,
        activityId:
          typeof activityId === "number" ? activityId : null,
        page: page ?? null,
        durationSeconds: durationSeconds ?? null,
        message: message ?? null,
      },
    });

    return NextResponse.json(
      {
        message: "Usage event recorded.",
        usageEvent,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Usage event error:", error);

    return NextResponse.json(
      {
        error: "Unable to record usage event.",
      },
      {
        status: 500,
      }
    );
  }
}