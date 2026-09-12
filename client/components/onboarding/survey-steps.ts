import type { SurveyAnswers } from "@/lib/survey";

export type SurveyOption = {
  label: string;
  value: string;
};

type SingleChoiceKey = Exclude<
  keyof SurveyAnswers,
  "distractions" | "concentration"
>;

type SurveyStepBase = {
  title: string;
};

export type SurveyStep =
  | (SurveyStepBase & {
      id: SingleChoiceKey;
      type: "single";
      options: SurveyOption[];
    })
  | (SurveyStepBase & {
      id: "distractions";
      type: "multiple";
      options: SurveyOption[];
    })
  | (SurveyStepBase & {
      id: "concentration";
      type: "slider";
    });

export const SURVEY_STEPS: SurveyStep[] = [
  {
    id: "primaryGoal",
    type: "single",
    title: "What is your primary goal?",
    options: [
      { label: "Stay focused for longer", value: "focus-longer" },
      { label: "Finish important work", value: "finish-work" },
      { label: "Build a consistent routine", value: "build-routine" },
      { label: "Feel less stressed while working", value: "reduce-stress" },
    ],
  },
  {
    id: "taskDrift",
    type: "single",
    title: "How often do you drift away from tasks?",
    options: [
      { label: "Rarely", value: "rarely" },
      { label: "Sometimes", value: "sometimes" },
      { label: "Often", value: "often" },
      { label: "Almost always", value: "almost-always" },
    ],
  },
  {
    id: "taskCompletion",
    type: "single",
    title: "How often do you complete the tasks you set out to do?",
    options: [
      { label: "Rarely", value: "rarely" },
      { label: "Sometimes", value: "sometimes" },
      { label: "Often", value: "often" },
      { label: "Almost always", value: "almost-always" },
    ],
  },
  {
    id: "distractions",
    type: "multiple",
    title: "What distracts you while working?",
    options: [
      { label: "Notifications", value: "notifications" },
      { label: "Social media", value: "social-media" },
      { label: "Other tabs and websites", value: "other-tabs" },
      { label: "Noise and conversations", value: "noise" },
      { label: "Racing thoughts", value: "racing-thoughts" },
      { label: "Boredom", value: "boredom" },
    ],
  },
  {
    id: "adhdIdentity",
    type: "single",
    title: "Do you identify as a person with ADHD?",
    options: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
      { label: "I’m not sure", value: "not-sure" },
      { label: "Prefer not to say", value: "prefer-not-to-say" },
    ],
  },
  {
    id: "musicStyle",
    type: "single",
    title: "What style of music do you find least distracting?",
    options: [
      { label: "Ambient", value: "ambient" },
      { label: "Classical", value: "classical" },
      { label: "Lo-fi", value: "lo-fi" },
      { label: "Electronic", value: "electronic" },
      { label: "Instrumental jazz", value: "instrumental-jazz" },
      { label: "Nature-inspired sound", value: "nature-inspired" },
    ],
  },
  {
    id: "concentration",
    type: "slider",
    title: "Rate your concentration on a scale of 1 to 10.",
  },
];
