export type ActivityCategory = "productive" | "distracting" | "neutral";

export type ActivityStatus =
  | "active"
  | "idle"
  | "stopped"
  | "unfocused"
  | "unsupported";

export interface ActivityTotals {
  productiveMs: number;
  distractingMs: number;
  neutralMs: number;
  idleMs: number;
  trackedMs: number;
}

export interface DomainActivity {
  domain: string;
  category: ActivityCategory;
  durationMs: number;
}

export interface DailyActivity extends ActivityTotals {
  date: string;
  focusScore: number;
}

export interface ActivitySnapshot {
  version: 1;
  date: string;
  updatedAt: string;
  trackingEnabled: boolean;
  currentStatus: ActivityStatus;
  currentDomain: string | null;
  currentCategory: ActivityCategory | null;
  focusScore: number;
  totals: ActivityTotals;
  domains: DomainActivity[];
  history: DailyActivity[];
}

export type ExtensionConnectionStatus =
  | "checking"
  | "connected"
  | "unavailable";

export interface FocusCueActivityState {
  connectionStatus: ExtensionConnectionStatus;
  snapshot: ActivitySnapshot | null;
}
