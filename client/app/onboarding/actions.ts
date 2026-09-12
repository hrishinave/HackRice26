"use server";

import { cookies } from "next/headers";

import { SURVEY_COOKIE_NAME } from "@/lib/survey";

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

export async function completeOnboarding() {
  const cookieStore = await cookies();

  cookieStore.set(SURVEY_COOKIE_NAME, "true", {
    httpOnly: true,
    maxAge: ONE_YEAR_IN_SECONDS,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}
