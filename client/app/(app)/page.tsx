import type { Metadata } from "next";

import { DashboardHome } from "@/components/dashboard/dashboard-home";

export const metadata: Metadata = {
  title: "Dashboard | FocusCue",
};

export default function HomePage() {
  return <DashboardHome />;
}
