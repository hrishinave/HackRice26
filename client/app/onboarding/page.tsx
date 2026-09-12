import type { Metadata } from "next";

import { OnboardingSurvey } from "@/components/onboarding/onboarding-survey";

export const metadata: Metadata = {
  title: "Create your focus profile | HackRice26",
};

export default function OnboardingPage() {
  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
      <OnboardingSurvey />
    </main>
  );
}
