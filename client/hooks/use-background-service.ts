"use client";

import { useSyncExternalStore } from "react";

import {
  BACKGROUND_SERVICE_EVENT,
  BACKGROUND_SERVICE_STORAGE_KEY,
} from "@/lib/settings";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(BACKGROUND_SERVICE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(BACKGROUND_SERVICE_EVENT, onStoreChange);
  };
}

function getSnapshot() {
  return window.localStorage.getItem(BACKGROUND_SERVICE_STORAGE_KEY) === "true";
}

function getServerSnapshot() {
  return false;
}

export function setBackgroundServiceEnabled(enabled: boolean) {
  window.localStorage.setItem(
    BACKGROUND_SERVICE_STORAGE_KEY,
    String(enabled),
  );
  window.dispatchEvent(new Event(BACKGROUND_SERVICE_EVENT));
}

export function useBackgroundService() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
