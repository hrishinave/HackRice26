import type { Metadata } from "next";

import { OnboardingSurvey } from "@/components/onboarding/onboarding-survey";

export const metadata: Metadata = {
  title: "Create your focus profile | HackRice26",
};

export default function OnboardingPage() {
  return (
    <main className="flex min-h-svh items-start justify-center px-4 py-3 sm:items-center sm:px-6 sm:py-4 lg:px-8">
      <OnboardingSurvey />
    </main>
  );
}
