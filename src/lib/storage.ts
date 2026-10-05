import {
  DEFAULT_SETTINGS,
  type AppSettings,
  type Lang,
  type Mode,
  type TestResult,
} from "@/types/typing";

export const SETTINGS_KEY = "type3d:settings";
export const HISTORY_KEY = "type3d:history";

export function loadJSON<T>(key: string, fallback: T): T {
  try {
    if (typeof window === "undefined" || !window.localStorage) return fallback;
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveJSON(key: string, value: unknown): void {
  try {
    if (typeof window === "undefined" || !window.localStorage) return;
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // private-mode quota or unavailable storage: silent no-op
  }
}

export function bestKey(lang: Lang, mode: Mode): string {
  const n = mode.kind === "time" ? mode.seconds : mode.count;
  return `type3d:best:${lang}:${mode.kind}:${n}`;
}

export function loadHistory(): TestResult[] {
  const parsed = loadJSON<unknown>(HISTORY_KEY, []);
  return Array.isArray(parsed) ? (parsed as TestResult[]) : [];
}

export function pushHistory(r: TestResult): TestResult[] {
  const next = [r, ...loadHistory()].slice(0, 100);
  saveJSON(HISTORY_KEY, next);
  return next;
}

export function loadBest(lang: Lang, mode: Mode): number {
  const v = loadJSON<unknown>(bestKey(lang, mode), 0);
  return typeof v === "number" && Number.isFinite(v) ? v : 0;
}

export function saveBestIfHigher(r: TestResult): { best: number; isNew: boolean } {
  const prev = loadBest(r.lang, r.mode);
  const isNew = r.wpm > prev;
  if (isNew) saveJSON(bestKey(r.lang, r.mode), r.wpm);
  return { best: isNew ? r.wpm : prev, isNew };
}

export function loadSettings(): AppSettings {
  const parsed = loadJSON<unknown>(SETTINGS_KEY, DEFAULT_SETTINGS);
  if (parsed !== null && typeof parsed === "object" && !Array.isArray(parsed)) {
    return { ...DEFAULT_SETTINGS, ...(parsed as Partial<AppSettings>) };
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(s: AppSettings): void {
  saveJSON(SETTINGS_KEY, s);
}
