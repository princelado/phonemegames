import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalWords,
      totalActivities,
      wordleActivities,
      wordSearchActivities,
      successfulGenerations,
      failedGenerations,
      averagePageTime,
      recentActivity,
      pageViews,
      activitiesCreated,
      generationUsage,
    ] = await Promise.all([
      prisma.word.count(),

      prisma.activity.count(),

      prisma.activity.count({
        where: {
          type: "WORDLE",
        },
      }),

      prisma.activity.count({
        where: {
          type: "WORD_SEARCH",
        },
      }),

      prisma.usageEvent.count({
        where: {
          eventType:
            "GENERATION_SUCCESS",
        },
      }),

      prisma.usageEvent.count({
        where: {
          eventType:
            "GENERATION_FAILED",
        },
      }),

      prisma.usageEvent.aggregate({
        where: {
          eventType: "PAGE_TIME",
          durationSeconds: {
            not: null,
          },
        },
        _avg: {
          durationSeconds: true,
        },
      }),

      prisma.usageEvent.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      }),

      prisma.usageEvent.count({
        where: {
          eventType: "PAGE_VIEW",
        },
      }),

      prisma.usageEvent.count({
        where: {
          eventType:
            "ACTIVITY_CREATED",
        },
      }),

      prisma.usageEvent.groupBy({
        by: ["activityType"],
        where: {
          eventType:
            "GENERATION_SUCCESS",
          activityType: {
            not: null,
          },
        },
        _count: {
          _all: true,
        },
      }),
    ]);

    let mostUsedActivityType:
      | string
      | null = null;

    let highestCount = 0;

    for (
      const group of generationUsage
    ) {
      if (
        group.activityType &&
        group._count._all >
          highestCount
      ) {
        highestCount =
          group._count._all;

        mostUsedActivityType =
          group.activityType;
      }
    }

    return NextResponse.json({
      totalWords,
      totalActivities,
      wordleActivities,
      wordSearchActivities,

      successfulGenerations,
      failedGenerations,

      totalGeneratedOutputs:
        successfulGenerations,

      averageTimeOnPage:
        averagePageTime._avg
          .durationSeconds ?? 0,

      pageViews,
      activitiesCreated,

      mostUsedActivityType,

      recentActivity,
    });
  } catch (error) {
    console.error(
      "Dashboard statistics error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to load dashboard statistics.",
      },
      {
        status: 500,
      }
    );
  }
}