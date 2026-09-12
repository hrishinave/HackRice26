"use server";

import { cookies } from "next/headers";

import { SURVEY_COOKIE_NAME } from "@/lib/survey";

export async function resetOnboarding() {
  const cookieStore = await cookies();
  cookieStore.delete(SURVEY_COOKIE_NAME);
}
