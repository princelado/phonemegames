"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  usePageTiming,
} from "@/lib/usage";

type UsageEvent = {
  id: number;
  eventType: string;

  activityType:
    | "WORDLE"
    | "WORD_SEARCH"
    | null;

  page: string | null;

  durationSeconds:
    | number
    | null;

  message: string | null;

  createdAt: string;
};

type DashboardStats = {
  totalWords: number;
  totalActivities: number;
  wordleActivities: number;
  wordSearchActivities: number;

  successfulGenerations: number;
  failedGenerations: number;
  totalGeneratedOutputs: number;

  averageTimeOnPage: number;

  pageViews: number;
  activitiesCreated: number;

  mostUsedActivityType:
    | "WORDLE"
    | "WORD_SEARCH"
    | null;

  recentActivity: UsageEvent[];
};

type HealthStatus = {
  status: string;
  database: string;
};

export default function DashboardPage() {
  usePageTiming("/dashboard");

  const [stats, setStats] =
    useState<DashboardStats | null>(
      null
    );

  const [health, setHealth] =
    useState<HealthStatus | null>(
      null
    );

  const [
    lastUpdated,
    setLastUpdated,
  ] = useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [
          statsResponse,
          healthResponse,
        ] = await Promise.all([
          fetch(
            "/api/dashboard",
            {
              cache:
                "no-store",
            }
          ),

          fetch("/health", {
            cache: "no-store",
          }),
        ]);

        if (
          !statsResponse.ok
        ) {
          throw new Error();
        }

        const statsData =
          await statsResponse.json();

        setStats(statsData);

        if (
          healthResponse.ok
        ) {
          const healthData =
            await healthResponse.json();

          setHealth(
            healthData
          );
        } else {
          setHealth(null);
        }

        setLastUpdated(
          new Date().toLocaleTimeString()
        );
      } catch {
        setError(
          "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    }

    void loadDashboard();
  }, []);

  const cards = [
    {
      label:
        "Total Stored Words",
      value:
        stats?.totalWords ?? 0,
    },

    {
      label:
        "Wordle Activities",
      value:
        stats?.wordleActivities ??
        0,
    },

    {
      label:
        "Word Search Activities",
      value:
        stats?.wordSearchActivities ??
        0,
    },

    {
      label:
        "Successful Generations",
      value:
        stats
          ?.successfulGenerations ??
        0,
    },

    {
      label:
        "Failed Generations",
      value:
        stats
          ?.failedGenerations ??
        0,
    },

    {
      label:
        "Average Time on Page",
      value: `${Math.round(
        stats?.averageTimeOnPage ??
          0
      )}s`,
    },
  ];

  function eventLabel(
    eventType: string
  ) {
    return eventType
      .toLowerCase()
      .replaceAll("_", " ")
      .replace(
        /\b\w/g,
        (letter) =>
          letter.toUpperCase()
      );
  }

  function activityLabel(
    activityType:
      | string
      | null
  ) {
    if (
      activityType === "WORDLE"
    ) {
      return "Wordle";
    }

    if (
      activityType ===
      "WORD_SEARCH"
    ) {
      return "Word Search";
    }

    return "General";
  }

  return (
    <main className="p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-3">
            Dashboard
          </h1>

          <p>
            Overview of application
            activity, usage statistics
            and system health.
          </p>

          {loading && (
            <p className="mt-3 opacity-70">
              Loading dashboard
              statistics...
            </p>
          )}

          {error && (
            <p
              className="mt-3 border rounded p-3"
              role="alert"
            >
              {error}
            </p>
          )}
        </div>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(
            (stat) => (
              <div
                key={
                  stat.label
                }
                className="border rounded-lg p-5"
              >
                <p className="text-sm opacity-70 mb-2">
                  {stat.label}
                </p>

                <p className="text-3xl font-bold">
                  {stat.value}
                </p>
              </div>
            )
          )}
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">
              Activity Usage
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between gap-5">
                <span>
                  Most-used
                  activity type
                </span>

                <strong>
                  {stats
                    ?.mostUsedActivityType
                    ? activityLabel(
                        stats.mostUsedActivityType
                      )
                    : "No generation data"}
                </strong>
              </div>

              <div className="flex justify-between gap-5">
                <span>
                  Total activity
                  configurations
                </span>

                <strong>
                  {stats
                    ?.totalActivities ??
                    0}
                </strong>
              </div>

              <div className="flex justify-between gap-5">
                <span>
                  Activities created
                  during tracking
                </span>

                <strong>
                  {stats
                    ?.activitiesCreated ??
                    0}
                </strong>
              </div>

              <div className="flex justify-between gap-5">
                <span>
                  Total generated
                  outputs
                </span>

                <strong>
                  {stats
                    ?.totalGeneratedOutputs ??
                    0}
                </strong>
              </div>

              <div className="flex justify-between gap-5">
                <span>
                  Recorded page views
                </span>

                <strong>
                  {stats
                    ?.pageViews ??
                    0}
                </strong>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">
              System Health
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span>
                  API Status
                </span>

                <strong>
                  {health?.status ===
                  "ok"
                    ? "Healthy"
                    : "Unavailable"}
                </strong>
              </div>

              <div className="flex justify-between">
                <span>
                  Database Status
                </span>

                <strong>
                  {health?.database ===
                  "connected"
                    ? "Connected"
                    : "Unavailable"}
                </strong>
              </div>

              <div className="flex justify-between">
                <span>
                  Last Updated
                </span>

                <strong>
                  {lastUpdated ||
                    "Not available"}
                </strong>
              </div>
            </div>
          </div>
        </section>

        <section className="border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Recent Activity
          </h2>

          {stats?.recentActivity
            ?.length ? (
            <div className="space-y-3">
              {stats.recentActivity.map(
                (event) => (
                  <div
                    key={
                      event.id
                    }
                    className="border rounded p-3 flex flex-wrap justify-between gap-3"
                  >
                    <div>
                      <strong>
                        {eventLabel(
                          event.eventType
                        )}
                      </strong>

                      <div className="text-sm opacity-70">
                        {activityLabel(
                          event.activityType
                        )}

                        {event.page
                          ? ` · ${event.page}`
                          : ""}

                        {event.message
                          ? ` · ${event.message}`
                          : ""}
                      </div>
                    </div>

                    <span className="text-sm opacity-70">
                      {new Date(
                        event.createdAt
                      ).toLocaleString()}
                    </span>
                  </div>
                )
              )}
            </div>
          ) : (
            <p className="opacity-70">
              No recent activity has
              been recorded yet.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}