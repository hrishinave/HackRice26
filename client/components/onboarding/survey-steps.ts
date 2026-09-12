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
  eyebrow: string;
  shortLabel: string;
  title: string;
  description: string;
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
    eyebrow: "Your direction",
    shortLabel: "Goal",
    title: "What is your primary goal?",
    description: "Choose the result you most want from your focus sessions.",
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
    eyebrow: "Attention patterns",
    shortLabel: "Drift",
    title: "How often do you drift away from tasks?",
    description: "Think about a typical work or study session.",
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
    eyebrow: "Follow-through",
    shortLabel: "Completion",
    title: "How often do you complete the tasks you set out to do?",
    description: "Choose the answer that best reflects an average week.",
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
    eyebrow: "Your environment",
    shortLabel: "Distractions",
    title: "What distracts you while working?",
    description: "Select every option that regularly pulls your attention away.",
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
    eyebrow: "Focus profile",
    shortLabel: "Focus profile",
    title: "Do you identify as a person with ADHD?",
    description: "This optional context helps us tune the experience more thoughtfully.",
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
    eyebrow: "Your sound",
    shortLabel: "Music",
    title: "What style of music do you find least distracting?",
    description: "We’ll use this as the starting point for your custom focus music.",
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
    eyebrow: "Your baseline",
    shortLabel: "Baseline",
    title: "Rate your concentration on a scale of 1 to 10.",
    description: "Choose the number that best represents your usual starting point.",
  },
];
