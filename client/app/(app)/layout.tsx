import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AppNavbar } from "@/components/shell/app-navbar";
import { SURVEY_COOKIE_NAME } from "@/lib/survey";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const surveyComplete =
    (await cookies()).get(SURVEY_COOKIE_NAME)?.value === "true";

  if (!surveyComplete) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-svh">
      <AppNavbar />
      {children}
    </div>
  );
}
