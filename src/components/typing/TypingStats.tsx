"use client";

import Timer from "./Timer";

interface TypingStatsProps {
  wpm: number;
  accuracy: number;
  errors: number;
  elapsedSec: number;
}

export default function TypingStats({
  wpm,
  accuracy,
  errors,
  elapsedSec,
}: TypingStatsProps) {
  return (
    <dl className="flex flex-wrap items-center gap-x-6 gap-y-1 font-mono text-sm">
      <div className="flex items-baseline gap-2">
        <dt className="text-secondary">wpm</dt>
        <dd data-testid="live-wpm" className="text-primary tabular-nums">
          {wpm.toFixed(1)}
        </dd>
      </div>
      <div className="flex items-baseline gap-2">
        <dt className="text-secondary">acc</dt>
        <dd data-testid="live-accuracy" className="text-primary tabular-nums">
          {accuracy.toFixed(1)}%
        </dd>
      </div>
      <div className="flex items-baseline gap-2">
        <dt className="text-secondary">err</dt>
        <dd data-testid="live-errors" className="text-primary tabular-nums">
          {errors}
        </dd>
      </div>
      <div className="flex items-baseline gap-2">
        <dt className="text-secondary">time</dt>
        <dd data-testid="live-time" className="text-primary">
          <Timer elapsedSec={elapsedSec} />
        </dd>
      </div>
    </dl>
  );
}
