"use client";

import { useSyncExternalStore } from "react";

import {
  getFocusCueActivitySnapshot,
  getServerFocusCueActivitySnapshot,
  subscribeToFocusCueActivity,
} from "@/lib/extension-bridge";

export function useFocusCueActivity() {
  return useSyncExternalStore(
    subscribeToFocusCueActivity,
    getFocusCueActivitySnapshot,
    getServerFocusCueActivitySnapshot,
  );
}
