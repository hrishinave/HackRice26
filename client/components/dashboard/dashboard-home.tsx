"use client";

import Link from "next/link";
import { Activity, AudioLines, Music2 } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { useBackgroundService } from "@/hooks/use-background-service";
import { useFocusCueActivity } from "@/hooks/use-focuscue-activity";
import { cn } from "@/lib/utils";

function formatDuration(milliseconds: number) {
  const minutes = Math.floor(milliseconds / 60000);

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

export function DashboardHome() {
  const serviceEnabled = useBackgroundService();
  const activity = useFocusCueActivity();
  const snapshot = activity.snapshot;
  const currentResponse =
    snapshot?.currentCategory === "distracting"
      ? "Increase detail"
      : snapshot?.currentCategory === "productive"
        ? "Baseline"
        : "Observing";

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
            Ready when you are.
          </h1>
        </div>
        <Link className={buttonVariants({ variant: "outline" })} href="/settings">
          Manage focus settings
        </Link>
      </div>

      <section className="mt-8 border border-primary/25 bg-background/95 shadow-[4px_4px_0_0_var(--primary)]">
        <div className="grid lg:grid-cols-[1.55fr_1fr]">
          <div className="border-b border-primary/20 p-6 sm:p-8 lg:border-r lg:border-b-0">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Music2 aria-hidden="true" className="size-4" />
              Personalized focus mix
            </div>
            <h2 className="mt-5 max-w-xl text-3xl font-semibold tracking-tight">
              Music that keeps pace with your attention.
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
              Your onboarding profile sets the baseline. When FocusCue detects a
              drift, the soundtrack can gradually add detail and energy to help
              bring you back.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button disabled>
                <AudioLines aria-hidden="true" data-icon="inline-start" />
                Generate focus mix
              </Button>
              <span className="text-sm text-muted-foreground">
                ElevenMusic connection is the next integration step.
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Activity aria-hidden="true" className="size-4" />
              Attention signal
            </div>

            <dl className="mt-5 divide-y border-y">
              <div className="flex items-center justify-between gap-4 py-4">
                <dt className="text-muted-foreground">Background service</dt>
                <dd className="flex items-center gap-2 font-semibold">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "size-2 bg-muted-foreground",
                      serviceEnabled && "bg-primary",
                    )}
                  />
                  {serviceEnabled ? "On" : "Off"}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-4">
                <dt className="text-muted-foreground">Activity monitor</dt>
                <dd className="font-semibold">
                  {activity.connectionStatus === "connected"
                    ? "Connected"
                    : activity.connectionStatus === "checking"
                      ? "Checking…"
                      : "Not detected"}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-4">
                <dt className="text-muted-foreground">Current response</dt>
                <dd className="font-semibold">{currentResponse}</dd>
              </div>
            </dl>

            {!serviceEnabled && (
              <Link
                className="mt-5 inline-flex text-sm font-semibold text-primary underline-offset-4 hover:underline"
                href="/settings"
              >
                Turn on the background service
              </Link>
            )}
          </div>
        </div>

        <div className="grid border-t border-primary/20 sm:grid-cols-3">
          {[
            [
              "Focus time today",
              snapshot ? formatDuration(snapshot.totals.productiveMs) : "—",
            ],
            [
              "Distracted today",
              snapshot ? formatDuration(snapshot.totals.distractingMs) : "—",
            ],
            ["Focus score", snapshot ? `${snapshot.focusScore}%` : "—"],
          ].map(([label, value], index) => (
            <div
              className={cn(
                "flex items-center justify-between gap-4 px-6 py-4 sm:block sm:px-8",
                index > 0 && "border-t sm:border-t-0 sm:border-l",
              )}
              key={label}
            >
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="font-heading text-2xl font-semibold text-primary sm:mt-1">
                {value}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
