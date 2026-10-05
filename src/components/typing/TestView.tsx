"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useTyping } from "@/hooks/useTyping";
import { useKeyboard } from "@/hooks/useKeyboard";
import { useSound } from "@/hooks/useSound";
import Keyboard3D from "@/components/keyboard/Keyboard3D";
import TypingArea from "@/components/typing/TypingArea";
import TypingText from "@/components/typing/TypingText";
import TypingStats from "@/components/typing/TypingStats";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import OptionGroup from "@/components/ui/OptionGroup";
import {
  SETTINGS_KEY,
  loadBest,
  loadSettings,
  saveSettings,
} from "@/lib/storage";
import { settingsToMode, type AppSettings } from "@/types/typing";

const LANG_OPTIONS = [
  { value: "en", label: "english" },
  { value: "id", label: "indonesia" },
];

const MODE_OPTIONS = [
  { value: "time", label: "time" },
  { value: "words", label: "words" },
];

const DURATION_OPTIONS = [
  { value: "15", label: "15" },
  { value: "30", label: "30" },
  { value: "60", label: "60" },
  { value: "120", label: "120" },
];

const WORD_OPTIONS = [
  { value: "10", label: "10" },
  { value: "25", label: "25" },
  { value: "50", label: "50" },
  { value: "100", label: "100" },
];

function specOf(s: AppSettings): string {
  return s.modeKind === "time"
    ? `${s.lang}:time:${s.seconds}`
    : `${s.lang}:words:${s.wordCount}`;
}

function Skeleton() {
  return (
    <div
      className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8"
      aria-busy="true"
    >
      <div className="h-6 w-24 animate-pulse rounded bg-white/10" />
      <div className="mx-auto h-9 w-80 animate-pulse rounded-md bg-white/10" />
      <div className="h-28 animate-pulse rounded bg-white/5" />
    </div>
  );
}

export default function TestView() {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [settings, setSettings] = useState<AppSettings>(() => {
    const base = loadSettings();
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return base;
    }
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(SETTINGS_KEY);
    } catch {
      return base;
    }
    if (stored !== null || base.reduceMotion) return base;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return { ...base, reduceMotion: true };
    }
    return base;
  });

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const update = (patch: Partial<AppSettings>) =>
    setSettings((s) => ({ ...s, ...patch }));

  if (!mounted) {
    return <Skeleton />;
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8">
      <header className="flex items-center gap-4">
        <Link
          href="/"
          className="font-mono text-lg font-semibold tracking-tight text-primary"
        >
          type3d
        </Link>
        <nav className="ml-auto flex items-center gap-1 text-sm">
          <Link
            href="/settings"
            className="rounded px-2 py-1 text-secondary transition-colors hover:text-primary"
          >
            settings
          </Link>
        </nav>
      </header>

      <div className="mx-auto flex w-fit max-w-full flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-md bg-surface px-4 py-2">
        <OptionGroup
          label="Language"
          value={settings.lang}
          options={LANG_OPTIONS}
          onChange={(v) => update({ lang: v === "id" ? "id" : "en" })}
        />
        <span aria-hidden="true" className="h-4 w-px bg-white/10" />
        <OptionGroup
          label="Mode"
          value={settings.modeKind}
          options={MODE_OPTIONS}
          onChange={(v) => update({ modeKind: v === "words" ? "words" : "time" })}
        />
        <span aria-hidden="true" className="h-4 w-px bg-white/10" />
        {settings.modeKind === "time" ? (
          <OptionGroup
            label="Duration"
            value={String(settings.seconds)}
            options={DURATION_OPTIONS}
            onChange={(v) =>
              update({ seconds: Number(v) as AppSettings["seconds"] })
            }
          />
        ) : (
          <OptionGroup
            label="Words"
            value={String(settings.wordCount)}
            options={WORD_OPTIONS}
            onChange={(v) =>
              update({ wordCount: Number(v) as AppSettings["wordCount"] })
            }
          />
        )}
      </div>

      <TestSession key={specOf(settings)} settings={settings} />
    </div>
  );
}

// Remounted (fresh test) whenever lang/mode spec changes — the key above
// replaces effect-driven resets entirely.
function TestSession({ settings }: { settings: AppSettings }) {
  const mode = settingsToMode(settings);
  const typing = useTyping(settings.lang, mode);
  const kb = useKeyboard();
  useSound(settings.sound, settings.volume);

  const [coarsePointer] = useState(
    () =>
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(pointer: coarse)").matches
  );

  const [dismissed, setDismissed] = useState(false);

  const force2d =
    !settings.keyboard3d || settings.reduceMotion || coarsePointer;

  const prevIndex = typing.index - 1;
  const prevState = prevIndex >= 0 ? typing.states[prevIndex] : undefined;
  const prevChar = prevIndex >= 0 ? typing.chars[prevIndex] : undefined;
  const errorId =
    prevState === "incorrect" && prevChar !== undefined
      ? prevChar === " "
        ? "SPACE"
        : prevChar.toUpperCase()
      : null;

  const best = typing.result
    ? loadBest(typing.result.lang, typing.result.mode)
    : 0;

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <span className="font-mono text-sm text-secondary">
          {settings.lang === "id" ? "indonesian" : "english"}
        </span>
        <TypingStats
          wpm={typing.liveWpm}
          accuracy={typing.liveAccuracy}
          errors={typing.errors}
          elapsedSec={typing.elapsedSec}
        />
      </div>

      <TypingArea
        typing={typing}
        kb={kb}
        keyHint={settings.keyHint}
        restartCode={settings.restartKey}
        onRestart={() => {
          setDismissed(false);
          typing.restart();
        }}
      >
        <TypingText
          chars={typing.chars}
          states={typing.states}
          index={typing.index}
        />
      </TypingArea>

      <div className="flex items-center justify-center">
        <Button
          variant="ghost"
          onClick={(e) => {
            setDismissed(false);
            typing.restart();
            e.currentTarget.blur();
          }}
        >
          restart
        </Button>
      </div>

      <div className="aspect-[2.8/1] w-full overflow-hidden">
        <Keyboard3D
          pressedIds={kb.pressedIds}
          hintId={kb.hintId}
          capsLock={kb.capsLock}
          errorId={errorId}
          force2d={force2d}
        />
      </div>
      <Modal
        open={typing.status === "finished" && !dismissed}
        title="Result"
        onClose={() => setDismissed(true)}
        actions={
          <>
            <Button
              onClick={() => {
                setDismissed(false);
                typing.restart();
              }}
            >
              Retry
            </Button>
            <Button variant="secondary" onClick={() => setDismissed(true)}>
              Change mode
            </Button>
          </>
        }
      >
        {typing.result ? (
          <div className="flex flex-col gap-5">
            {typing.isNewBest ? (
              <span className="inline-flex w-fit rounded-full bg-white px-3 py-1 font-mono text-xs font-medium text-black">
                new best
              </span>
            ) : null}
            <div className="font-mono text-5xl font-semibold tracking-tight text-primary tabular-nums">
              {typing.result.wpm.toFixed(1)}{" "}
              <span className="text-base font-normal text-secondary">wpm</span>
            </div>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 font-mono text-sm">
              <div>
                <dt className="text-secondary">accuracy</dt>
                <dd className="mt-1 text-lg text-primary tabular-nums">
                  {typing.result.accuracy.toFixed(1)}%
                </dd>
              </div>
              <div>
                <dt className="text-secondary">errors</dt>
                <dd className="mt-1 text-lg text-primary tabular-nums">
                  {typing.result.errors}
                </dd>
              </div>
              <div>
                <dt className="text-secondary">characters</dt>
                <dd className="mt-1 text-lg text-primary tabular-nums">
                  {typing.result.correctChars}/{typing.result.totalTyped}
                </dd>
              </div>
              <div>
                <dt className="text-secondary">best</dt>
                <dd className="mt-1 text-lg text-primary tabular-nums">
                  {best.toFixed(1)}
                </dd>
              </div>
            </dl>
          </div>
        ) : null}
      </Modal>
    </>
  );
}
