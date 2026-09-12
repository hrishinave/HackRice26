"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, AudioLines, Check } from "lucide-react";

import { completeOnboarding } from "@/app/onboarding/actions";
import { Button } from "@/components/ui/button";
import {
  INITIAL_SURVEY_ANSWERS,
  SURVEY_STORAGE_KEY,
  type SurveyAnswers,
} from "@/lib/survey";
import { cn } from "@/lib/utils";

import {
  ConcentrationField,
  MultipleChoiceField,
  SingleChoiceField,
} from "./survey-fields";
import { SURVEY_STEPS } from "./survey-steps";

export function OnboardingSurvey() {
  const router = useRouter();
  const [answers, setAnswers] = useState<SurveyAnswers>(
    INITIAL_SURVEY_ANSWERS,
  );
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [submitError, setSubmitError] = useState("");
  const [isPending, startTransition] = useTransition();

  const currentStep = SURVEY_STEPS[currentStepIndex];
  const isLastStep = currentStepIndex === SURVEY_STEPS.length - 1;
  const progress = ((currentStepIndex + 1) / SURVEY_STEPS.length) * 100;

  function updateAnswer<Key extends keyof SurveyAnswers>(
    key: Key,
    value: SurveyAnswers[Key],
  ) {
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [key]: value,
    }));
    setSubmitError("");
  }

  const canContinue =
    currentStep.type === "slider" ||
    (currentStep.type === "multiple"
      ? answers[currentStep.id].length > 0
      : answers[currentStep.id].length > 0);

  function goBack() {
    setCurrentStepIndex((index) => Math.max(0, index - 1));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canContinue) {
      return;
    }

    if (!isLastStep) {
      setCurrentStepIndex((index) => index + 1);
      return;
    }

    startTransition(async () => {
      try {
        window.localStorage.setItem(
          SURVEY_STORAGE_KEY,
          JSON.stringify(answers),
        );
        await completeOnboarding();
        router.replace("/");
        router.refresh();
      } catch {
        setSubmitError("We couldn’t save your profile. Please try again.");
      }
    });
  }

  return (
    <section
      aria-label="Focus profile survey"
      className="grid w-full max-w-6xl overflow-hidden border border-primary/30 bg-background/95 shadow-[4px_4px_0_0_var(--primary)] lg:min-h-[680px] lg:grid-cols-[18rem_1fr]"
    >
      <aside className="flex flex-col bg-primary p-6 text-primary-foreground sm:p-8">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center border border-primary-foreground/35">
            <AudioLines aria-hidden="true" className="size-5" />
          </span>
          <span className="font-mono text-sm font-semibold tracking-[0.14em] uppercase">
            Focus profile
          </span>
        </div>

        <div className="mt-10">
          <p className="font-mono text-sm text-primary-foreground/70">
            {String(currentStepIndex + 1).padStart(2, "0")} /{" "}
            {String(SURVEY_STEPS.length).padStart(2, "0")}
          </p>
          <h2 className="mt-3 text-3xl leading-tight font-semibold tracking-tight">
            Shape the sound of your best work.
          </h2>
          <p className="mt-4 text-base leading-7 text-primary-foreground/75">
            Your answers help tailor music to how you focus, drift, and recover.
          </p>
        </div>

        <div className="mt-8 h-1.5 bg-primary-foreground/20">
          <div
            aria-hidden="true"
            className="h-full bg-primary-foreground transition-[width] duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>

        <ol className="mt-10 hidden space-y-3 lg:block">
          {SURVEY_STEPS.map((step, index) => {
            const isCurrent = index === currentStepIndex;
            const isComplete = index < currentStepIndex;

            return (
              <li
                className={cn(
                  "flex items-center gap-3 text-sm text-primary-foreground/45",
                  (isCurrent || isComplete) &&
                    "text-primary-foreground",
                )}
                key={step.id}
              >
                <span
                  className={cn(
                    "grid size-6 shrink-0 place-items-center border border-primary-foreground/30 font-mono text-xs",
                    isCurrent &&
                      "bg-primary-foreground text-primary",
                  )}
                >
                  {isComplete ? (
                    <Check aria-hidden="true" className="size-3.5" />
                  ) : (
                    index + 1
                  )}
                </span>
                <span>{step.shortLabel}</span>
              </li>
            );
          })}
        </ol>
      </aside>

      <form
        className="flex min-h-[34rem] flex-col p-6 sm:p-10 lg:p-14"
        onSubmit={handleSubmit}
      >
        <div className="flex-1" key={currentStep.id}>
          <p className="font-mono text-sm font-semibold tracking-[0.14em] text-primary uppercase">
            {currentStep.eyebrow}
          </p>
          <h1
            className="mt-4 max-w-2xl text-3xl leading-tight font-semibold tracking-tight sm:text-4xl"
            id="survey-question-title"
          >
            {currentStep.title}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
            {currentStep.description}
          </p>

          <div className="mt-8">
            {currentStep.type === "single" && (
              <SingleChoiceField
                name={currentStep.id}
                onChange={(value) => updateAnswer(currentStep.id, value)}
                options={currentStep.options}
                value={answers[currentStep.id]}
              />
            )}

            {currentStep.type === "multiple" && (
              <MultipleChoiceField
                name={currentStep.id}
                onChange={(values) => updateAnswer(currentStep.id, values)}
                options={currentStep.options}
                values={answers[currentStep.id]}
              />
            )}

            {currentStep.type === "slider" && (
              <ConcentrationField
                onChange={(value) => updateAnswer(currentStep.id, value)}
                value={answers[currentStep.id]}
              />
            )}
          </div>
        </div>

        <div className="mt-10 border-t pt-6">
          {submitError && (
            <p className="mb-4 text-sm font-medium text-destructive" role="alert">
              {submitError}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <Button
              className="w-full sm:w-auto"
              disabled={currentStepIndex === 0 || isPending}
              onClick={goBack}
              type="button"
              variant="ghost"
            >
              <ArrowLeft aria-hidden="true" data-icon="inline-start" />
              Back
            </Button>

            <Button
              className="w-full sm:w-auto"
              disabled={!canContinue || isPending}
              type="submit"
            >
              {isPending
                ? "Saving profile…"
                : isLastStep
                  ? "Create my focus profile"
                  : "Continue"}
              {!isPending && (
                <ArrowRight aria-hidden="true" data-icon="inline-end" />
              )}
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
}
