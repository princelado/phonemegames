"use client";

import { useEffect } from "react";

export type ActivityType = "WORDLE" | "WORD_SEARCH";

type UsageEvent = {
  eventType:
    | "ACTIVITY_CREATED"
    | "GENERATION_SUCCESS"
    | "GENERATION_FAILED"
    | "PAGE_VIEW"
    | "PAGE_TIME";
  activityType?: ActivityType;
  activityId?: number;
  page?: string;
  durationSeconds?: number;
  message?: string;
};

export async function logUsageEvent(event: UsageEvent) {
  try {
    await fetch("/api/usage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
      keepalive: true,
    });
  } catch (error) {
    console.error("Unable to record usage event:", error);
  }
}

export function usePageTiming(
  page: string,
  activityType?: ActivityType
) {
  useEffect(() => {
    const startTime = performance.now();

    void logUsageEvent({
      eventType: "PAGE_VIEW",
      page,
      activityType,
      message: `Viewed ${page}`,
    });

    return () => {
      const durationSeconds =
        Math.round(
          ((performance.now() - startTime) / 1000) * 100
        ) / 100;

      const payload = JSON.stringify({
        eventType: "PAGE_TIME",
        page,
        activityType,
        durationSeconds,
        message: `Spent ${durationSeconds}s on ${page}`,
      });

      if (navigator.sendBeacon) {
        const blob = new Blob([payload], {
          type: "application/json",
        });

        navigator.sendBeacon("/api/usage", blob);
      } else {
        void fetch("/api/usage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: payload,
          keepalive: true,
        });
      }
    };
  }, [page, activityType]);
}