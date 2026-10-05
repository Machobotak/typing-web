"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CharState, Lang, Mode, TestResult } from "@/types/typing";
import { createTest, handleKey as reduceKey, type EngineState } from "@/engine/typingEngine";
import { extendText, generateText } from "@/engine/textGenerator";
import { calcAccuracy, calcWPM } from "@/engine/statistics";
import { nowSec } from "@/engine/timer";
import { pushHistory, saveBestIfHigher } from "@/lib/storage";

// Parent remounts via key when lang/mode change, so props are initial only.
export function useTyping(initLang: Lang, initMode: Mode) {
  const [activeLang, setActiveLang] = useState<Lang>(initLang);
  const [activeMode, setActiveMode] = useState<Mode>(initMode);
  const [engine, setEngine] = useState<EngineState>(() =>
    createTest(generateText(initLang, initMode))
  );
  const engineRef = useRef(engine);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [result, setResult] = useState<TestResult | null>(null);
  const [isNewBest, setIsNewBest] = useState(false);

  const resetTo = useCallback((nextLang: Lang, nextMode: Mode) => {
    const fresh = createTest(generateText(nextLang, nextMode));
    engineRef.current = fresh;
    setEngine(fresh);
    setActiveLang(nextLang);
    setActiveMode(nextMode);
    setElapsedSec(0);
    setResult(null);
    setIsNewBest(false);
  }, []);

  const finish = useCallback(() => {
    const current = engineRef.current;
    if (current.status === "finished") return;
    const elapsed =
      current.startedAt !== null ? Math.max(0, nowSec() - current.startedAt) : 0;
    const durationSec = activeMode.kind === "time" ? activeMode.seconds : elapsed;
    const finalResult: TestResult = {
      wpm: calcWPM(current.correctTyped, durationSec),
      accuracy: calcAccuracy(current.correctTyped, current.totalTyped),
      errors: current.errors,
      correctChars: current.correctTyped,
      totalTyped: current.totalTyped,
      durationSec,
      lang: activeLang,
      mode: activeMode,
      at: Date.now(),
    };
    const finished: EngineState = { ...current, status: "finished" };
    engineRef.current = finished;
    setEngine(finished);
    setElapsedSec(durationSec);
    setResult(finalResult);
    pushHistory(finalResult);
    setIsNewBest(saveBestIfHigher(finalResult).isNew);
  }, [activeLang, activeMode]);

  const handleKey = useCallback(
    (key: string) => {
      const current = engineRef.current;
      if (current.status === "finished") return;
      const next = reduceKey(current, key, nowSec());
      if (next === current) return;
      if (
        activeMode.kind === "time" &&
        next.status === "running" &&
        next.index >= next.text.length
      ) {
        const extended = extendText(next.text, activeLang);
        if (extended.length > next.text.length) {
          const grown: EngineState = {
            ...next,
            text: extended,
            states: next.states.concat(
              new Array<CharState>(extended.length - next.text.length).fill("pending")
            ),
          };
          engineRef.current = grown;
          setEngine(grown);
          return;
        }
      }
      engineRef.current = next;
      setEngine(next);
      if (
        activeMode.kind === "words" &&
        next.status === "running" &&
        next.index >= next.text.length
      ) {
        finish();
      }
    },
    [activeLang, activeMode, finish]
  );

  const restart = useCallback(
    (nl?: Lang, nm?: Mode) => {
      resetTo(nl ?? activeLang, nm ?? activeMode);
    },
    [resetTo, activeLang, activeMode]
  );

  useEffect(() => {
    if (engine.status !== "running") return;
    const id = window.setInterval(() => {
      const current = engineRef.current;
      if (current.status !== "running" || current.startedAt === null) return;
      const elapsed = nowSec() - current.startedAt;
      setElapsedSec(elapsed);
      if (activeMode.kind === "time" && elapsed >= activeMode.seconds) finish();
    }, 100);
    return () => window.clearInterval(id);
  }, [engine.status, activeMode, finish]);

  return {
    chars: engine.text.split(""),
    states: engine.states,
    index: engine.index,
    status: engine.status,
    elapsedSec,
    liveWpm: calcWPM(engine.correctTyped, elapsedSec),
    liveAccuracy: calcAccuracy(engine.correctTyped, engine.totalTyped),
    errors: engine.errors,
    result,
    isNewBest,
    finish,
    restart,
    handleKey,
  };
}
