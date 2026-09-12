export const SURVEY_COOKIE_NAME = "productivity-survey-complete";
export const SURVEY_STORAGE_KEY = "productivity-survey-data";

export type SurveyAnswers = {
  primaryGoal: string;
  taskDrift: string;
  taskCompletion: string;
  distractions: string[];
  adhdIdentity: string;
  musicStyle: string;
  concentration: number;
};

export const INITIAL_SURVEY_ANSWERS: SurveyAnswers = {
  primaryGoal: "",
  taskDrift: "",
  taskCompletion: "",
  distractions: [],
  adhdIdentity: "",
  musicStyle: "",
  concentration: 5,
};
