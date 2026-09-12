"use client";

import { useSyncExternalStore, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";

import { resetOnboarding } from "@/app/(app)/settings/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  setBackgroundServiceEnabled,
  useBackgroundService,
} from "@/hooks/use-background-service";
import { useFocusCueActivity } from "@/hooks/use-focuscue-activity";
import { SURVEY_STORAGE_KEY, type SurveyAnswers } from "@/lib/survey";

import { SURVEY_STEPS } from "../onboarding/survey-steps";

function subscribeToSurvey(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

function getSurveySnapshot() {
  return window.localStorage.getItem(SURVEY_STORAGE_KEY);
}

function getServerSurveySnapshot() {
  return null;
}

function parseSurveyAnswers(value: string | null): SurveyAnswers | null {
  if (!value) {
    return null;
  }

  try {
    const answers = JSON.parse(value) as Partial<SurveyAnswers>;

    if (
      typeof answers.primaryGoal !== "string" ||
      typeof answers.taskDrift !== "string" ||
      typeof answers.taskCompletion !== "string" ||
      !Array.isArray(answers.distractions) ||
      typeof answers.adhdIdentity !== "string" ||
      typeof answers.musicStyle !== "string" ||
      typeof answers.concentration !== "number"
    ) {
      return null;
    }

    return answers as SurveyAnswers;
  } catch {
    return null;
  }
}

function getOptionLabel(stepId: string, value: string) {
  const step = SURVEY_STEPS.find((item) => item.id === stepId);

  if (!step || step.type === "slider") {
    return value;
  }

  return step.options.find((option) => option.value === value)?.label ?? value;
}

export function SettingsPanel() {
  const router = useRouter();
  const serviceEnabled = useBackgroundService();
  const activity = useFocusCueActivity();
  const surveySnapshot = useSyncExternalStore(
    subscribeToSurvey,
    getSurveySnapshot,
    getServerSurveySnapshot,
  );
  const answers = parseSurveyAnswers(surveySnapshot);
  const [isPending, startTransition] = useTransition();

  const answerRows = answers
    ? [
        ["Primary goal", getOptionLabel("primaryGoal", answers.primaryGoal)],
        ["Task drift", getOptionLabel("taskDrift", answers.taskDrift)],
        [
          "Task completion",
          getOptionLabel("taskCompletion", answers.taskCompletion),
        ],
        [
          "Distractions",
          answers.distractions
            .map((value) => getOptionLabel("distractions", value))
            .join(", "),
        ],
        [
          "ADHD identification",
          getOptionLabel("adhdIdentity", answers.adhdIdentity),
        ],
        ["Music style", getOptionLabel("musicStyle", answers.musicStyle)],
        ["Concentration", `${answers.concentration} / 10`],
      ]
    : [];

  function handleRetake() {
    startTransition(async () => {
      window.localStorage.removeItem(SURVEY_STORAGE_KEY);
      await resetOnboarding();
      router.replace("/onboarding");
      router.refresh();
    });
  }

  return (
    <Tabs defaultValue="general">
      <TabsList
        className="h-auto w-full justify-start gap-0 border-b border-primary/20 p-0"
        variant="line"
      >
        <TabsTrigger className="flex-none rounded-none px-4 py-3" value="general">
          General
        </TabsTrigger>
        <TabsTrigger className="flex-none rounded-none px-4 py-3" value="profile">
          Focus profile
        </TabsTrigger>
      </TabsList>

      <TabsContent className="pt-8" value="general">
        <section className="border border-primary/25 bg-background/95">
          <div className="flex items-start justify-between gap-6 p-5 sm:p-6">
            <div>
              <h2 className="text-xl font-semibold">Background service</h2>
              <p className="mt-1 max-w-2xl text-base leading-7 text-muted-foreground">
                Let FocusCue watch for idle or distracted periods and signal the
                soundtrack to increase detail gradually.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className="text-sm font-semibold">
                {serviceEnabled ? "On" : "Off"}
              </span>
              <Switch
                aria-label="Background service"
                checked={serviceEnabled}
                onCheckedChange={setBackgroundServiceEnabled}
              />
            </div>
          </div>
          <p className="border-t bg-muted/40 px-5 py-4 text-sm leading-6 text-muted-foreground sm:px-6">
            {activity.connectionStatus === "connected"
              ? "Extension connected. FocusCue is receiving private, domain-level activity totals from this browser."
              : activity.connectionStatus === "checking"
                ? "Checking for the FocusCue Chrome extension…"
                : "Extension not detected. Load the companion Chrome extension to begin activity monitoring."}
          </p>
        </section>
      </TabsContent>

      <TabsContent className="pt-8" value="profile">
        <section className="border border-primary/25 bg-background/95">
          <div className="p-5 sm:p-6">
            <h2 className="text-xl font-semibold">Onboarding results</h2>
            <p className="mt-1 text-base text-muted-foreground">
              These answers shape the starting point for your generated focus music.
            </p>
          </div>

          {answers ? (
            <dl className="border-t">
              {answerRows.map(([label, value]) => (
                <div
                  className="grid gap-1 border-b px-5 py-4 last:border-b-0 sm:grid-cols-[12rem_1fr] sm:gap-6 sm:px-6"
                  key={label}
                >
                  <dt className="text-sm font-semibold text-muted-foreground">
                    {label}
                  </dt>
                  <dd className="text-base font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="border-t px-5 py-8 text-base text-muted-foreground sm:px-6">
              No survey answers were found on this device.
            </p>
          )}

          <div className="border-t bg-muted/30 p-5 sm:p-6">
            <AlertDialog>
              <AlertDialogTrigger render={<Button variant="destructive" />}>
                <RotateCcw aria-hidden="true" data-icon="inline-start" />
                Retake onboarding
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-none">
                <AlertDialogHeader>
                  <AlertDialogTitle>Retake onboarding?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This removes your saved focus profile from this device and
                    sends you back to the survey.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="rounded-none">
                  <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    disabled={isPending}
                    onClick={handleRetake}
                    variant="destructive"
                  >
                    {isPending ? "Resetting…" : "Retake onboarding"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </section>
      </TabsContent>
    </Tabs>
  );
}
