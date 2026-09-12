"use client";

import { useFocusCueActivity } from "@/hooks/use-focuscue-activity";
import type { ActivityCategory, DailyActivity } from "@/lib/activity";
import { cn } from "@/lib/utils";

function formatDuration(milliseconds: number) {
  if (milliseconds > 0 && milliseconds < 60000) {
    return "<1m";
  }

  const totalMinutes = Math.floor(milliseconds / 60000);
  if (totalMinutes < 60) {
    return `${totalMinutes}m`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes ? `${hours}h ${minutes}m` : `${hours}h`;
}

function formatDay(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

function formatUpdatedAt(value: string) {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function categoryLabel(category: ActivityCategory) {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

function categoryStyles(category: ActivityCategory) {
  return cn(
    "size-2 shrink-0",
    category === "productive" && "bg-primary",
    category === "distracting" && "bg-destructive",
    category === "neutral" && "bg-muted-foreground",
  );
}

function HistoryBar({ day }: { day: DailyActivity }) {
  const productiveWidth = day.trackedMs
    ? (day.productiveMs / day.trackedMs) * 100
    : 0;
  const distractingWidth = day.trackedMs
    ? (day.distractingMs / day.trackedMs) * 100
    : 0;
  const neutralWidth = day.trackedMs ? (day.neutralMs / day.trackedMs) * 100 : 0;

  return (
    <li className="grid grid-cols-[3.5rem_minmax(0,1fr)_3.5rem] items-center gap-3 border-t py-3 first:border-t-0">
      <time className="text-sm font-semibold" dateTime={day.date}>
        {formatDay(day.date)}
      </time>
      <div
        aria-label={`${formatDuration(day.productiveMs)} productive, ${formatDuration(day.distractingMs)} distracting, and ${formatDuration(day.neutralMs)} neutral`}
        className="flex h-3 bg-muted"
        role="img"
      >
        <span className="bg-primary" style={{ width: `${productiveWidth}%` }} />
        <span
          className="bg-destructive"
          style={{ width: `${distractingWidth}%` }}
        />
        <span
          className="bg-muted-foreground"
          style={{ width: `${neutralWidth}%` }}
        />
      </div>
      <span className="text-right text-sm text-muted-foreground">
        {formatDuration(day.trackedMs)}
      </span>
    </li>
  );
}

export function ActivityDashboard() {
  const activity = useFocusCueActivity();
  const snapshot = activity.snapshot;

  if (activity.connectionStatus === "checking") {
    return (
      <ActivityPageFrame>
        <section className="mt-8 border border-primary/25 bg-background/95 p-8">
          <p className="font-semibold text-primary">Connecting to the activity monitor…</p>
          <p className="mt-2 text-base text-muted-foreground">
            Looking for the FocusCue Chrome extension on this browser.
          </p>
        </section>
      </ActivityPageFrame>
    );
  }

  if (activity.connectionStatus === "unavailable" || !snapshot) {
    return (
      <ActivityPageFrame>
        <section className="mt-8 border border-primary/25 bg-background/95 p-6 shadow-[4px_4px_0_0_var(--primary)] sm:p-8">
          <p className="text-sm font-semibold text-primary">Extension not detected</p>
          <h2 className="mt-2 text-2xl font-semibold">Connect the activity monitor</h2>
          <p className="mt-2 max-w-2xl text-base leading-7 text-muted-foreground">
            Load the FocusCue extension in Chrome, then refresh this page. Your
            domain-level activity will appear here automatically.
          </p>
        </section>
      </ActivityPageFrame>
    );
  }

  const statusCopy = !snapshot.trackingEnabled
    ? "Tracking paused"
    : snapshot.currentStatus === "idle"
      ? "Device idle"
      : snapshot.currentStatus === "unfocused"
        ? "Browser unfocused"
        : snapshot.currentDomain ?? "Waiting for a supported tab";

  const summary = [
    ["Focus score", `${snapshot.focusScore}%`],
    ["Productive", formatDuration(snapshot.totals.productiveMs)],
    ["Distracting", formatDuration(snapshot.totals.distractingMs)],
    ["Neutral", formatDuration(snapshot.totals.neutralMs)],
  ];

  return (
    <ActivityPageFrame
      status={statusCopy}
      updatedAt={formatUpdatedAt(snapshot.updatedAt)}
    >
      <section className="mt-8 border border-primary/25 bg-background/95 shadow-[4px_4px_0_0_var(--primary)]">
        <dl className="grid sm:grid-cols-2 lg:grid-cols-4">
          {summary.map(([label, value], index) => (
            <div
              className={cn(
                "flex items-center justify-between gap-4 px-5 py-4 sm:block sm:px-6",
                index > 0 && "border-t sm:border-t-0",
                index % 2 === 1 && "sm:border-l",
                index > 1 && "sm:border-t lg:border-t-0",
                index > 0 && "lg:border-l",
              )}
              key={label}
            >
              <dt className="text-sm font-semibold text-muted-foreground">
                {label}
              </dt>
              <dd className="font-heading text-2xl font-semibold text-primary sm:mt-1">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-8 border border-primary/25 bg-background/95">
        <div className="grid lg:grid-cols-[1.45fr_1fr]">
          <div className="min-w-0 border-b lg:border-r lg:border-b-0">
            <div className="border-b px-5 py-4 sm:px-6">
              <h2 className="text-xl font-semibold">Domains today</h2>
              <p className="mt-1 text-base text-muted-foreground">
                Ranked by active time in the focused Chrome window.
              </p>
            </div>

            {snapshot.domains.length ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[34rem] border-collapse text-left">
                  <thead className="bg-muted/40 text-sm text-muted-foreground">
                    <tr>
                      <th className="px-5 py-3 font-semibold sm:px-6">Domain</th>
                      <th className="px-4 py-3 font-semibold">Category</th>
                      <th className="px-4 py-3 font-semibold">Share</th>
                      <th className="px-5 py-3 text-right font-semibold sm:px-6">
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {snapshot.domains.map((domain) => {
                      const share = snapshot.totals.trackedMs
                        ? Math.round(
                            (domain.durationMs / snapshot.totals.trackedMs) * 100,
                          )
                        : 0;

                      return (
                        <tr className="border-t" key={domain.domain}>
                          <th className="max-w-56 truncate px-5 py-3.5 text-sm font-semibold sm:px-6">
                            {domain.domain}
                          </th>
                          <td className="px-4 py-3.5">
                            <span className="inline-flex items-center gap-2 text-sm font-medium">
                              <span
                                aria-hidden="true"
                                className={categoryStyles(domain.category)}
                              />
                              {categoryLabel(domain.category)}
                            </span>
                          </td>
                          <td className="w-40 px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="h-2 flex-1 bg-muted">
                                <div
                                  className="h-full bg-primary/70"
                                  style={{ width: `${share}%` }}
                                />
                              </div>
                              <span className="w-9 text-right text-sm text-muted-foreground">
                                {share}%
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-right text-sm font-semibold sm:px-6">
                            {formatDuration(domain.durationMs)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="px-5 py-12 text-base text-muted-foreground sm:px-6">
                {snapshot.trackingEnabled
                  ? "No domain activity has been recorded today yet."
                  : "Turn on the background service in Settings to start tracking."}
              </p>
            )}
          </div>

          <div className="min-w-0">
            <div className="border-b px-5 py-4 sm:px-6">
              <h2 className="text-xl font-semibold">Recent history</h2>
              <p className="mt-1 text-base text-muted-foreground">
                Your locally stored daily activity mix.
              </p>
            </div>
            <div className="px-5 py-4 sm:px-6">
              <div className="flex flex-wrap gap-x-4 gap-y-2 border-b pb-4 text-sm">
                {(["productive", "distracting", "neutral"] as const).map(
                  (category) => (
                    <span className="inline-flex items-center gap-2" key={category}>
                      <span
                        aria-hidden="true"
                        className={categoryStyles(category)}
                      />
                      {categoryLabel(category)}
                    </span>
                  ),
                )}
              </div>

              {snapshot.history.length ? (
                <ol>
                  {snapshot.history.map((day) => (
                    <HistoryBar day={day} key={day.date} />
                  ))}
                </ol>
              ) : (
                <p className="py-10 text-base text-muted-foreground">
                  Daily history will appear after FocusCue records activity.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <p className="mt-5 text-sm leading-6 text-muted-foreground">
        Only domain names and durations are shown. FocusCue does not collect page
        titles, full URLs, form entries, or page content.
      </p>
    </ActivityPageFrame>
  );
}

function ActivityPageFrame({
  children,
  status,
  updatedAt,
}: {
  children: React.ReactNode;
  status?: string;
  updatedAt?: string;
}) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Attention data</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
            Activity
          </h1>
          <p className="mt-2 max-w-2xl text-base leading-7 text-muted-foreground">
            See where your browser time went and how it shaped today&apos;s focus signal.
          </p>
        </div>
        {status && (
          <div className="border border-primary/20 bg-background/95 px-4 py-3 sm:text-right">
            <p className="flex items-center gap-2 text-sm font-semibold sm:justify-end">
              <span aria-hidden="true" className="size-2 bg-primary" />
              {status}
            </p>
            {updatedAt && (
              <p className="mt-1 text-xs text-muted-foreground">
                Updated at {updatedAt}
              </p>
            )}
          </div>
        )}
      </div>
      {children}
    </main>
  );
}
