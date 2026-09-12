import type { Metadata } from "next";

import { SettingsPanel } from "@/components/settings/settings-panel";

export const metadata: Metadata = {
  title: "Settings | FocusCue",
};

export default function SettingsPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold text-primary">Your workspace</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
        Settings
      </h1>
      <p className="mt-2 max-w-2xl text-base leading-7 text-muted-foreground">
        Manage attention tracking and the profile behind your personalized music.
      </p>

      <div className="mt-8">
        <SettingsPanel />
      </div>
    </main>
  );
}
