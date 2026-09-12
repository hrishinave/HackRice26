"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { completeOnboarding } from "@/app/onboarding/actions";
import { Button } from "@/components/ui/button";
import {
  INITIAL_SURVEY_ANSWERS,
  SURVEY_STORAGE_KEY,
  type SurveyAnswers,
} from "@/lib/survey";

import {
  ConcentrationField,
  MultipleChoiceField,
  SingleChoiceField,
} from "./survey-fields";
import { SURVEY_STEPS, type SurveyStep } from "./survey-steps";

const SURVEY_PAGES = [
  SURVEY_STEPS.slice(0, 2),
  SURVEY_STEPS.slice(2, 4),
  SURVEY_STEPS.slice(4, 6),
  SURVEY_STEPS.slice(6),
];

function isStepAnswered(step: SurveyStep, answers: SurveyAnswers) {
  if (step.type === "slider") {
    return true;
  }

  return answers[step.id].length > 0;
}

export function OnboardingSurvey() {
  const router = useRouter();
  const [answers, setAnswers] = useState<SurveyAnswers>(
    INITIAL_SURVEY_ANSWERS,
  );
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [submitError, setSubmitError] = useState("");
  const [isPending, startTransition] = useTransition();

  const currentPage = SURVEY_PAGES[currentPageIndex];
  const isLastPage = currentPageIndex === SURVEY_PAGES.length - 1;

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

  function moveToPage(pageIndex: number) {
    setCurrentPageIndex(pageIndex);
    setSubmitError("");
    window.scrollTo({ top: 0 });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!currentPage.every((step) => isStepAnswered(step, answers))) {
      setSubmitError("Answer every question on this page before continuing.");
      return;
    }

    if (!isLastPage) {
      moveToPage(currentPageIndex + 1);
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
      className="w-full max-w-3xl border border-primary/30 bg-background/95 shadow-[4px_4px_0_0_var(--primary)]"
    >
      <header className="border-b border-primary/20 px-5 py-4 sm:px-7 sm:py-5">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Build your focus profile
        </h1>
        <p className="mt-1 text-base text-muted-foreground">
          No wrong answers—unless you count 47 open tabs as a focus strategy.
        </p>

        <nav
          aria-label="Survey pages"
          className="mt-4 flex items-center justify-between gap-4"
        >
          <p className="text-sm font-semibold text-primary">
            Page {currentPageIndex + 1} of {SURVEY_PAGES.length}
          </p>
          <ol className="flex gap-2">
            {SURVEY_PAGES.map((_, index) => (
              <li key={index}>
                <span
                  aria-current={index === currentPageIndex ? "page" : undefined}
                  className={
                    index === currentPageIndex
                      ? "grid size-8 place-items-center bg-primary text-sm font-bold text-primary-foreground"
                      : "grid size-8 place-items-center border border-primary/25 text-sm font-semibold text-muted-foreground"
                  }
                >
                  {index + 1}
                </span>
              </li>
            ))}
          </ol>
        </nav>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="sm:min-h-[21rem]">
          {currentPage.map((step) => {
            const questionId = `survey-question-${step.id}`;

            return (
              <fieldset
                className="border-b border-primary/15 px-5 py-5 last:border-b-0 sm:px-7"
                key={step.id}
              >
                <legend className="sr-only">{step.title}</legend>
                <h2
                  className="mb-3 text-xl font-semibold tracking-tight"
                  id={questionId}
                >
                  {step.title}
                </h2>

                {step.type === "single" && (
                  <SingleChoiceField
                    labelledBy={questionId}
                    name={step.id}
                    onChange={(value) => updateAnswer(step.id, value)}
                    options={step.options}
                    value={answers[step.id]}
                  />
                )}

                {step.type === "multiple" && (
                  <MultipleChoiceField
                    labelledBy={questionId}
                    name={step.id}
                    onChange={(values) => updateAnswer(step.id, values)}
                    options={step.options}
                    values={answers[step.id]}
                  />
                )}

                {step.type === "slider" && (
                  <ConcentrationField
                    onChange={(value) => updateAnswer(step.id, value)}
                    value={answers[step.id]}
                  />
                )}
              </fieldset>
            );
          })}
        </div>

        <footer className="border-t border-primary/20 px-5 py-4 sm:px-7">
          {submitError && (
            <p className="mb-4 text-sm font-medium text-destructive" role="alert">
              {submitError}
            </p>
          )}

          <div
            className={
              currentPageIndex === 0
                ? "flex justify-end"
                : "flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between"
            }
          >
            {currentPageIndex > 0 && (
              <Button
                className="w-full sm:w-auto"
                disabled={isPending}
                onClick={() => moveToPage(currentPageIndex - 1)}
                type="button"
                variant="outline"
              >
                <ArrowLeft aria-hidden="true" data-icon="inline-start" />
                Back
              </Button>
            )}

            <Button
              className="w-full sm:w-auto"
              disabled={isPending}
              type="submit"
            >
              {isPending
                ? "Saving…"
                : isLastPage
                  ? "Save my answers"
                  : "Continue"}
              {!isPending && !isLastPage && (
                <ArrowRight aria-hidden="true" data-icon="inline-end" />
              )}
            </Button>
          </div>
        </footer>
      </form>
    </section>
  );
}
