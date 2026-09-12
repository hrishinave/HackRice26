import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SURVEY_COOKIE_NAME } from "@/lib/survey";

export default async function Home() {
  const surveyComplete =
    (await cookies()).get(SURVEY_COOKIE_NAME)?.value === "true";

  if (!surveyComplete) {
    redirect("/onboarding");
  }

  return <main className="min-h-svh" />;
}
