import type {
  ActivitySnapshot,
  FocusCueActivityState,
} from "@/lib/activity";
import {
  BACKGROUND_SERVICE_EVENT,
  BACKGROUND_SERVICE_STORAGE_KEY,
} from "@/lib/settings";

const WEB_SOURCE = "focuscue-web";
const EXTENSION_SOURCE = "focuscue-extension";

const SERVER_STATE: FocusCueActivityState = {
  connectionStatus: "checking",
  snapshot: null,
};

let currentState = SERVER_STATE;
let bridgeStarted = false;
let requestSequence = 0;
const listeners = new Set<() => void>();

function emit(nextState: FocusCueActivityState) {
  currentState = nextState;
  listeners.forEach((listener) => listener());
}

function isActivitySnapshot(value: unknown): value is ActivitySnapshot {
  if (!value || typeof value !== "object") {
    return false;
  }

  const snapshot = value as Partial<ActivitySnapshot>;
  return (
    snapshot.version === 1 &&
    typeof snapshot.date === "string" &&
    typeof snapshot.updatedAt === "string" &&
    typeof snapshot.trackingEnabled === "boolean" &&
    typeof snapshot.focusScore === "number" &&
    !!snapshot.totals &&
    typeof snapshot.totals.productiveMs === "number" &&
    typeof snapshot.totals.distractingMs === "number" &&
    typeof snapshot.totals.neutralMs === "number" &&
    Array.isArray(snapshot.domains) &&
    Array.isArray(snapshot.history)
  );
}

function syncBackgroundPreference(enabled: boolean) {
  const value = String(enabled);
  if (window.localStorage.getItem(BACKGROUND_SERVICE_STORAGE_KEY) === value) {
    return;
  }

  window.localStorage.setItem(BACKGROUND_SERVICE_STORAGE_KEY, value);
  window.dispatchEvent(new Event(BACKGROUND_SERVICE_EVENT));
}

function acceptSnapshot(snapshot: ActivitySnapshot) {
  syncBackgroundPreference(snapshot.trackingEnabled);
  emit({ connectionStatus: "connected", snapshot });
}

function handleWindowMessage(event: MessageEvent) {
  if (
    event.source !== window ||
    event.origin !== window.location.origin ||
    event.data?.source !== EXTENSION_SOURCE
  ) {
    return;
  }

  if (event.data.type === "FOCUSCUE_EXTENSION_READY") {
    emit({ ...currentState, connectionStatus: "connected" });
    requestFocusCueActivity();
    return;
  }

  const payload =
    event.data.type === "FOCUSCUE_ACTIVITY_RESPONSE"
      ? event.data.response?.payload
      : event.data.payload;

  if (isActivitySnapshot(payload)) {
    acceptSnapshot(payload);
  }
}

function ensureBridgeStarted() {
  if (bridgeStarted || typeof window === "undefined") {
    return;
  }

  bridgeStarted = true;
  window.addEventListener("message", handleWindowMessage);
  requestFocusCueActivity();

  window.setTimeout(() => {
    if (currentState.connectionStatus === "checking") {
      emit({ ...currentState, connectionStatus: "unavailable" });
    }
  }, 1500);

  window.setInterval(requestFocusCueActivity, 15000);
}

function postRequest(type: string, payload: Record<string, unknown> = {}) {
  if (typeof window === "undefined") {
    return;
  }

  requestSequence += 1;
  window.postMessage(
    {
      source: WEB_SOURCE,
      type,
      requestId: `focuscue-${Date.now()}-${requestSequence}`,
      ...payload,
    },
    window.location.origin,
  );
}

export function requestFocusCueActivity() {
  postRequest("FOCUSCUE_GET_ACTIVITY");
}

export function setExtensionTrackingEnabled(enabled: boolean) {
  ensureBridgeStarted();
  postRequest("FOCUSCUE_SET_TRACKING", { enabled });
}

export function subscribeToFocusCueActivity(listener: () => void) {
  listeners.add(listener);
  ensureBridgeStarted();
  return () => listeners.delete(listener);
}

export function getFocusCueActivitySnapshot() {
  return currentState;
}

export function getServerFocusCueActivitySnapshot() {
  return SERVER_STATE;
}
