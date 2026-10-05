export type CharState = "pending" | "current" | "correct" | "incorrect";

export type TestStatus = "idle" | "running" | "finished";

export type Lang = "id" | "en";

export type Mode =
  | { kind: "time"; seconds: 15 | 30 | 60 | 120 }
  | { kind: "words"; count: 10 | 25 | 50 | 100 };

export interface KeyEvent {
  id: string;
  code: string;
  pressed: boolean;
}

export interface TestResult {
  wpm: number;
  accuracy: number;
  errors: number;
  correctChars: number;
  totalTyped: number;
  durationSec: number;
  lang: Lang;
  mode: Mode;
  at: number;
}

export interface AppSettings {
  lang: Lang;
  modeKind: "time" | "words";
  seconds: 15 | 30 | 60 | 120;
  wordCount: 10 | 25 | 50 | 100;
  sound: boolean;
  volume: 0 | 25 | 50 | 75 | 100;
  keyboard3d: boolean;
  keyHint: boolean;
  reduceMotion: boolean;
  restartKey: string;
}

export const DEFAULT_SETTINGS: AppSettings = {
  lang: "en",
  modeKind: "time",
  seconds: 30,
  wordCount: 25,
  sound: true,
  volume: 50,
  keyboard3d: true,
  keyHint: false,
  reduceMotion: false,
  restartKey: "Tab",
};

export function settingsToMode(s: AppSettings): Mode {
  return s.modeKind === "time"
    ? { kind: "time", seconds: s.seconds }
    : { kind: "words", count: s.wordCount };
}
