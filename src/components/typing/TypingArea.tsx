"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { codeToId, type UseKeyboardResult } from "@/hooks/useKeyboard";
import type { CharState, TestStatus } from "@/types/typing";
import { audioManager } from "@/components/audio/AudioManager";

export interface TypingHandle {
  chars: string[];
  states: CharState[];
  index: number;
  status: TestStatus;
  handleKey: (key: string) => void;
}

interface TypingAreaProps {
  typing: TypingHandle;
  kb: UseKeyboardResult;
  keyHint: boolean;
  restartCode: string;
  onRestart: () => void;
  children: ReactNode;
}

export default function TypingArea({
  typing,
  kb,
  keyHint,
  restartCode,
  onRestart,
  children,
}: TypingAreaProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const { chars, index, status, handleKey } = typing;
  const { press, release, setHintId } = kb;

  const liveRef = useRef({ chars, index, status, handleKey, restartCode, onRestart });
  useEffect(() => {
    liveRef.current = { chars, index, status, handleKey, restartCode, onRestart };
  });

  useEffect(() => {
    wrapRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const id = codeToId(e.code);
      if (id !== null) press(id);
      const target = e.target;
      const inField =
        target instanceof HTMLElement &&
        (target.tagName === "SELECT" ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA");
      if (!inField && (e.key === " " || e.key === "Tab")) e.preventDefault();
      audioManager.unlock();
      if (inField) return;
      const t = liveRef.current;
      if (e.code === t.restartCode) {
        e.preventDefault();
        t.onRestart();
        return;
      }
      if (e.key === "Backspace") {
        t.handleKey("Backspace");
        audioManager.play("backspace");
        return;
      }
      if (e.key === "Enter") {
        audioManager.play("enter");
        return;
      }
      if (e.key.length !== 1) return;
      const expected = t.chars[t.index];
      t.handleKey(e.key);
      if (expected !== undefined && e.key !== expected) {
        audioManager.play("error");
      } else if (e.key === " ") {
        audioManager.play("space");
      } else {
        audioManager.play("key");
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const id = codeToId(e.code);
      if (id !== null) release(id);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [press, release]);

  useEffect(() => {
    if (!keyHint) {
      setHintId(null);
      return;
    }
    const next = chars[index];
    if (next === undefined) {
      setHintId(null);
      return;
    }
    setHintId(next === " " ? "SPACE" : next.toUpperCase());
  }, [chars, index, keyHint, setHintId]);
  useEffect(() => {
    const wrap = wrapRef.current;
    const caret = wrap?.querySelector("[data-caret]");
    const anchor = caret instanceof HTMLElement ? caret.parentElement : null;
    if (!wrap || !(anchor instanceof HTMLElement)) return;
    const style = window.getComputedStyle(anchor);
    const lineH = parseFloat(style.lineHeight) || anchor.offsetHeight || 40;
    // Park the active line on the second visible row, so one previous line
    // stays in view. offsetTop is relative to the wrapper's border box.
    wrap.scrollTop = Math.max(0, anchor.offsetTop - lineH);
  }, [chars, index]);

  return (
    <div
      ref={wrapRef}
      tabIndex={0}
      autoFocus
      onClick={() => wrapRef.current?.focus()}
      aria-label="Typing area. Click here and start typing."
      className="relative max-h-[8.75rem] cursor-text overflow-hidden px-1 py-2 outline-none focus-visible:rounded focus-visible:ring-1 focus-visible:ring-white/40"
    >
      {children}
    </div>
  );
}
