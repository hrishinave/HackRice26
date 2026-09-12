import type { Metadata } from "next";

import { ActivityDashboard } from "@/components/activity/activity-dashboard";

export const metadata: Metadata = {
  title: "Activity | FocusCue",
};

export default function ActivityPage() {
  return <ActivityDashboard />;
}
